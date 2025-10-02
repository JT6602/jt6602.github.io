(() => {
  const GM_PASSWORD = "GoTowerHats";
  const GM_PASSWORD_TOKEN_KEY = "towerHuntGmToken";
  const GM_SESSION_TOKEN_KEY = "towerHuntGmSession";
  const DATA_ENDPOINT = "https://script.google.com/macros/s/AKfycbyz17Xpv8QY4ul-Abc7e40eME7Xzbw503R-sWliOsrYy4CKZmVULoW-S3he2OLPAantsw/exec?sheet=UserData&token=1232435jvghfcgxdfgfcyguyuh1de2fr39u89y78gtghbijoqidwe2f089hyqdwefrjpihugy879";

  const shell = document.getElementById("dashboardShell");
  const statusLabel = document.getElementById("dashboardStatus");
  const tableWrapper = document.getElementById("dashboardTableWrapper");
  const refreshButton = document.getElementById("refreshDashboardData");
  const signOutButton = document.getElementById("dashboardSignOut");

  const gmState = {
    overlay: null,
    form: null,
    input: null,
    remember: null,
    feedback: null
  };

  function init() {
    if (!shell) {
      return;
    }

    shell.hidden = true;

    refreshButton?.addEventListener("click", () => {
      loadData({ showLoading: true });
    });

    signOutButton?.addEventListener("click", handleSignOut);

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
      renderTable(payload);
      setStatus(`Last updated ${new Date().toLocaleTimeString()}`);
    } catch (err) {
      console.error("Dashboard data fetch failed", err);
      setStatus("Unable to load user data. Try refreshing.", { error: true });
    }
  }

  function renderTable(payload) {
    if (!tableWrapper) {
      return;
    }
    tableWrapper.innerHTML = "";

    const fields = Array.isArray(payload?.fields) && payload.fields.length
      ? payload.fields
      : extractFieldsFromRows(payload?.rows);
    const rows = Array.isArray(payload?.rows) ? payload.rows : [];

    if (!fields.length || !rows.length) {
      const empty = document.createElement("div");
      empty.className = "dashboard-empty";
      empty.textContent = "No user data has been recorded yet.";
      tableWrapper.append(empty);
      return;
    }

    const table = document.createElement("table");
    table.className = "dashboard-table";

    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    for (const field of fields) {
      const th = document.createElement("th");
      th.textContent = field;
      headRow.append(th);
    }
    thead.append(headRow);

    const tbody = document.createElement("tbody");
    for (const row of rows) {
      const tr = document.createElement("tr");
      const values = mapRowValues(row, fields);
      for (const value of values) {
        const td = document.createElement("td");
        td.textContent = formatCellValue(value);
        tr.append(td);
      }
      tbody.append(tr);
    }

    table.append(thead, tbody);

    const wrapper = document.createElement("div");
    wrapper.className = "dashboard-table-wrapper";
    wrapper.append(table);

    tableWrapper.append(wrapper);
  }

  function extractFieldsFromRows(rows) {
    if (!Array.isArray(rows)) {
      return [];
    }

    for (const row of rows) {
      if (row && typeof row === "object" && !Array.isArray(row)) {
        return Object.keys(row);
      }
      if (Array.isArray(row)) {
        return row.map((_, index) => `Column ${index + 1}`);
      }
    }
    return [];
  }

  function mapRowValues(row, fields) {
    if (row && typeof row === "object" && !Array.isArray(row)) {
      return fields.map(field => row[field]);
    }
    if (Array.isArray(row)) {
      return row;
    }
    return fields.map(() => "");
  }

  function formatCellValue(value) {
    if (value === null || value === undefined) {
      return "";
    }
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    if (typeof value === "object") {
      try {
        return JSON.stringify(value);
      } catch (err) {
        return String(value);
      }
    }
    return String(value);
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
