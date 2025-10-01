/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
export interface Env {
  GITHUB_TOKEN?: string;
}

const OWNER = "JT6602";
const REPO = "jt6602.github.io";
const API = "https://api.github.com";
const GAME_PROGRESS_PATHS = new Set(["/api/game/progress", "/api/game/sync", "/api/game/report"]);
const TEAM_COUNT = 11;
const PUZZLE_COUNT = 12;
const SCOREBOARD_CACHE_KEY = new Request("https://dashboard.internal/game-state");

interface ScoreboardEntry {
  teamId: number;
  teamName: string;
  solved: number;
  puzzleCount: number;
  hasStarted: boolean;
  hasWon: boolean;
  currentPuzzleIndex: number | null;
  nextPuzzleIndex: number | null;
  nextPuzzleLabel: string | null;
  completions: boolean[];
  unlocked: boolean[];
  updatedAt: string;
  lastEvent: string | null;
  progressPercent: number;
}

interface ScoreboardState {
  updatedAt: string | null;
  puzzleCount: number;
  totalTeams: number;
  teams: Record<string, ScoreboardEntry>;
}

interface SanitizedProgress {
  entry: ScoreboardEntry;
}

let scoreboardMemory: ScoreboardState | null = null;

async function gh(request: Request, env: Env, path: string) {
  const url = `${API}${path}`;
  const headers: Record<string, string> = {
    "Accept": "application/vnd.github+json",
    "User-Agent": "cf-worker-repo-dashboard"
  };
  if (env.GITHUB_TOKEN) headers["Authorization"] = `Bearer ${env.GITHUB_TOKEN}`;

  // edge cache for 5 minutes
  const cacheKey = new Request(url, { headers });
  const cache = caches.default;
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const res = await fetch(url, { headers });
  const responseHeaders = new Headers();
  for (const [key, value] of res.headers) {
    responseHeaders.set(key, value);
  }
  if (!responseHeaders.has("Content-Type")) {
    responseHeaders.set("Content-Type", "application/json");
  }
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("transfer-encoding");

  const bodyBuffer = await res.arrayBuffer();
  responseHeaders.delete("content-length");
  if (res.status !== 204 && res.status !== 304) {
    responseHeaders.set("Content-Length", bodyBuffer.byteLength.toString());
  }

  const out = new Response(bodyBuffer, {
    status: res.status,
    statusText: res.statusText,
    headers: responseHeaders
  });
  if (res.ok) {
    await cache.put(cacheKey, out.clone());
  }
  return out;
}

function blankScoreboard(): ScoreboardState {
  return {
    updatedAt: null,
    puzzleCount: PUZZLE_COUNT,
    totalTeams: TEAM_COUNT,
    teams: {}
  };
}

function cloneEntry(entry: ScoreboardEntry): ScoreboardEntry {
  return {
    ...entry,
    completions: entry.completions.slice(),
    unlocked: entry.unlocked.slice()
  };
}

function cloneScoreboard(state: ScoreboardState): ScoreboardState {
  const teams: Record<string, ScoreboardEntry> = {};
  for (const [key, value] of Object.entries(state.teams)) {
    teams[key] = cloneEntry(value);
  }
  return {
    updatedAt: state.updatedAt,
    puzzleCount: state.puzzleCount,
    totalTeams: state.totalTeams,
    teams
  };
}

async function readScoreboard(): Promise<ScoreboardState> {
  if (scoreboardMemory) {
    return cloneScoreboard(scoreboardMemory);
  }
  try {
    const cached = await caches.default.match(SCOREBOARD_CACHE_KEY);
    if (cached) {
      const parsed = (await cached.clone().json()) as ScoreboardState;
      scoreboardMemory = cloneScoreboard(parsed);
      return cloneScoreboard(scoreboardMemory);
    }
  } catch (err) {
    console.warn("Failed to read cached scoreboard", err);
  }
  scoreboardMemory = blankScoreboard();
  return cloneScoreboard(scoreboardMemory);
}

