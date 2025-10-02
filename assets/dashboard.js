(() => {
  const GM_PASSWORD = "GoTowerHats";
  const GM_PASSWORD_TOKEN_KEY = "towerHuntGmToken";
  const GM_SESSION_TOKEN_KEY = "towerHuntGmSession";
  const DATA_ENDPOINT = "https://script.google.com/macros/s/AKfycbyz17Xpv8QY4ul-Abc7e40eME7Xzbw503R-sWliOsrYy4CKZmVULoW-S3he2OLPAantsw/exec?sheet=UserData&token=1232435jvghfcgxdfgfcyguyuh1de2fr39u89y78gtghbijoqidwe2f089hyqdwefrjpihugy879";
  const CLEAR_STORAGE_KEY = "towerDashboardClearedAfter";
  const PUZZLE_LABELS = [
    "Basement",
    "Floor 1",
    "Floor 2",
    "Floor 3",
    "Floor 4",
    "Floor 5",
    "Floor 6",
    "Floor 7",
    "Floor 8",
    "Floor 9",
    "Floor 10",
    "Floor 11"
  ];

  const shell = document.getElementById("dashboardShell");
  const statusLabel = document.getElementById("dashboardStatus");
  const tableWrapper = document.getElementById("dashboardTableWrapper");
  const refreshButton = document.getElementById("refreshDashboardData");
  const clearButton = document.getElementById("clearDashboardData");
  const signOutButton = document.getElementById("dashboardSignOut");

  const gmState = {
    overlay: null,
    form: null,
    input: null,
    remember: null,
    feedback: null
  };

  let latestEntries = [];

  function init() {
    if (!shell) {
      return;
    }

    shell.hidden = true;

    refreshButton?.addEventListener("click", () => {
      loadData({ showLoading: true });
    });

    clearButton?.addEventListener("click", handleClearData);

    signOutButton?.addEventListener("click", handleSignOut);

    updateClearButtonLabel();

    if (hasValidGmToken()) {
      grantAccess();
    } else {
      showGmAuthOverlay();
    }
  }

  function grantAccess() {
    shell.hidden = false;
    loadData({ showLoading: true });
  }

  function hasValidGmToken() {
    const sessionToken = getSessionGmToken();
    if (validateGmToken(sessionToken)) {
      return true;
    }
    const storedToken = getStoredGmToken();
    if (validateGmToken(storedToken)) {
      setSessionGmToken(storedToken);
      return true;
    }
    return false;
  }

  function validateGmToken(token) {
    if (!token) {
      return false;
    }
    return token === createGmToken(GM_PASSWORD);
  }

  function createGmToken(value) {
    try {
      return window.btoa(value);
    } catch (err) {
      return value;
    }
  }

  function getStoredGmToken() {
    try {
      return window.localStorage?.getItem(GM_PASSWORD_TOKEN_KEY) ?? null;
    } catch (err) {
      return null;
    }
  }

  function setStoredGmToken(token) {
    try {
      if (token) {
        window.localStorage?.setItem(GM_PASSWORD_TOKEN_KEY, token);
      } else {
        window.localStorage?.removeItem(GM_PASSWORD_TOKEN_KEY);
      }
    } catch (err) {
      // ignore storage issues
    }
  }

  function getSessionGmToken() {
    try {
      return window.sessionStorage?.getItem(GM_SESSION_TOKEN_KEY) ?? null;
    } catch (err) {
      return null;
    }
  }

  function setSessionGmToken(token) {
    try {
      if (token) {
        window.sessionStorage?.setItem(GM_SESSION_TOKEN_KEY, token);
      } else {
        window.sessionStorage?.removeItem(GM_SESSION_TOKEN_KEY);
      }
    } catch (err) {
      // ignore session storage issues
    }
  }

  function showGmAuthOverlay() {
    if (gmState.overlay) {
      gmState.overlay.removeAttribute("hidden");
      gmState.input?.classList.remove("is-invalid");
      gmState.feedback?.classList.remove("is-success");
      if (gmState.feedback) gmState.feedback.textContent = "";
      gmState.input?.focus();
      return;
    }

    const overlay = document.createElement("div");
    overlay.className = "gm-auth-overlay";

    const card = document.createElement("div");
    card.className = "gm-auth-card";

    const heading = document.createElement("h1");
    heading.textContent = "Game Master Access";

    const intro = document.createElement("p");
    intro.textContent = "Enter the GM passphrase to view stored user data.";

    const form = document.createElement("form");
    form.noValidate = true;

    const field = document.createElement("div");
    field.className = "gm-auth-field";

    const label = document.createElement("label");
    label.setAttribute("for", "gmAuthPassword");
    label.textContent = "Passphrase";

    const input = document.createElement("input");
    input.type = "password";
    input.id = "gmAuthPassword";
    input.autocomplete = "current-password";
    input.placeholder = "GM passphrase";

    field.append(label, input);

    const remember = document.createElement("label");
    remember.className = "gm-auth-remember";

    const rememberInput = document.createElement("input");
    rememberInput.type = "checkbox";
    rememberInput.id = "gmRememberSession";

    remember.append(rememberInput, document.createTextNode("Remember on this device"));

    const actions = document.createElement("div");
    actions.className = "gm-auth-actions";

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Unlock";

    actions.append(submitButton);

    const feedback = document.createElement("div");
    feedback.className = "gm-auth-feedback";

    form.append(field, remember, actions, feedback);
    card.append(heading, intro, form);
    overlay.append(card);
    document.body.append(overlay);

    gmState.overlay = overlay;
    gmState.form = form;
    gmState.input = input;
    gmState.remember = rememberInput;
    gmState.feedback = feedback;

    form.addEventListener("submit", handleGmSubmit);
    input.addEventListener("input", () => {
      input.classList.remove("is-invalid");
      feedback.textContent = "";
      feedback.classList.remove("is-success");
    });

    window.setTimeout(() => {
      input.focus();
    }, 60);
  }

  function handleGmSubmit(event) {
    event.preventDefault();
    if (!gmState.input) {
      return;
    }
    const supplied = gmState.input.value.trim();
    if (!supplied) {
      showGmError("Enter the passphrase to continue.");
      return;
    }
    if (!validateGmToken(createGmToken(supplied))) {
      showGmError("Incorrect passphrase. Try again.");
      return;
    }

    const token = createGmToken(GM_PASSWORD);
    setSessionGmToken(token);
    if (gmState.remember?.checked) {
      setStoredGmToken(token);
    } else {
      setStoredGmToken(null);
    }

    if (gmState.feedback) {
      gmState.feedback.textContent = "Access granted.";
      gmState.feedback.classList.add("is-success");
    }
    gmState.input.classList.remove("is-invalid");

    window.setTimeout(() => {
      gmState.overlay?.remove();
      gmState.overlay = null;
      gmState.form = null;
      gmState.input = null;
      gmState.remember = null;
      gmState.feedback = null;
      grantAccess();
    }, 180);
  }

  function showGmError(message) {
    if (!gmState.input || !gmState.feedback) {
      return;
    }
    gmState.input.classList.add("is-invalid");
    gmState.feedback.textContent = message;
    gmState.feedback.classList.remove("is-success");
    gmState.input.focus();
    gmState.input.select();
  }

  async function loadData({ showLoading = false } = {}) {
    if (showLoading) {
      setStatus("Loading user data…");
    }

    try {
      const response = await fetch(DATA_ENDPOINT, {
        headers: {
          Accept: "application/json"
        },
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const payload = await response.json();
      latestEntries = normalizeDashboardEntries(payload);
      renderTable(latestEntries);
      setStatus(`Last updated ${new Date().toLocaleTimeString()}`);
    } catch (err) {
      console.error("Dashboard data fetch failed", err);
      setStatus("Unable to load user data. Try refreshing.", { error: true });
    }
  }

  function renderTable(entries) {
    if (!tableWrapper) {
      return;
    }

    tableWrapper.innerHTML = "";

    const clearedAfter = getClearedAfter();
    const clearedThreshold = Number.isFinite(clearedAfter) ? clearedAfter : null;

    const sourceEntries = Array.isArray(entries) ? entries.slice() : [];
    const visibleEntries = clearedThreshold === null
      ? sourceEntries
      : sourceEntries.filter(entry => entry.timestampValue > clearedThreshold);

    if (!visibleEntries.length) {
      const empty = document.createElement("div");
      empty.className = "dashboard-empty";
      if (clearedThreshold !== null && sourceEntries.length) {
        empty.textContent = "Dashboard cleared. Waiting for the next update…";

        const restoreButton = document.createElement("button");
        restoreButton.type = "button";
        restoreButton.className = "dashboard-empty-button";
        restoreButton.textContent = "Show historical data";
        restoreButton.addEventListener("click", () => {
          clearClearedAfter();
          updateClearButtonLabel();
          renderTable(entries);
        });
        empty.append(document.createElement("br"), restoreButton);
      } else {
        empty.textContent = "No user data has been recorded yet.";
      }
      tableWrapper.append(empty);
      return;
    }

    visibleEntries.sort(sortEntries);

    const table = document.createElement("table");
    table.className = "dashboard-table";

    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    const headers = ["Team", "Tower Location", "Progress", "Last Update"];
    for (const label of headers) {
      const th = document.createElement("th");
      th.textContent = label;
      headRow.append(th);
    }
    thead.append(headRow);

    const tbody = document.createElement("tbody");
    for (const entry of visibleEntries) {
      const tr = document.createElement("tr");

      const teamCell = document.createElement("td");
      const nameEl = document.createElement("div");
      nameEl.className = "dashboard-team-name";
      nameEl.textContent = entry.teamName;
      const teamMetaEl = document.createElement("div");
      teamMetaEl.className = "dashboard-team-meta";
      teamMetaEl.textContent = `Team ${entry.teamId + 1}`;
      const statusDescriptor = describeTeamStatus(entry);
      if (statusDescriptor) {
        const statusEl = document.createElement("span");
        statusEl.className = statusDescriptor.className;
        statusEl.textContent = statusDescriptor.label;
        teamMetaEl.append(" · ", statusEl);
      }
      teamCell.append(nameEl, teamMetaEl);

      const locationCell = document.createElement("td");
      const location = describeTowerLocation(entry);
      const locationPrimary = document.createElement("div");
      locationPrimary.className = "dashboard-location-primary";
      locationPrimary.textContent = location.primary;
      locationCell.append(locationPrimary);
      if (location.secondary) {
        const locationSecondary = document.createElement("div");
        locationSecondary.className = "dashboard-location-secondary";
        locationSecondary.textContent = location.secondary;
        locationCell.append(locationSecondary);
      }

      const progressCell = document.createElement("td");
      const progressWrapper = document.createElement("div");
      progressWrapper.className = "dashboard-progress";
      const progressCounts = document.createElement("div");
      progressCounts.className = "dashboard-progress-count";
      progressCounts.textContent = `${entry.solved} / ${entry.puzzleCount} solved`;
      const progressRail = document.createElement("div");
      progressRail.className = "dashboard-progress-rail";
      const progressBar = document.createElement("div");
      progressBar.className = "dashboard-progress-bar";
      const percent = clampNumber(entry.progressPercent ?? 0, 0, 100);
      progressBar.style.width = `${percent}%`;
      progressRail.append(progressBar);
      const progressMeta = document.createElement("div");
      progressMeta.className = "dashboard-progress-meta";
      progressMeta.textContent = `${percent}% complete`;
      progressWrapper.append(progressCounts, progressRail, progressMeta);
      progressCell.append(progressWrapper);

      const updatedCell = document.createElement("td");
      const updatedLabel = document.createElement("div");
      updatedLabel.className = "dashboard-updated";
      updatedLabel.textContent = formatTimestamp(entry.timestamp);
      updatedCell.append(updatedLabel);
      if (entry.reason) {
        const reasonEl = document.createElement("div");
        reasonEl.className = "dashboard-last-event";
        reasonEl.textContent = entry.reason;
        updatedCell.append(reasonEl);
      }

      tr.append(teamCell, locationCell, progressCell, updatedCell);
      tbody.append(tr);
    }

    table.append(thead, tbody);

    const wrapper = document.createElement("div");
    wrapper.className = "dashboard-table-wrapper";
    wrapper.append(table);

    tableWrapper.append(wrapper);
  }

  function normalizeDashboardEntries(payload) {
    const fields = Array.isArray(payload?.fields) ? payload.fields : [];
    const rawRows = Array.isArray(payload?.rows) ? payload.rows : [];
    const latestByTeam = new Map();

    for (const rawRow of rawRows) {
      const record = coerceRowRecord(rawRow, fields);
      if (!record) {
        continue;
      }
      const entry = sanitizeDashboardRow(record);
      if (!entry) {
        continue;
      }
      const existing = latestByTeam.get(entry.teamId);
      if (!existing || entry.timestampValue > existing.timestampValue) {
        latestByTeam.set(entry.teamId, entry);
      }
    }

    return Array.from(latestByTeam.values());
  }

  function coerceRowRecord(row, fields) {
    if (row && typeof row === "object" && !Array.isArray(row)) {
      return row;
    }
    if (Array.isArray(row) && fields.length) {
      const record = {};
      fields.forEach((field, index) => {
        record[field] = row[index];
      });
      return record;
    }
    return null;
  }

  function sanitizeDashboardRow(record) {
    if (!record) {
      return null;
    }

    const teamId = parseInteger(record.TeamId);
    if (!Number.isInteger(teamId) || teamId < 0) {
      return null;
    }

    const timestamp = parseTimestamp(record.Timestamp);
    if (!timestamp) {
      return null;
    }

    const puzzleCount = clampNumber(parseInteger(record.PuzzleCount) ?? PUZZLE_LABELS.length, 1, PUZZLE_LABELS.length);
    const solved = clampNumber(parseInteger(record.SolvedCount) ?? 0, 0, puzzleCount);
    const hasStarted = parseBoolean(record.HasStarted) || solved > 0;
    const hasWon = parseBoolean(record.HasWon) || solved >= puzzleCount;
    const rawProgress = parseInteger(record.ProgressPercent);
    const fallbackProgress = puzzleCount > 0 ? Math.round((solved / puzzleCount) * 100) : 0;
    const progressPercent = clampNumber(Number.isFinite(rawProgress) ? rawProgress : fallbackProgress, 0, 100);
    const currentPuzzleIndex = toPuzzleIndex(record.CurrentPuzzleIndex, puzzleCount);
    const nextPuzzleIndex = toPuzzleIndex(record.NextPuzzleIndex, puzzleCount);
    const nextPuzzleLabel = parseText(record.NextPuzzleLabel, true);
    const reason = parseText(record.Reason, true);

    return {
      teamId,
      teamName: parseText(record.TeamName) ?? `Team ${teamId + 1}`,
      puzzleCount,
      solved,
      hasStarted,
      hasWon,
      progressPercent,
      currentPuzzleIndex,
      nextPuzzleIndex,
      nextPuzzleLabel,
      reason,
      timestamp,
      timestampValue: timestamp.getTime()
    };
  }

  function sortEntries(a, b) {
    if (a.hasWon !== b.hasWon) {
      return Number(b.hasWon) - Number(a.hasWon);
    }
    const solvedDiff = (b.solved ?? 0) - (a.solved ?? 0);
    if (solvedDiff !== 0) {
      return solvedDiff;
    }
    const progressDiff = (b.progressPercent ?? 0) - (a.progressPercent ?? 0);
    if (progressDiff !== 0) {
      return progressDiff;
    }
    const timeDiff = (b.timestampValue ?? 0) - (a.timestampValue ?? 0);
    if (timeDiff !== 0) {
      return timeDiff;
    }
    return (a.teamId ?? 0) - (b.teamId ?? 0);
  }

  function describeTeamStatus(entry) {
    if (entry.hasWon) {
      return { label: "Tower complete", className: "dashboard-status-pill is-complete" };
    }
    if (!entry.hasStarted) {
      return { label: "Not started", className: "dashboard-status-pill is-idle" };
    }
    return { label: "In progress", className: "dashboard-status-pill" };
  }

  function describeTowerLocation(entry) {
    if (entry.hasWon) {
      return {
        primary: "Tower complete",
        secondary: "All missions cleared"
      };
    }

    const nextLabel = labelFromIndex(entry.nextPuzzleIndex, entry.nextPuzzleLabel);
    const lastSolvedLabel = entry.solved > 0 ? labelFromIndex(entry.solved - 1) : null;
    const currentLabel = labelFromIndex(
      entry.currentPuzzleIndex,
      entry.currentPuzzleIndex !== null && entry.currentPuzzleIndex === entry.nextPuzzleIndex ? entry.nextPuzzleLabel : undefined
    );

    if (!entry.hasStarted) {
      return {
        primary: nextLabel ? `Ready for ${nextLabel}` : "Awaiting first mission",
        secondary: "No missions completed yet"
      };
    }

    if (currentLabel) {
      const secondary = nextLabel && nextLabel !== currentLabel
        ? `Next: ${nextLabel}`
        : lastSolvedLabel
        ? `Last cleared: ${lastSolvedLabel}`
        : "Currently solving";
      return {
        primary: `On ${currentLabel}`,
        secondary
      };
    }

    if (nextLabel) {
      return {
        primary: `Heading to ${nextLabel}`,
        secondary: lastSolvedLabel ? `Last cleared: ${lastSolvedLabel}` : "Mission unlocked"
      };
    }

    if (lastSolvedLabel) {
      return {
        primary: `Paused after ${lastSolvedLabel}`,
        secondary: `${entry.solved} of ${entry.puzzleCount} solved`
      };
    }

    return {
      primary: "In progress",
      secondary: null
    };
  }

  function labelFromIndex(index, fallback) {
    if (!Number.isInteger(index)) {
      return fallback ?? null;
    }
    if (index >= 0 && index < PUZZLE_LABELS.length) {
      return PUZZLE_LABELS[index];
    }
    return fallback ?? `Mission ${(index ?? 0) + 1}`;
  }

  function formatTimestamp(date) {
    if (!(date instanceof Date)) {
      return "–";
    }
    try {
      return date.toLocaleString();
    } catch (err) {
      return date.toISOString();
    }
  }

  function parseInteger(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return Math.trunc(value);
    }
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) {
        return null;
      }
      const parsed = Number.parseInt(trimmed, 10);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
    return null;
  }

  function parseBoolean(value) {
    if (typeof value === "boolean") {
      return value;
    }
    if (typeof value === "number") {
      return value !== 0;
    }
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (!normalized) {
        return false;
      }
      if (normalized === "true" || normalized === "yes" || normalized === "y") {
        return true;
      }
      if (normalized === "false" || normalized === "no" || normalized === "n") {
        return false;
      }
      const numeric = Number.parseInt(normalized, 10);
      return Number.isFinite(numeric) ? numeric !== 0 : normalized === "1";
    }
    return false;
  }

  function parseText(value, allowEmpty = false) {
    if (typeof value !== "string") {
      return null;
    }
    const trimmed = value.trim();
    if (!trimmed && !allowEmpty) {
      return null;
    }
    return trimmed || null;
  }

  function parseTimestamp(value) {
    if (!value) {
      return null;
    }
    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? null : value;
    }
    const candidate = new Date(String(value));
    return Number.isNaN(candidate.getTime()) ? null : candidate;
  }

  function toPuzzleIndex(value, puzzleCount) {
    const parsed = parseInteger(value);
    if (!Number.isInteger(parsed)) {
      return null;
    }
    return clampNumber(parsed, 0, Math.max(0, puzzleCount - 1));
  }

  function clampNumber(value, min, max) {
    let numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      numeric = min;
    }
    if (numeric < min) {
      return min;
    }
    if (numeric > max) {
      return max;
    }
    return numeric;
  }

  function getClearedAfter() {
    try {
      const stored = window.localStorage?.getItem(CLEAR_STORAGE_KEY);
      if (!stored) {
        return null;
      }
      const parsed = Date.parse(stored);
      return Number.isNaN(parsed) ? null : parsed;
    } catch (err) {
      return null;
    }
  }

  function setClearedAfter(value) {
    try {
      window.localStorage?.setItem(CLEAR_STORAGE_KEY, value);
    } catch (err) {
      // ignore storage issues
    }
  }

  function clearClearedAfter() {
    try {
      window.localStorage?.removeItem(CLEAR_STORAGE_KEY);
    } catch (err) {
      // ignore storage issues
    }
  }

  function updateClearButtonLabel() {
    if (!clearButton) {
      return;
    }
    clearButton.textContent = getClearedAfter() ? "Show Historical Data" : "Clear Data";
  }

  function handleClearData() {
    if (!clearButton) {
      return;
    }
    const clearedAfter = getClearedAfter();
    if (clearedAfter) {
      if (window.confirm("Show previously cleared dashboard data?")) {
        clearClearedAfter();
        updateClearButtonLabel();
        renderTable(latestEntries);
        setStatus("Historical data restored.");
      }
      return;
    }

    if (!window.confirm("Clear all dashboard data for this session?")) {
      return;
    }
    const nowIso = new Date().toISOString();
    setClearedAfter(nowIso);
    updateClearButtonLabel();
    renderTable(latestEntries);
    setStatus("Dashboard data cleared. Waiting for new updates…");
  }

  function setStatus(message, options = {}) {
    if (!statusLabel) {
      return;
    }
    statusLabel.textContent = message ?? "";
    if (options.error) {
      statusLabel.classList.add("is-error");
    } else {
      statusLabel.classList.remove("is-error");
    }
  }

  function handleSignOut() {
    setSessionGmToken(null);
    setStoredGmToken(null);
    shell.hidden = true;
    showGmAuthOverlay();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
