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
  const out = new Response(res.body, { headers: { "Content-Type": res.headers.get("Content-Type") || "application/json" }, status: res.status });
  if (res.ok) await cache.put(cacheKey, new Response(out.clone().body, out));
  return out;
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
  </style>
</head>
<body>
  <h1>📊 ${OWNER}/${REPO} Dashboard</h1>
  <p class="muted">Live data via GitHub API, cached at the edge.</p>

  <div class="grid">
    <div class="card" id="repoCard"><h2>Repository</h2><div>Loading…</div></div>
    <div class="card" id="readmeCard"><h2>README</h2><div>Loading…</div></div>
    <div class="card" id="filesCard"><h2>Files (root)</h2><div>Loading…</div></div>
    <div class="card" id="commitsCard"><h2>Recent commits</h2><div>Loading…</div></div>
  </div>

  <script type="module">
    const owner = "${OWNER}";
    const repo = "${REPO}";
    const fmtDate = s => new Date(s).toLocaleString();

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

        document.querySelector("#repoCard").innerHTML = \`
          <h2>Repository</h2>
          <div class="mono">\${owner}/\${repo}</div>
          <p>⭐ \${repoInfo.stargazers_count} 🍴 \${repoInfo.forks_count} 👀 \${repoInfo.subscribers_count}</p>
          <p>Default branch: <code>\${repoInfo.default_branch}</code></p>
          <p>Updated: \${fmtDate(repoInfo.updated_at)}</p>
          <p><a href="\${repoInfo.html_url}" target="_blank" rel="noreferrer">Open on GitHub</a></p>
        \`;

        const readmeHtml = atob(readme.content || "");
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

      } catch (e) {
        document.body.insertAdjacentHTML("beforeend", "<p style='color:red'>Failed to load data.</p>");
        console.error(e);
      }
    }
    render();
  </script>
</body>
</html>`;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const p = url.pathname;

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