async function persistScoreboard(state: ScoreboardState): Promise<void> {
  scoreboardMemory = cloneScoreboard(state);
  try {
    const response = new Response(JSON.stringify(scoreboardMemory), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store"
      }
    });
    await caches.default.put(SCOREBOARD_CACHE_KEY, response);
  } catch (err) {
    console.warn("Failed to persist scoreboard", err);
  }
}

function boolArrayFrom(input: unknown, length: number): boolean[] {
  const base = Array.from({ length }, () => false);
  if (!Array.isArray(input)) {
    return base;
  }
  return base.map((_, index) => Boolean(input[index]));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function sanitizeLabel(value: unknown, fallback: string, maxLength = 80): string {
  if (typeof value !== "string") {
    return fallback;
  }
  const cleaned = value.replace(/[\r\n\t]+/g, " ").trim();
  if (!cleaned) {
    return fallback;
  }
  return cleaned.slice(0, maxLength);
}

function sanitizeReason(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const cleaned = value.replace(/[\r\n\t]+/g, " ").trim();
  if (!cleaned) {
    return null;
  }
  return cleaned.slice(0, 60);
}

function toIndex(value: unknown, puzzleCount: number): number | null {
  if (typeof value !== "number" && typeof value !== "string") {
    return null;
  }
  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  const clamped = clamp(parsed, 0, puzzleCount - 1);
  return Number.isInteger(clamped) ? clamped : null;
}

function safeTimestamp(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "string") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }
  return new Date().toISOString();
}

function sanitizeGameProgress(payload: unknown): SanitizedProgress | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }
  const raw = payload as Record<string, unknown>;
  if (!Number.isFinite(raw.teamId)) {
    return null;
  }

  const teamId = clamp(Number(raw.teamId), 0, TEAM_COUNT - 1);
  const rawPuzzleCount = Number.isFinite(raw.puzzleCount) ? Number(raw.puzzleCount) : PUZZLE_COUNT;
  const puzzleCount = clamp(Math.trunc(rawPuzzleCount), 1, PUZZLE_COUNT);
  const completions = boolArrayFrom(raw.completions, puzzleCount);
  const unlocked = boolArrayFrom(raw.unlocked, puzzleCount).map((value, index) => value || completions[index]);
  const solved = Number.isFinite(raw.solved)
    ? clamp(Math.trunc(Number(raw.solved)), 0, puzzleCount)
    : completions.filter(Boolean).length;
  const hasStarted = Boolean(raw.hasStarted) || unlocked.some(Boolean) || completions.some(Boolean);
  const hasWon = raw.hasWon === true || solved >= puzzleCount;
  const currentPuzzleIndex = toIndex(raw.currentPuzzleIndex, puzzleCount);
  const nextPuzzleIndex = toIndex(raw.nextPuzzleIndex, puzzleCount);
  const nextPuzzleLabel = typeof raw.nextPuzzleLabel === "string" && raw.nextPuzzleLabel.trim()
    ? sanitizeLabel(raw.nextPuzzleLabel, `Mission ${(nextPuzzleIndex ?? 0) + 1}`, 120)
    : nextPuzzleIndex !== null
    ? `Mission ${nextPuzzleIndex + 1}`
    : null;
  const teamName = sanitizeLabel(raw.teamName, `Team ${teamId + 1}`, 80);
  const updatedAt = safeTimestamp(raw.timestamp);
  const lastEvent = sanitizeReason(raw.reason);
  const progressPercent = puzzleCount > 0 ? clamp(Math.round((solved / puzzleCount) * 100), 0, 100) : 0;

  const entry: ScoreboardEntry = {
    teamId,
    teamName,
    solved,
    puzzleCount,
    hasStarted,
    hasWon,
    currentPuzzleIndex,
    nextPuzzleIndex,
    nextPuzzleLabel,
    completions,
    unlocked,
    updatedAt,
    lastEvent,
    progressPercent
  };

  return { entry };
}

