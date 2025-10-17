(() => {
  const GM_PASSWORD = "GoTowerHats";
  const GM_PASSWORD_TOKEN_KEY = "towerHuntGmToken";
  const GM_SESSION_TOKEN_KEY = "towerHuntGmSession";
  const DATA_ENDPOINT = "https://script.google.com/macros/s/AKfycbyz17Xpv8QY4ul-Abc7e40eME7Xzbw503R-sWliOsrYy4CKZmVULoW-S3he2OLPAantsw/exec?sheet=UserData&token=1232435jvghfcgxdfgfcyguyuh1de2fr39u89y78gtghbijoqidwe2f089hyqdwefrjpihugy879";
  const CLEAR_STORAGE_KEY = "towerDashboardClearedAfter";
  const AUTO_REFRESH_INTERVAL_MS = 10000;
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
  const TEAM_NAMES = [
    "Team 1",
    "Team 2",
    "Team 3",
    "Team 4",
    "Team 5",
    "Team 6",
    "Team 7",
    "Team 8",
    "Team 9",
    "Team 10",
    "Team 11"
  ];
  const TEAM_ORDERS = [
    [1, 2, 3, 6, 9, 11, 10, 7, 8, 5, 4, 0],
    [2, 3, 6, 9, 11, 10, 7, 8, 5, 4, 1, 0],
    [3, 6, 9, 11, 10, 7, 8, 5, 4, 1, 2, 0],
    [4, 1, 2, 3, 6, 9, 11, 10, 7, 8, 5, 0],
    [5, 4, 1, 2, 3, 6, 9, 11, 10, 7, 8, 0],
    [6, 9, 11, 10, 7, 8, 5, 4, 1, 2, 3, 0],
    [7, 8, 5, 4, 1, 2, 3, 6, 9, 11, 10, 0],
    [8, 5, 4, 1, 2, 3, 6, 9, 11, 10, 7, 0],
    [9, 11, 10, 7, 8, 5, 4, 1, 2, 3, 6, 0],
    [10, 7, 8, 5, 4, 1, 2, 3, 6, 9, 11, 0],
    [11, 10, 7, 8, 5, 4, 1, 2, 3, 6, 9, 0]
  ];
  const TEAM_COLORS = [
    "#64d5f7",
    "#c792ea",
    "#ff9966",
    "#ff6fa5",
    "#71e0b5",
    "#ffd166",
    "#6f9dff",
    "#a787ff",
    "#57dca5",
    "#ffa38f",
    "#7bc4ff"
  ];

  const shell = document.getElementById("dashboardShell");
  const statusLabel = document.getElementById("dashboardStatus");
  const tableWrapper = document.getElementById("dashboardTableWrapper");
  const refreshButton = document.getElementById("refreshDashboardData");
  const clearButton = document.getElementById("clearDashboardData");
  const signOutButton = document.getElementById("dashboardSignOut");
  const towerMapShell = document.getElementById("dashboardTowerMap");
  const towerLevels = document.getElementById("dashboardTowerLevels");
  const towerArrows = document.getElementById("dashboardMapArrows");
  const towerInspector = document.getElementById("dashboardMapInspector");

  const gmState = {
    overlay: null,
    form: null,
    input: null,
    remember: null,
    feedback: null
  };

  let latestEntries = [];
  let refreshTimerId = null;
  let autoRefreshEnabled = false;
  let mapArrowData = [];
  let mapArrowRafId = null;
  const DEFAULT_INSPECTOR_MESSAGE = "Hover a team puck to inspect their mission.";

  function getTeamOrder(teamId) {
    const order = TEAM_ORDERS[teamId] ?? [];
    const maxIndex = PUZZLE_LABELS.length;
    const sanitized = order.filter(index => Number.isInteger(index) && index >= 0 && index < maxIndex);
    if (sanitized.length) {
      return sanitized;
    }
    return Array.from({ length: maxIndex }, (_, index) => index);
  }

  function resolveFinalIndex(teamId) {
    const order = getTeamOrder(teamId);
    if (!order.length) {
      return PUZZLE_LABELS.length ? PUZZLE_LABELS.length - 1 : null;
    }
    const finalIndex = order[order.length - 1];
    return Number.isInteger(finalIndex) ? finalIndex : PUZZLE_LABELS.length - 1;
  }

  function deriveTowerState(entry) {
    const puzzleCount = Number.isFinite(entry.puzzleCount) ? entry.puzzleCount : PUZZLE_LABELS.length;
    const completions = Array.isArray(entry.completions)
      ? entry.completions
      : Array.from({ length: puzzleCount }, () => false);
    const order = getTeamOrder(entry.teamId ?? 0);
    const finalIndex = resolveFinalIndex(entry.teamId ?? 0);
    const solvedCount = Number.isFinite(entry.solved) ? entry.solved : completions.filter(Boolean).length;

    const finalFromEntry = entry.finalPuzzleComplete === true;
    const finalFromSolved = puzzleCount > 0 && solvedCount >= puzzleCount;
    const finalFromCompletions =
      finalIndex !== null ? Boolean(completions[finalIndex]) : completions.every(Boolean);
    const finalPuzzleComplete = Boolean(finalFromEntry || finalFromSolved || finalFromCompletions || entry.hasWon);

    const towerFromEntry = entry.towerComplete === true;
    const towerIndices = order.filter(index => index !== finalIndex);
    const towerFromCompletions = towerIndices.length
      ? towerIndices.every(index => Boolean(completions[index]))
      : puzzleCount > 1
      ? solvedCount >= puzzleCount - 1
      : finalPuzzleComplete;

    const towerComplete = finalPuzzleComplete ? true : Boolean(towerFromEntry || towerFromCompletions);

    return {
      towerComplete,
      finalPuzzleComplete,
      finalIndex,
      order
    };
  }

  function init() {
    if (!shell) {
      return;
    }

    shell.hidden = true;
    resetMapInspector();
    renderTowerMap([]);

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
    clearAutoRefreshTimer();
    autoRefreshEnabled = true;
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

    clearAutoRefreshTimer();

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
      scheduleAutoRefresh();
    } catch (err) {
      console.error("Dashboard data fetch failed", err);
      setStatus("Unable to load user data. Try refreshing.", { error: true });
      scheduleAutoRefresh();
    }
  }

  function scheduleAutoRefresh() {
    if (!autoRefreshEnabled) {
      clearAutoRefreshTimer();
      return;
    }
    clearAutoRefreshTimer();
    refreshTimerId = window.setTimeout(() => {
      loadData({ showLoading: false });
    }, AUTO_REFRESH_INTERVAL_MS);
  }

  function clearAutoRefreshTimer() {
    if (refreshTimerId !== null) {
      window.clearTimeout(refreshTimerId);
      refreshTimerId = null;
    }
  }

  function stopAutoRefresh() {
    autoRefreshEnabled = false;
    clearAutoRefreshTimer();
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

    renderTowerMap(visibleEntries);

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
    const headers = ["Team", "Tower Location", "Progress", "Runtime", "Last Update", "Remove"];
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

      const runtimeCell = document.createElement("td");
      const runtimeWrapper = document.createElement("div");
      runtimeWrapper.className = "dashboard-runtime";
      const runtimeLabel = formatRuntime(entry.runtimeSeconds);
      if (runtimeLabel) {
        const primary = document.createElement("div");
        primary.className = "dashboard-runtime-primary";
        primary.textContent = runtimeLabel;
        runtimeWrapper.append(primary);
      }
      const startedLabel = formatStartTimestamp(entry.startedAt);
      if (startedLabel) {
        const secondary = document.createElement("div");
        secondary.className = "dashboard-runtime-secondary";
        secondary.textContent = `Started ${startedLabel}`;
        runtimeWrapper.append(secondary);
      }
      if (runtimeWrapper.childElementCount === 0) {
        runtimeWrapper.textContent = entry.hasStarted ? "In progress" : "–";
      }
      runtimeCell.append(runtimeWrapper);

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

      const removeCell = document.createElement("td");
      removeCell.className = "dashboard-actions-cell";
      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "dashboard-delete-button";
      deleteButton.textContent = "×";
      deleteButton.setAttribute("aria-label", `Delete data for ${entry.teamName}`);
      deleteButton.addEventListener("click", () => {
        confirmDeleteTeam(entry, deleteButton);
      });
      removeCell.append(deleteButton);

      tr.append(teamCell, locationCell, progressCell, runtimeCell, updatedCell, removeCell);
      tbody.append(tr);
    }

    table.append(thead, tbody);

    const wrapper = document.createElement("div");
    wrapper.className = "dashboard-table-wrapper";
    wrapper.append(table);

    tableWrapper.append(wrapper);
  }

  function renderTowerMap(entries) {
    if (!towerLevels || !towerMapShell) {
      return;
    }

    towerLevels.innerHTML = "";
    if (towerArrows) {
      towerArrows.innerHTML = "";
    }

    const reportingTeams = Array.isArray(entries)
      ? entries.filter(entry => entry && entry.hasStarted)
      : [];

    if (!reportingTeams.length) {
      towerMapShell.classList.add("is-empty");
      resetMapInspector("No teams reporting yet.");
      mapArrowData = [];
      scheduleMapArrowLayout();
      return;
    }

    towerMapShell.classList.remove("is-empty");
    resetMapInspector();

    const rowLookup = buildTowerRows();
    const arrowDefs = [];

    const teamContexts = reportingTeams
      .map(entry => normalizeMapTeam(entry))
      .filter(Boolean)
      .sort((a, b) => (a.entry.teamId ?? 0) - (b.entry.teamId ?? 0));

    if (!teamContexts.length) {
      towerMapShell.classList.add("is-empty");
      resetMapInspector("No active teams to display yet.");
      mapArrowData = [];
      scheduleMapArrowLayout();
      return;
    }

    teamContexts.forEach(context => {
      const { currentIndex, targetIndex, arrowFromIndex, arrowToIndex } = context;
      if (Number.isInteger(currentIndex) && rowLookup[currentIndex]) {
        const marker = createMapMarker(context, { variant: "current" });
        rowLookup[currentIndex].lane.append(marker);
      }

      if (Number.isInteger(targetIndex) && rowLookup[targetIndex]) {
        const targetMarker = createMapMarker(context, { variant: "target" });
        rowLookup[targetIndex].lane.append(targetMarker);
      }

      if (
        Number.isInteger(arrowFromIndex) &&
        Number.isInteger(arrowToIndex) &&
        rowLookup[arrowFromIndex]?.row &&
        rowLookup[arrowToIndex]?.row &&
        towerArrows
      ) {
        const arrowElement = document.createElement("div");
        arrowElement.className = "dashboard-map-arrow";
        arrowElement.style.setProperty("--marker-color", context.color);
        arrowElement.setAttribute("hidden", "true");
        towerArrows.append(arrowElement);
        arrowDefs.push({
          element: arrowElement,
          fromRow: rowLookup[arrowFromIndex].row,
          fromLane: rowLookup[arrowFromIndex].lane,
          toRow: rowLookup[arrowToIndex].row,
          toLane: rowLookup[arrowToIndex].lane
        });
      }
    });

    mapArrowData = arrowDefs;
    scheduleMapArrowLayout();
  }

  function buildTowerRows() {
    const rows = [];
    if (!towerLevels) {
      return rows;
    }
    for (let index = PUZZLE_LABELS.length - 1; index >= 0; index -= 1) {
      const row = document.createElement("div");
      row.className = "dashboard-map-row";
      row.dataset.floorIndex = String(index);
      row.setAttribute("role", "listitem");

      const label = document.createElement("div");
      label.className = "dashboard-map-label";
      label.textContent = PUZZLE_LABELS[index];

      const lane = document.createElement("div");
      lane.className = "dashboard-map-lane";

      row.append(label, lane);
      towerLevels.append(row);
      rows[index] = { row, lane };
    }
    return rows;
  }

  function normalizeMapTeam(entry) {
    if (!entry || !Number.isInteger(entry.teamId)) {
      return null;
    }

    const color = TEAM_COLORS[entry.teamId % TEAM_COLORS.length];
    const { towerComplete, finalPuzzleComplete, finalIndex, order } = deriveTowerState(entry);
    const sanitizedOrder = order;
    const solvedClamped = clampNumber(entry.solved ?? 0, 0, sanitizedOrder.length);
    const lastSolvedIndex = solvedClamped > 0 ? sanitizedOrder[Math.min(solvedClamped, sanitizedOrder.length) - 1] ?? null : null;
    const finalSolvedIndex = Number.isInteger(finalIndex) ? normalizeFloorIndex(finalIndex) : null;
    const hasFinalWin = finalPuzzleComplete || entry.hasWon;

    let currentIndex = normalizeFloorIndex(entry.currentPuzzleIndex);
    if (!Number.isInteger(currentIndex)) {
      if (hasFinalWin && finalSolvedIndex !== null) {
        currentIndex = finalSolvedIndex;
      } else if (towerComplete && finalSolvedIndex !== null) {
        currentIndex = finalSolvedIndex;
      } else if (lastSolvedIndex !== null) {
        currentIndex = lastSolvedIndex;
      }
    }
    if (!Number.isInteger(currentIndex)) {
      currentIndex = sanitizedOrder.length ? sanitizedOrder[0] : 0;
    }
    currentIndex = normalizeFloorIndex(currentIndex);

    let targetIndex = normalizeFloorIndex(entry.nextPuzzleIndex);
    if (hasFinalWin) {
      targetIndex = null;
    } else if (!Number.isInteger(targetIndex) && towerComplete && finalSolvedIndex !== null) {
      targetIndex = finalSolvedIndex;
    }

    let arrowFromIndex = null;
    let arrowToIndex = null;
    if (targetIndex !== null) {
      const originIndex = Number.isInteger(currentIndex) ? currentIndex : lastSolvedIndex;
      if (Number.isInteger(originIndex) && originIndex !== targetIndex) {
        arrowFromIndex = originIndex;
        arrowToIndex = targetIndex;
      }
    }

    const currentLabel = labelFromIndex(currentIndex);
    const targetLabel = labelFromIndex(targetIndex, entry.nextPuzzleLabel);
    const runtimeLabel = formatRuntime(entry.runtimeSeconds);
    const startedLabel = formatStartTimestamp(entry.startedAt);
    const status = describeTowerLocation(entry);

    return {
      entry,
      color,
      currentIndex,
      targetIndex,
      arrowFromIndex,
      arrowToIndex,
      currentLabel,
      targetLabel,
      runtimeLabel,
      startedLabel,
      status,
      solved: entry.solved ?? 0,
      puzzleCount: entry.puzzleCount ?? PUZZLE_LABELS.length,
      towerComplete,
      finalPuzzleComplete: hasFinalWin
    };
  }

  function createMapMarker(context, { variant }) {
    const marker = document.createElement("button");
    marker.type = "button";
    marker.className = "dashboard-map-marker";
    marker.style.setProperty("--marker-color", context.color);
    marker.dataset.teamId = String(context.entry.teamId);
    if (variant === "target") {
      marker.classList.add("is-target");
    }

    const label = document.createElement("span");
    label.className = "dashboard-map-marker__label";
    label.textContent = `T${context.entry.teamId + 1}`;
    marker.append(label);

    const teamName = context.entry.teamName ?? TEAM_NAMES[context.entry.teamId] ?? `Team ${context.entry.teamId + 1}`;
    const locationLabel = variant === "target" ? context.targetLabel ?? "Unknown" : context.currentLabel ?? "Unknown";
    const roleLabel = variant === "target" ? "Destination" : "Current location";
    marker.setAttribute("aria-label", `${teamName} · ${roleLabel}: ${locationLabel}`);

    registerMarkerInspector(marker, context, variant);
    return marker;
  }

  function registerMarkerInspector(marker, context, variant) {
    if (!marker) {
      return;
    }

    const showInspector = () => {
      showMapInspector(context, variant);
    };
    const resetInspector = () => {
      resetMapInspector();
    };

    marker.addEventListener("mouseenter", showInspector);
    marker.addEventListener("focus", showInspector);
    marker.addEventListener("mouseleave", resetInspector);
    marker.addEventListener("blur", resetInspector);
  }

  function showMapInspector(context, variant) {
    if (!towerInspector) {
      return;
    }
    const team = context.entry;
    const teamName = team.teamName ?? TEAM_NAMES[team.teamId] ?? `Team ${team.teamId + 1}`;

    towerInspector.innerHTML = "";
    towerInspector.classList.add("is-active");

    const title = document.createElement("h3");
    title.textContent = teamName;
    towerInspector.append(title);

    const meta = document.createElement("div");
    meta.className = "dashboard-map-inspector__meta";
    meta.textContent = `Team ${team.teamId + 1} · ${context.solved} / ${context.puzzleCount} solved`;
    towerInspector.append(meta);

    const statusPrimary = document.createElement("div");
    statusPrimary.className = "dashboard-map-inspector__status";
    statusPrimary.textContent = context.status?.primary ?? "Status unknown";
    towerInspector.append(statusPrimary);

    if (context.status?.secondary) {
      const statusSecondary = document.createElement("div");
      statusSecondary.className = "dashboard-map-inspector__status-secondary";
      statusSecondary.textContent = context.status.secondary;
      towerInspector.append(statusSecondary);
    }

    const detailList = document.createElement("ul");
    detailList.className = "dashboard-map-inspector__list";

    if (context.currentLabel) {
      const li = document.createElement("li");
      li.textContent = `Current: ${context.currentLabel}`;
      detailList.append(li);
    }

    if (context.targetLabel && variant === "target") {
      const li = document.createElement("li");
      li.textContent = `Destination: ${context.targetLabel}`;
      detailList.append(li);
    } else if (context.targetLabel && context.currentLabel !== context.targetLabel) {
      const li = document.createElement("li");
      li.textContent = `Next: ${context.targetLabel}`;
      detailList.append(li);
    }

    if (context.runtimeLabel || context.startedLabel) {
      const li = document.createElement("li");
      const parts = [];
      if (context.runtimeLabel) {
        parts.push(`Runtime ${context.runtimeLabel}`);
      }
      if (context.startedLabel) {
        parts.push(`Started ${context.startedLabel}`);
      }
      li.textContent = parts.join(" · ");
      detailList.append(li);
    }

    if (detailList.childElementCount > 0) {
      towerInspector.append(detailList);
    }

    if (team.reason) {
      const lastEvent = document.createElement("div");
      lastEvent.className = "dashboard-map-inspector__event";
      lastEvent.textContent = team.reason;
      towerInspector.append(lastEvent);
    }
  }

  function resetMapInspector(message = DEFAULT_INSPECTOR_MESSAGE) {
    if (!towerInspector) {
      return;
    }
    towerInspector.classList.remove("is-active");
    towerInspector.textContent = message;
  }

  function scheduleMapArrowLayout() {
    if (mapArrowRafId !== null) {
      window.cancelAnimationFrame(mapArrowRafId);
    }
    mapArrowRafId = window.requestAnimationFrame(() => {
      mapArrowRafId = null;
      applyMapArrowPositions();
    });
  }

  function applyMapArrowPositions() {
    if (!towerArrows || !towerMapShell) {
      return;
    }
    if (!mapArrowData.length) {
      return;
    }

    const canvasRect = towerMapShell.getBoundingClientRect();

    mapArrowData.forEach(arrow => {
      if (!arrow || !arrow.element || !arrow.fromRow || !arrow.toRow) {
        if (arrow?.element) {
          arrow.element.setAttribute("hidden", "true");
        }
        return;
      }

      const fromOffset = arrow.fromRow.offsetTop + arrow.fromRow.offsetHeight / 2;
      const toOffset = arrow.toRow.offsetTop + arrow.toRow.offsetHeight / 2;
      const lane = arrow.fromLane ?? arrow.toLane;
      let left = canvasRect.width / 2;
      if (lane) {
        const laneRect = lane.getBoundingClientRect();
        left = laneRect.left + laneRect.width / 2 - canvasRect.left;
      }
      const clampedLeft = Math.max(24, Math.min(canvasRect.width - 24, left));
      const top = Math.min(fromOffset, toOffset);
      const height = Math.max(Math.abs(toOffset - fromOffset), 6);
      arrow.element.style.left = `${clampedLeft}px`;
      arrow.element.style.top = `${top}px`;
      arrow.element.style.height = `${height}px`;
      arrow.element.classList.toggle("is-up", toOffset < fromOffset);
      arrow.element.removeAttribute("hidden");
    });
  }

  function normalizeFloorIndex(value) {
    if (!Number.isInteger(value)) {
      return null;
    }
    if (value < 0 || value >= PUZZLE_LABELS.length) {
      return null;
    }
    return value;
  }

  async function confirmDeleteTeam(entry, triggerButton) {
    if (!entry || !Number.isInteger(entry.teamId)) {
      return;
    }
    if (!window.confirm(`Delete all data for ${entry.teamName}?`)) {
      return;
    }

    clearAutoRefreshTimer();
    triggerButton.disabled = true;
    setStatus(`Clearing data for ${entry.teamName}…`);

    try {
      await submitTeamDeletion(entry);
      setStatus(`${entry.teamName} cleared. Waiting for updates…`);
      loadData({ showLoading: true });
    } catch (err) {
      console.error("Failed to delete team data", err);
      triggerButton.disabled = false;
      setStatus(`Unable to delete ${entry.teamName}. Try again.`, { error: true });
      scheduleAutoRefresh();
    }
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
    const baseHasWon = parseBoolean(record.HasWon) || solved >= puzzleCount;
    const towerCompleteFlag = parseBoolean(record.TowerComplete);
    const finalPuzzleFlag = parseBoolean(record.FinalPuzzleComplete);
    const finalPuzzleComplete = finalPuzzleFlag || baseHasWon || (puzzleCount > 0 && solved >= puzzleCount);
    const towerComplete = finalPuzzleComplete
      ? true
      : towerCompleteFlag || (puzzleCount > 1 && solved >= puzzleCount - 1);
    const hasWon = finalPuzzleComplete || baseHasWon;
    const rawProgress = parseInteger(record.ProgressPercent);
    const fallbackProgress = puzzleCount > 0 ? Math.round((solved / puzzleCount) * 100) : 0;
    const progressPercent = clampNumber(Number.isFinite(rawProgress) ? rawProgress : fallbackProgress, 0, 100);
    const currentPuzzleIndex = toPuzzleIndex(record.CurrentPuzzleIndex, puzzleCount);
    const nextPuzzleIndex = toPuzzleIndex(record.NextPuzzleIndex, puzzleCount);
    const nextPuzzleLabel = parseText(record.NextPuzzleLabel, true);
    const reason = parseText(record.Reason, true);
    const runtimeSecondsValue = parseNumber(record.RuntimeSeconds);
    const runtimeSeconds = Number.isFinite(runtimeSecondsValue) ? Math.max(0, Math.round(runtimeSecondsValue)) : null;
    const startedAtDate = parseTimestamp(record.StartedAt);
    const startedAtValue = startedAtDate ? startedAtDate.getTime() : null;
    const completions = parseBooleanSeries(record.Completions, puzzleCount);
    const unlocked = parseBooleanSeries(record.Unlocked, puzzleCount);

    return {
      teamId,
      teamName: parseText(record.TeamName) ?? `Team ${teamId + 1}`,
      puzzleCount,
      solved,
      hasStarted,
      hasWon,
      towerComplete,
      finalPuzzleComplete,
      progressPercent,
      currentPuzzleIndex,
      nextPuzzleIndex,
      nextPuzzleLabel,
      reason,
      timestamp,
      timestampValue: timestamp.getTime(),
      runtimeSeconds,
      startedAt: startedAtDate,
      startedAtValue,
      completions,
      unlocked
    };
  }

  function sortEntries(a, b) {
    const aFinal = a.finalPuzzleComplete || a.hasWon;
    const bFinal = b.finalPuzzleComplete || b.hasWon;
    if (aFinal !== bFinal) {
      return Number(bFinal) - Number(aFinal);
    }
    const aTower = a.towerComplete || aFinal;
    const bTower = b.towerComplete || bFinal;
    if (aTower !== bTower) {
      return Number(bTower) - Number(aTower);
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
    const { towerComplete, finalPuzzleComplete } = deriveTowerState(entry);
    if (finalPuzzleComplete || entry.hasWon) {
      return { label: "Tower complete", className: "dashboard-status-pill is-complete" };
    }
    if (!entry.hasStarted) {
      return { label: "Not started", className: "dashboard-status-pill is-idle" };
    }
    if (towerComplete) {
      return { label: "Final puzzle", className: "dashboard-status-pill" };
    }
    return { label: "In progress", className: "dashboard-status-pill" };
  }

  function describeTowerLocation(entry) {
    const { towerComplete, finalPuzzleComplete, finalIndex } = deriveTowerState(entry);
    if (finalPuzzleComplete || entry.hasWon) {
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

    if (towerComplete && finalIndex !== null) {
      const finalLabel = labelFromIndex(finalIndex) ?? "Final mission";
      return {
        primary: "Final puzzle active",
        secondary: `Resolving ${finalLabel}`
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

  function formatStartTimestamp(date) {
    if (!(date instanceof Date)) {
      return null;
    }
    try {
      const now = new Date();
      const sameDay = now.toDateString() === date.toDateString();
      const options = sameDay
        ? { hour: "numeric", minute: "2-digit" }
        : { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" };
      return date.toLocaleString(undefined, options);
    } catch (err) {
      return date.toISOString();
    }
  }

  function formatRuntime(seconds) {
    if (!Number.isFinite(seconds) || seconds <= 0) {
      return null;
    }
    const totalSeconds = Math.floor(seconds);
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hrs > 0) {
      return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }
    return `${mins}:${String(secs).padStart(2, "0")}`;
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

  function parseNumber(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) {
        return null;
      }
      const parsed = Number.parseFloat(trimmed);
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

  function parseBooleanSeries(value, length) {
    const size = Number.isInteger(length) && length > 0 ? length : PUZZLE_LABELS.length;
    const result = Array.from({ length: size }, () => false);

    if (Array.isArray(value)) {
      for (let index = 0; index < Math.min(value.length, size); index += 1) {
        result[index] = Boolean(value[index]);
      }
      return result;
    }

    let source = null;

    if (typeof value === "number" && Number.isFinite(value)) {
      source = Math.trunc(value).toString();
    } else if (typeof value === "string") {
      source = value.trim();
    } else {
      return result;
    }

    if (!source) {
      return result;
    }

    if (/^[0-9]+$/.test(source) && source.length < size) {
      source = source.padStart(size, "0");
    }

    const normalized = source.toLowerCase();
    const tokenPattern = /true|false|t|f|y|n|1|0/g;
    let tokens = normalized.match(tokenPattern);

    if (!tokens || !tokens.length) {
      tokens = normalized.split(/[,\s]+/).filter(Boolean);
    }

    if (!tokens.length) {
      return result;
    }

    let resultIndex = 0;
    for (const token of tokens) {
      if (resultIndex >= size) {
        break;
      }
      const key = token.trim();
      if (!key) {
        continue;
      }
      const char = key.charAt(0);
      if (char === "1" || char === "t" || char === "y") {
        result[resultIndex] = true;
        resultIndex += 1;
        continue;
      }
      if (char === "0" || char === "f" || char === "n") {
        result[resultIndex] = false;
        resultIndex += 1;
      }
    }

    return result;
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

  async function submitTeamDeletion(entry) {
    const payload = buildDeletionPayload(entry);
    const body = encodePayloadAsCsv(payload);
    if (!body) {
      throw new Error("Unable to encode deletion payload");
    }

    const response = await fetch(DATA_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        Accept: "application/json, text/plain;q=0.8, */*;q=0.5"
      },
      body,
      mode: "cors",
      credentials: "omit",
      cache: "no-store",
      keepalive: true
    });

    if (!response.ok) {
      throw new Error(`Delete request failed with status ${response.status}`);
    }
    return true;
  }

  function buildDeletionPayload(entry) {
    if (!entry || !Number.isInteger(entry.teamId)) {
      return null;
    }
    const puzzleCount = clampNumber(entry.puzzleCount ?? PUZZLE_LABELS.length, 1, PUZZLE_LABELS.length);
    const completions = Array.from({ length: puzzleCount }, () => false);
    const unlocked = completions.slice();

    return {
      teamId: entry.teamId,
      teamName: entry.teamName ?? `Team ${entry.teamId + 1}`,
      hasStarted: false,
      hasWon: false,
      towerComplete: false,
      finalPuzzleComplete: false,
      solved: 0,
      puzzleCount,
      completions,
      unlocked,
      currentPuzzleIndex: null,
      nextPuzzleIndex: null,
      nextPuzzleLabel: null,
      reason: "dashboard-delete",
      timestamp: new Date().toISOString(),
      progressPercent: 0
    };
  }

  const SHEET_PAYLOAD_COLUMNS = Object.freeze([
    "TeamId",
    "TeamName",
    "HasStarted",
    "HasWon",
    "TowerComplete",
    "FinalPuzzleComplete",
    "SolvedCount",
    "PuzzleCount",
    "ProgressPercent",
    "CurrentPuzzleIndex",
    "NextPuzzleIndex",
    "NextPuzzleLabel",
    "StartedAt",
    "RuntimeSeconds",
    "Reason",
    "Timestamp",
    "Completions",
    "Unlocked"
  ]);

  function encodePayloadAsCsv(payload) {
    if (!payload) {
      return "";
    }
    const record = {
      TeamId: Number.isInteger(payload.teamId) ? payload.teamId : "",
      TeamName: payload.teamName ?? "",
      HasStarted: payload.hasStarted ? "TRUE" : "FALSE",
      HasWon: payload.hasWon ? "TRUE" : "FALSE",
      TowerComplete: payload.towerComplete ? "TRUE" : "FALSE",
      FinalPuzzleComplete: payload.finalPuzzleComplete ? "TRUE" : "FALSE",
      SolvedCount: Number.isFinite(payload.solved) ? payload.solved : 0,
      PuzzleCount: Number.isFinite(payload.puzzleCount) ? payload.puzzleCount : PUZZLE_LABELS.length,
      ProgressPercent: Number.isFinite(payload.progressPercent) ? payload.progressPercent : 0,
      CurrentPuzzleIndex: Number.isInteger(payload.currentPuzzleIndex) ? payload.currentPuzzleIndex : "",
      NextPuzzleIndex: Number.isInteger(payload.nextPuzzleIndex) ? payload.nextPuzzleIndex : "",
      NextPuzzleLabel: payload.nextPuzzleLabel ?? "",
      StartedAt: payload.startedAt ?? "",
      RuntimeSeconds: Number.isFinite(payload.runtimeSeconds) ? payload.runtimeSeconds : "",
      Reason: payload.reason ?? "",
      Timestamp: payload.timestamp ?? new Date().toISOString(),
      Completions: encodeBooleanSeries(payload.completions),
      Unlocked: encodeBooleanSeries(payload.unlocked)
    };

    const values = SHEET_PAYLOAD_COLUMNS.map(key => encodeCsvValue(record[key]));
    return values.join(",");
  }

  function encodeBooleanSeries(source) {
    if (!Array.isArray(source) || !source.length) {
      return "";
    }
    return source.map(value => (value ? "1" : "0")).join(",");
  }

  function encodeCsvValue(value) {
    if (value === null || value === undefined) {
      return "";
    }
    const stringValue = String(value);
    if (!stringValue) {
      return "";
    }
    if (/[",\n]/.test(stringValue)) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
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
    stopAutoRefresh();
    setSessionGmToken(null);
    setStoredGmToken(null);
    shell.hidden = true;
    showGmAuthOverlay();
  }

  window.addEventListener("resize", () => {
    if (mapArrowData.length) {
      scheduleMapArrowLayout();
    }
  });

  document.addEventListener("DOMContentLoaded", init);
})();