function applyProgressUpdate(state: ScoreboardState, update: SanitizedProgress): ScoreboardState {
  const working = cloneScoreboard(state);
  const entry = cloneEntry(update.entry);
  working.updatedAt = entry.updatedAt;
  working.puzzleCount = Math.max(working.puzzleCount, entry.puzzleCount);
  working.totalTeams = Math.max(working.totalTeams, entry.teamId + 1);
  working.teams[String(entry.teamId)] = entry;
  return working;
}

function withCors(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  headers.set("Access-Control-Max-Age", "86400");
  headers.append("Vary", "Origin");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

function jsonResponse(data: unknown, status = 200): Response {
  const response = new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    }
  });
  return withCors(response);
}

function badRequest(message: string): Response {
  return jsonResponse({ error: message }, 400);
}

function methodNotAllowed(allowed: string[]): Response {
  const response = new Response("Method Not Allowed", {
    status: 405,
    headers: {
      Allow: allowed.join(", ")
    }
  });
  return withCors(response);
}

function corsPreflight(): Response {
  const response = new Response(null, {
    status: 204,
    headers: {
      "Content-Length": "0"
    }
  });
  return withCors(response);
}

async function safeJson<T = unknown>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch (err) {
    console.warn("Failed to parse JSON body", err);
    return null;
  }
}

function html(page: string) {
  return new Response(page, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}

function pageTemplate() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${OWNER}/${REPO} — Repo Dashboard</title>
  <style>
    :root { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
    body { margin: 2rem; }
    .grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
    .card { border: 1px solid #ddd; border-radius: 12px; padding: 1rem; box-shadow: 0 1px 4px rgba(0,0,0,.04); }
    h1 { margin: 0 0 1rem; font-size: 1.4rem; }
    h2 { margin: .2rem 0 .8rem; font-size: 1.1rem; }
    code, pre { background: #fafafa; padding: .25rem .5rem; border-radius: 6px; }
    .muted { color: #666; font-size: .9rem; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: .4rem .5rem; border-bottom: 1px solid #eee; }
    .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
    .game-table tbody tr:nth-child(even) { background: #fafbff; }
    .status-pill { display: inline-flex; align-items: center; gap: .3rem; padding: .15rem .6rem; border-radius: 999px; font-size: .8rem; background: #eef2ff; color: #3730a3; }
    .status-pill.is-complete { background: #dcfce7; color: #166534; }
    .status-pill.is-idle { background: #f3f4f6; color: #4b5563; }
    .progress-rail { width: 100%; height: 8px; border-radius: 999px; background: #eef0f3; overflow: hidden; margin-top: .35rem; }
    .progress-rail-bar { height: 100%; background: #6366f1; transition: width .4s ease; }
  </style>
</head>
<body>
  <h1>📊 ${OWNER}/${REPO} Dashboard</h1>
  <p class="muted">Live data via GitHub API, cached at the edge.</p>

  <div class="grid">
    <div class="card" id="repoCard"><h2>Repository</h2><div>Loading…</div></div>
    <div class="card" id="gameCard"><h2>Game Tracker</h2><div class="muted">Awaiting device updates…</div></div>
    <div class="card" id="readmeCard"><h2>README</h2><div>Loading…</div></div>
    <div class="card" id="filesCard"><h2>Files (root)</h2><div>Loading…</div></div>
    <div class="card" id="commitsCard"><h2>Recent commits</h2><div>Loading…</div></div>
  </div>

  <script type="module">
    const owner = "${OWNER}";
    const repo = "${REPO}";
    const GAME_REFRESH_INTERVAL_MS = 15000;
    const fmtDate = s => new Date(s).toLocaleString();
    const decodeBase64 = input => {
      if (!input) return "";
      try {
        return atob(String(input).replace(/\s+/g, ""));
      } catch (err) {
        console.error("Failed to decode base64", err);
        return "";
      }
    };
    const escapeMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => escapeMap[char] ?? char);

    async function getJSON(path) {
      const res = await fetch(path);
      if (!res.ok) throw new Error("Request failed");
      return res.json();
    }

    async function render() {
      try {
        const [repoInfo, readme, files, commits] = await Promise.all([
          getJSON("/api/repo"),
          getJSON("/api/readme"),
          getJSON("/api/files"),
          getJSON("/api/commits")
        ]);
        const gameState = await getJSON("/api/game/state").catch(err => {
          console.warn("Unable to load game state", err);
          return null;
        });

        document.querySelector("#repoCard").innerHTML = \`
          <h2>Repository</h2>
          <div class="mono">\${owner}/\${repo}</div>
          <p>⭐ \${repoInfo.stargazers_count} 🍴 \${repoInfo.forks_count} 👀 \${repoInfo.subscribers_count}</p>
          <p>Default branch: <code>\${repoInfo.default_branch}</code></p>
          <p>Updated: \${fmtDate(repoInfo.updated_at)}</p>
          <p><a href="\${repoInfo.html_url}" target="_blank" rel="noreferrer">Open on GitHub</a></p>
        \`;

        const readmeHtml = decodeBase64(readme.content);
        document.querySelector("#readmeCard").innerHTML = \`
          <h2>README</h2>
          <div class="muted">\${readme.name} — \${(readme.size/1024).toFixed(1)} KB</div>
          <pre style="max-height: 280px; overflow:auto;">\${readmeHtml.substring(0, 600)}\${readmeHtml.length>600 ? "…": ""}</pre>
        \`;

        document.querySelector("#filesCard").innerHTML = \`
          <h2>Files (root)</h2>
          <table>
            <thead><tr><th>Name</th><th>Type</th><th>Size</th></tr></thead>
            <tbody>
              \${files.map(f => \`<tr><td>\${f.name}</td><td>\${f.type}</td><td>\${f.size ?? ""}</td></tr>\`).join("")}
            </tbody>
          </table>
        \`;

        document.querySelector("#commitsCard").innerHTML = \`
          <h2>Recent commits</h2>
          <ul>
            \${commits.slice(0, 10).map(c => \`<li><span class="mono">\${c.sha.substring(0,7)}</span> — \${c.commit.message.split("\\n")[0]} <span class="muted">(\${fmtDate(c.commit.author.date)})</span></li>\`).join("")}
          </ul>
        \`;

        renderGameCard(gameState);

      } catch (e) {
        document.body.insertAdjacentHTML("beforeend", "<p style='color:red'>Failed to load data.</p>");
        console.error(e);
      }
    }
    function renderGameCard(gameState) {
      const card = document.querySelector("#gameCard");
      if (!card) return;

      if (!gameState || typeof gameState !== "object" || !gameState.teams) {
        card.innerHTML = \`
          <h2>Game Tracker</h2>
          <p class="muted">No game data yet. Devices sync once a team starts playing.</p>
        \`;
        return;
      }

      const teams = Object.values(gameState.teams ?? {});
      if (!teams.length) {
        card.innerHTML = \`
          <h2>Game Tracker</h2>
          <div class="muted">Last sync: \${gameState.updatedAt ? fmtDate(gameState.updatedAt) : 'Awaiting devices'}</div>
          <p class="muted">No teams have reported progress yet.</p>
        \`;
        return;
      }

      teams.sort((a, b) => {
        const solvedDiff = (b.solved ?? 0) - (a.solved ?? 0);
        if (solvedDiff !== 0) return solvedDiff;
        const winDiff = Number(b.hasWon) - Number(a.hasWon);
        if (winDiff !== 0) return winDiff;
        const bTime = Date.parse(b.updatedAt ?? "") || 0;
        const aTime = Date.parse(a.updatedAt ?? "") || 0;
        return bTime - aTime;
      });

      const rows = teams.map(team => {
        const status = describeTeamStatus(team);
        const lastEvent = team.lastEvent ? '<div class="muted">' + escapeHtml(team.lastEvent) + '</div>' : "";
        const updated = team.updatedAt ? fmtDate(team.updatedAt) : "–";
        const progressPercent = Math.max(0, Math.min(100, Number(team.progressPercent ?? 0)));
        return \`
          <tr>
            <td>
              <div class="mono">\${escapeHtml(team.teamName)}</div>
              <div class="muted">Solved \${team.solved} of \${team.puzzleCount}</div>
            </td>
            <td>
              <div>\${team.solved} / \${team.puzzleCount} puzzles</div>
              <div class="progress-rail"><div class="progress-rail-bar" style="width: \${progressPercent}%"></div></div>
              <div class="muted">\${progressPercent}% complete</div>
            </td>
            <td>
              <span class="\${status.className}">\${escapeHtml(status.label)}</span>
              \${lastEvent}
            </td>
            <td>
              <div>\${escapeHtml(updated)}</div>
            </td>
          </tr>
        \`;
      }).join("");

      card.innerHTML = \`
        <h2>Game Tracker</h2>
        <div class="muted">Last sync: \${gameState.updatedAt ? fmtDate(gameState.updatedAt) : 'Pending'}</div>
        <table class="game-table">
          <thead>
            <tr><th>Team</th><th>Progress</th><th>Status</th><th>Updated</th></tr>
          </thead>
          <tbody>\${rows}</tbody>
        </table>
        <p class="muted">Showing \${teams.length} of \${gameState.totalTeams ?? teams.length} teams.</p>
      \`;
    }

    function describeTeamStatus(team) {
      if (team.hasWon) {
        return { label: "Tower complete", className: "status-pill is-complete" };
      }
      if (!team.hasStarted) {
        return { label: "Not started", className: "status-pill is-idle" };
      }
      const label = team.nextPuzzleLabel ? 'Next: ' + team.nextPuzzleLabel : 'Exploring';
      return { label, className: "status-pill" };
    }

    async function refreshLoop() {
      try {
        await render();
      } catch (err) {
        console.error("Dashboard refresh failed", err);
      } finally {
        setTimeout(refreshLoop, GAME_REFRESH_INTERVAL_MS);
      }
    }

    refreshLoop();
  </script>
</body>
</html>`;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const p = url.pathname;

    if (p === "/api/game/state") {
      if (request.method === "OPTIONS") {
        return corsPreflight();
      }
      if (request.method === "GET") {
        const scoreboard = await readScoreboard();
        return jsonResponse(scoreboard);
      }
      return methodNotAllowed(["GET", "OPTIONS"]);
    }

    if (GAME_PROGRESS_PATHS.has(p)) {
      if (request.method === "OPTIONS") {
        return corsPreflight();
      }
      if (request.method !== "POST") {
        return methodNotAllowed(["POST", "OPTIONS"]);
      }
      const payload = await safeJson(request);
      const sanitized = sanitizeGameProgress(payload);
      if (!sanitized) {
        return badRequest("Missing or invalid team progress data");
      }
      const current = await readScoreboard();
      const updated = applyProgressUpdate(current, sanitized);
      await persistScoreboard(updated);
      return jsonResponse(updated);
    }

    if (p === "/") return html(pageTemplate());

    if (p === "/api/repo") {
      return gh(request, env, `/repos/${OWNER}/${REPO}`);
    }
    if (p === "/api/files") {
      return gh(request, env, `/repos/${OWNER}/${REPO}/contents/`);
    }
    if (p === "/api/readme") {
      return gh(request, env, `/repos/${OWNER}/${REPO}/readme`);
    }
    if (p === "/api/commits") {
      return gh(request, env, `/repos/${OWNER}/${REPO}/commits?per_page=20`);
    }

    return new Response("Not found", { status: 404 });
  }
};
