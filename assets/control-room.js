const TEAM_COUNT = 11;
    const PUZZLE_COUNT = 12;
    const COOKIE_NAME = "towerHuntProgress";
    const CACHE_DURATION_DAYS = 365;
    const VALIDATION_DELAY_MS = 1200;

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
      [1, 10, 3, 4, 7, 11, 8, 9, 5, 6, 2, 0],
      [2, 9, 4, 8, 11, 3, 6, 10, 5, 7, 1, 0],
      [3, 2, 4, 9, 5, 6, 1, 10, 7, 8, 11, 0],
      [4, 8, 9, 6, 5, 2, 1, 10, 7, 3, 11, 0],
      [5, 2, 10, 6, 3, 4, 11, 8, 1, 9, 7, 0],
      [6, 3, 11, 8, 9, 10, 1, 7, 2, 4, 5, 0],
      [7, 1, 3, 5, 11, 6, 2, 4, 8, 10, 9, 0],
      [8, 10, 3, 7, 11, 9, 4, 6, 2, 1, 5, 0],
      [9, 4, 11, 8, 6, 10, 3, 5, 2, 7, 1, 0],
      [10, 8, 11, 3, 5, 1, 6, 4, 7, 9, 2, 0],
      [11, 9, 4, 6, 5, 3, 8, 10, 1, 7, 2, 0]
    ];

    const QR_CODES = Object.freeze({
      BASEMENT: "Z7PX-HL0Q-AV34",
      FLOOR_1: "M1QF-8RVZ-T6JD",
      FLOOR_2: "Q4SN-P2LX-9G0B",
      FLOOR_3: "V9KT-3H2C-LM55",
      FLOOR_4: "RX1B-W8Q7-5LZJ",
      FLOOR_5: "T0HC-4ZKM-PP18",
      FLOOR_6: "C8FW-J3VQ-7N2S",
      FLOOR_7: "L5MB-Y6RT-XQ04",
      FLOOR_8: "H2SV-N9PC-41LJ",
      FLOOR_9: "G7QD-K0LX-UF82",
      FLOOR_10: "P6ZR-2WQJ-M31T",
      FLOOR_11: "B3XN-5TLY-VA96"
    });

    const START_CODES = Object.freeze({
      "FRACTAL-DAWN-91QX": 0,
      "ORBITAL-GLASS-62MT": 1,
      "VELVET-EMBER-47NS": 2,
      "SONAR-MOON-18PL": 3,
      "EMBER-MASK-03VZ": 4,
      "CRYPTIC-FIELD-76QA": 5,
      "NEBULA-RIDGE-55LX": 6,
      "MIRAGE-COIL-24HF": 7,
      "SAPPHIRE-DUSK-88WR": 8,
      "PRISM-HARBOR-69KU": 9,
      "GOSSAMER-VAULT-12EC": 10
    });

    const GM_TEAM_CODES = Object.freeze({
      "GM-FRACTAL-REMAP-742": 0,
      "GM-ORBITAL-REMAP-953": 1,
      "GM-VELVET-REMAP-184": 2,
      "GM-SONAR-REMAP-625": 3,
      "GM-EMBER-REMAP-307": 4,
      "GM-CRYPTIC-REMAP-571": 5,
      "GM-NEBULA-REMAP-468": 6,
      "GM-MIRAGE-REMAP-259": 7,
      "GM-SAPPHIRE-REMAP-836": 8,
      "GM-PRISM-REMAP-914": 9,
      "GM-GOSSAMER-REMAP-401": 10
    });

    const SVG_NS = "http://www.w3.org/2000/svg";
    const GM_PASSWORD = "GoTowerHats";
    const GM_PASSWORD_TOKEN_KEY = "towerHuntGmToken";
    const GM_SESSION_TOKEN_KEY = "towerHuntGmSession";
    const COOKIE_SECRET = "tower-hunt-shield-9317";

    const puzzles = [
      { floor: "Basement", prompt: "The answer is: 'tower'", answer: "tower", qr: QR_CODES.BASEMENT },
      { floor: "Floor 1", prompt: "The answer is: 'tower'", answer: "tower", qr: QR_CODES.FLOOR_1 },
      { floor: "Floor 2", prompt: "The answer is: 'tower'", answer: "tower", qr: QR_CODES.FLOOR_2 },
      { floor: "Floor 3", prompt: "The answer is: 'tower'", answer: "tower", qr: QR_CODES.FLOOR_3 },
      { floor: "Floor 4", prompt: "The answer is: 'tower'", answer: "tower", qr: QR_CODES.FLOOR_4 },
      { floor: "Floor 5", prompt: "The answer is: 'tower'", answer: "tower", qr: QR_CODES.FLOOR_5 },
      { floor: "Floor 6", prompt: "The answer is: 'tower'", answer: "tower", qr: QR_CODES.FLOOR_6 },
      { floor: "Floor 7", prompt: "The answer is: 'tower'", answer: "tower", qr: QR_CODES.FLOOR_7 },
      { floor: "Floor 8", prompt: "The answer is: 'tower'", answer: "tower", qr: QR_CODES.FLOOR_8 },
      { floor: "Floor 9", prompt: "The answer is: 'tower'", answer: "tower", qr: QR_CODES.FLOOR_9 },
      { floor: "Floor 10", prompt: "The answer is: 'tower'", answer: "tower", qr: QR_CODES.FLOOR_10 },
      { floor: "Floor 11", prompt: "The answer is: 'tower'", answer: "tower", qr: QR_CODES.FLOOR_11 }
    ];

    const PUZZLE_CODE_LOOKUP = Object.freeze(
      puzzles.reduce((map, puzzle, index) => {
        map[normalizeCode(puzzle.qr)] = index;
        return map;
      }, {})
    );

    const progressBar = document.getElementById("progressBar");
    const progressCount = document.getElementById("progressCount");
    const progressLabel = document.getElementById("progressLabel");
    const resetButton = document.getElementById("resetAll");
    const exportButton = document.getElementById("exportProgress");
    const importButton = document.getElementById("importProgress");
    const gmOverrideButton = document.getElementById("gmOverrideButton");
    const statusMessage = document.getElementById("statusMessage");

    const puzzleTitle = document.getElementById("puzzleTitle");
    const puzzleMeta = document.getElementById("puzzleMeta");
    const puzzleBody = document.getElementById("puzzleBody");
    const puzzleFeedback = document.getElementById("puzzleFeedback");
    const scanButton = document.getElementById("scanButton");
    const answerForm = document.getElementById("answerForm");
    const answerInput = document.getElementById("answerInput");
    const answerSubmitButton = document.getElementById("answerSubmit");
    const waitingAurora = document.getElementById("waitingAurora");
    const platformTag = document.getElementById("platformTag");
    const progressList = document.getElementById("progressList");
    const progressPanel = document.getElementById("progressPanel");
    const progressDescriptor = document.getElementById("progressDescriptor");
    const towerLevels = document.getElementById("towerLevels");
    const towerMapOverlay = document.getElementById("towerMapOverlay");
    const towerMapOverlayClose = document.getElementById("towerMapOverlayClose");
    const viewTowerMapButton = document.getElementById("viewTowerMap");
    const gmOverrideOverlay = document.getElementById("gmOverrideOverlay");
    const gmOverrideForm = document.getElementById("gmOverrideForm");
    const gmOverrideOptions = document.getElementById("gmOverrideOptions");
    const gmOverrideSubtitle = document.getElementById("gmOverrideSubtitle");
    const gmOverrideFeedback = document.getElementById("gmOverrideFeedback");
    const gmOverrideClose = document.getElementById("gmOverrideClose");
    const gmOverrideCancel = document.getElementById("gmOverrideCancel");
    const floorTransition = document.getElementById("floorTransition");
    const floorTransitionCurrent = document.getElementById("floorTransitionCurrent");
    const floorTransitionNext = document.getElementById("floorTransitionNext");
    const floorTransitionLabel = document.getElementById("floorTransitionLabel");
    const floorTransitionMap = document.getElementById("floorTransitionMap");
    const answerOverlay = document.getElementById("answerOverlay");
    const answerOverlayLoadingText = document.getElementById("answerOverlayLoadingText");
    const answerOverlayMessage = document.getElementById("answerOverlayMessage");
    const answerOverlaySubtext = document.getElementById("answerOverlaySubtext");
    const startGameOverlay = document.getElementById("startGameOverlay");
    const startGameTeamLabel = document.getElementById("startGameTeam");
    const startGameSummary = document.getElementById("startGameSummary");
    const startGameNote = document.getElementById("startGameNote");
    const startGameBegin = document.getElementById("startGameBegin");
    const FLOOR_TRANSITION_STAGE_CLASSES = [
      "is-stage-hold",
      "is-stage-zoom-in",
      "is-stage-travel",
      "is-stage-mid",
      "is-stage-zoom-out",
      "is-stage-final",
      "is-stage-label-rise",
      "is-stage-label-hold"
    ];
    const FLOOR_TRANSITION_STAGE_TIMELINE = [
      { stage: "is-stage-hold", delay: 0 },
      { stage: "is-stage-zoom-in", delay: 250 },
      { stage: "is-stage-travel", delay: 500 },
      { stage: "is-stage-mid", delay: 2000 },
      { stage: "is-stage-zoom-out", delay: 2250 },
      { stage: "is-stage-final", delay: 2500 },
      { stage: "is-stage-label-rise", delay: 2750 },
      { stage: "is-stage-label-hold", delay: 4000 }
    ];
    const FLOOR_TRANSITION_TOTAL_DURATION = 5000;
    const rootMain = document.querySelector("main");
    const gmSheet = document.getElementById("gmSheet");
    const gmStartList = document.getElementById("gmStartList");
    const gmOverrideList = document.getElementById("gmOverrideList");
    const gmLocationList = document.getElementById("gmLocationList");
    const gmTeamOrders = document.getElementById("gmTeamOrders");
    const gmCells = document.getElementById("gmCells");
    const gmQrOverlay = document.getElementById("gmQrOverlay");
    const gmQrOverlayCode = document.getElementById("gmQrOverlayCode");
    const gmQrOverlayTitle = document.getElementById("gmQrOverlayTitle");
    const gmQrOverlaySubtitle = document.getElementById("gmQrOverlaySubtitle");
    const gmQrOverlayClose = document.getElementById("gmQrOverlayClose");
    const puzzleView = document.getElementById("puzzleView");
    const puzzleLock = document.getElementById("puzzleLock");
    const puzzleLockMessage = document.getElementById("puzzleLockMessage");
    const puzzleLockAction = document.getElementById("puzzleLockAction");

    const scannerModal = document.getElementById("scannerModal");
    const scannerVideo = document.getElementById("scannerVideo");
    const scanStatus = document.getElementById("scanStatus");
    const scannerInstruction = document.getElementById("scannerInstruction");
    const scannerTitle = document.getElementById("scannerTitle");
    const manualCodeInput = document.getElementById("manualCode");
    const submitCodeButton = document.getElementById("submitCode");
    const cancelScanButton = document.getElementById("cancelScan");
    const scannerShell = document.getElementById("scannerShell");

    const defaultState = (teamId = null) => ({
      teamId,
      hasStarted: false,
      completions: Array.from({ length: PUZZLE_COUNT }, () => false),
      unlocked: Array.from({ length: PUZZLE_COUNT }, () => false),
      revealed: Array.from({ length: PUZZLE_COUNT }, () => false),
      hasWon: false
    });

    let state = loadState();
    let statusTimeoutId = null;
    let scanSession = {
      stream: null,
      detector: null,
      rafId: null,
      intent: null,
      useJsQr: false,
      canvas: null,
      canvasContext: null,
      isProcessing: false,
      validationTimer: null
    };
    let jsQrLoadPromise = null;
    const unlockAnimationQueue = new Set();
    let gmCellsBound = false;
    let gmOverlayEscapeBound = false;
    let gmOverlayCloseBound = false;
    let mapOverlayEscapeBound = false;
    let gmOverrideEscapeBound = false;
    let gmLastActivatedCell = null;
    let puzzleLockTimeoutId = null;
    let pendingPuzzleUnlockIndex = null;
    let puzzleLockCurrentState = "hidden";
    let gmAccessGranted = false;
    const gmOverrideSession = {
      teamId: null,
      sourceCode: null
    };
    let obfuscationSecretBytes = null;
    let floorTransitionTimeoutId = null;
    const floorTransitionStageTimers = [];
    let startOverlayEscapeBound = false;
    let pendingTeamStart = null;
    let answerOverlayTimers = [];
    const gmAuthState = {
      overlay: null,
      form: null,
      input: null,
      remember: null,
      feedback: null
    };

    const hasMediaDevices = Boolean(navigator.mediaDevices?.getUserMedia);
    const prefersReducedMotionQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)") ?? { matches: false };
    let prefersReducedMotion = Boolean(prefersReducedMotionQuery.matches);

    if (prefersReducedMotion) {
      hideFloorTransition();
    }

    if (typeof prefersReducedMotionQuery.addEventListener === "function") {
      prefersReducedMotionQuery.addEventListener("change", event => {
        prefersReducedMotion = event.matches;
        if (prefersReducedMotion) {
          hideFloorTransition();
        }
      });
    } else if (typeof prefersReducedMotionQuery.addListener === "function") {
      prefersReducedMotionQuery.addListener(event => {
        prefersReducedMotion = event.matches;
        if (prefersReducedMotion) {
          hideFloorTransition();
        }
      });
    }

    const CONFETTI_THEMES = Object.freeze({
      general: ["#6ff0eb", "#54c8f2", "#ffe066", "#f29b9b"],
      start: ["#6ff0eb", "#8ef5a2", "#ffe066", "#9d65ff"],
      unlock: ["#54f2f2", "#f2c94c", "#f29b9b", "#9d65ff"],
      solve: ["#6ff0eb", "#ffe066", "#ff9a76", "#8ef5a2"],
      finale: ["#6ff0eb", "#ff6f91", "#ffd460", "#9d65ff", "#f8f4ff"]
    });
    const searchParams = new URLSearchParams(window.location.search ?? "");
    const isWinView =
      window.location.pathname?.toLowerCase().includes("/win") ||
      (searchParams.get("view") ?? "").toLowerCase() === "win" ||
      window.location.hash?.toLowerCase().includes("win");
    const isGmSheet =
      window.location.pathname?.toLowerCase().includes("/gm-sheet") ||
      (searchParams.get("view") ?? "").toLowerCase() === "gm" ||
      window.location.hash?.toLowerCase().includes("gm-sheet");

    puzzleLockAction?.addEventListener("click", () => {
      if (scanButton?.disabled) {
        return;
      }
      scanButton.click();
    });


    viewTowerMapButton?.addEventListener("click", openTowerMapOverlay);
    towerMapOverlayClose?.addEventListener("click", closeTowerMapOverlay);
    towerMapOverlay?.addEventListener("click", event => {
      if (event.target === towerMapOverlay) {
        closeTowerMapOverlay();
      }
    });

    startGameBegin?.addEventListener("click", beginPendingTeamStart);

    initialize();

    function initialize() {
      if (isWinView) {
        renderWinPage();
        return;
      }
      if (isGmSheet) {
        enforceGmPassword();
        return;
      }
      detectPlatform();
      attachEventListeners();
      render();
      maybePromptForWin();
    }

    function maybePromptForWin() {
      if (!state?.hasWon || isWinView || isGmSheet) {
        return;
      }
      if (window.location.pathname && window.location.pathname.toLowerCase().includes("/win")) {
        return;
      }
      try {
        window.location.replace("/win.html");
      } catch (err) {
        // ignore navigation errors
      }
    }

    function renderWinPage() {
      const winPage = document.getElementById("winPage");
      if (!winPage) {
        console.error("Win page markup missing");
        window.location.replace("/");
        return;
      }

      const hasVictory = Boolean(state?.hasWon) || (Array.isArray(state?.completions) && state.completions.every(Boolean));
      if (!hasVictory) {
        window.location.replace("/");
        return;
      }

      document.body.classList.add("win-page-active");

      const teamName = Number.isInteger(state.teamId) ? TEAM_NAMES[state.teamId] : "Tower Champions";
      const totalSolved = solvedCount();

      const teamLabel = document.getElementById("winTeamName");
      if (teamLabel) {
        teamLabel.textContent = teamName;
      }

      const headline = document.getElementById("winHeadline");
      if (headline) {
        headline.textContent = `${teamName} Triumphs`;
      }

      try {
        document.title = `${teamName} Triumphs • Tower Scavenger Hunt`;
      } catch (err) {
        // ignore document errors
      }

      const statsLabel = document.getElementById("winStats");
      if (statsLabel) {
        statsLabel.textContent = `${totalSolved} / ${PUZZLE_COUNT} missions cracked`;
      }

      const messageLabel = document.getElementById("winMessage");
      if (messageLabel) {
        messageLabel.textContent = `${teamName} dismantled every lock in the tower.`;
      }

      const continueNote = document.getElementById("winNote");
      if (continueNote) {
        continueNote.textContent = state.hasWon
          ? "Await a GM override scan to release this device."
          : "Reconnect with your game master to claim your victory prize.";
      }

      const confettiButton = document.getElementById("winConfettiButton");
      const sprayConfetti = () => triggerConfetti({ theme: "finale", pieces: 220, spread: 22 });
      confettiButton?.addEventListener("click", () => {
        sprayConfetti();
        window.setTimeout(sprayConfetti, 320);
      });

      window.setTimeout(sprayConfetti, 320);
      window.setTimeout(() => triggerConfetti({ theme: "finale", pieces: 180, spread: 16 }), 1100);

      const replayOriginal = document.getElementById("winReplayButton");
      if (replayOriginal) {
        const replayButton = replayOriginal.cloneNode(true);
        replayOriginal.replaceWith(replayButton);
        if (state.hasWon) {
          replayButton.textContent = "Scan GM Override";
          replayButton.addEventListener("click", () => openScanner({ mode: "gmOverride" }));
        } else {
          replayButton.textContent = "Return to Control Room";
          replayButton.addEventListener("click", () => {
            window.location.replace("/");
          });
        }
      }
    }

    function enforceGmPassword() {
      if (gmAccessGranted || hasValidGmToken()) {
        gmAccessGranted = true;
        renderGmSheet();
        return;
      }
      showGmAuthOverlay();
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
        // ignore storage errors
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
        // ignore session storage errors
      }
    }

    function showGmAuthOverlay() {
      if (gmAuthState.overlay) {
        gmAuthState.overlay.removeAttribute("hidden");
        if (gmAuthState.feedback) {
          gmAuthState.feedback.textContent = "";
          gmAuthState.feedback.classList.remove("is-success");
        }
        gmAuthState.input?.classList.remove("is-invalid");
        if (gmAuthState.input) {
          gmAuthState.input.value = "";
        }
        if (gmAuthState.remember) {
          gmAuthState.remember.checked = false;
        }
        gmAuthState.input?.focus();
        return;
      }

      const overlay = document.createElement("div");
      overlay.className = "gm-auth-overlay";
      overlay.id = "gmAuthOverlay";

      const card = document.createElement("div");
      card.className = "gm-auth-card";

      const heading = document.createElement("h1");
      heading.textContent = "Game Master Access";

      const intro = document.createElement("p");
      intro.textContent = "Enter the passphrase to unlock the GM sheet.";

      const form = document.createElement("form");
      form.className = "gm-auth-form";
      form.id = "gmAuthForm";

      const field = document.createElement("div");
      field.className = "gm-auth-field";

      const label = document.createElement("label");
      label.setAttribute("for", "gmAuthPassword");
      label.textContent = "Passphrase";

      const input = document.createElement("input");
      input.type = "password";
      input.id = "gmAuthPassword";
      input.className = "gm-auth-input";
      input.autocomplete = "current-password";
      input.placeholder = "Enter passphrase";

      field.append(label, input);

      const remember = document.createElement("label");
      remember.className = "gm-auth-remember";

      const rememberInput = document.createElement("input");
      rememberInput.type = "checkbox";
      rememberInput.id = "gmAuthRemember";

      remember.append(rememberInput, document.createTextNode("Remember on this device"));

      const actions = document.createElement("div");
      actions.className = "gm-auth-actions";

      const submitButton = document.createElement("button");
      submitButton.type = "submit";
      submitButton.className = "primary-action gm-auth-submit";
      submitButton.textContent = "Unlock";

      actions.append(submitButton);

      const feedback = document.createElement("div");
      feedback.className = "gm-auth-feedback";
      feedback.id = "gmAuthFeedback";

      form.append(field, remember, actions, feedback);

      card.append(heading, intro, form);
      overlay.append(card);
      document.body.append(overlay);

      gmAuthState.overlay = overlay;
      gmAuthState.form = form;
      gmAuthState.input = input;
      gmAuthState.remember = rememberInput;
      gmAuthState.feedback = feedback;

      form.addEventListener("submit", handleGmAuthSubmit);
      input.addEventListener("input", () => {
        input.classList.remove("is-invalid");
        if (gmAuthState.feedback) {
          gmAuthState.feedback.textContent = "";
          gmAuthState.feedback.classList.remove("is-success");
        }
      });

      window.setTimeout(() => {
        gmAuthState.input?.focus();
      }, 50);
    }

    function handleGmAuthSubmit(event) {
      event.preventDefault();
      if (!gmAuthState.input) {
        return;
      }

      const supplied = gmAuthState.input.value.trim();
      if (!supplied) {
        showGmAuthError("Enter the passphrase to continue.");
        return;
      }

      if (!validateGmToken(createGmToken(supplied))) {
        showGmAuthError("Incorrect passphrase. Try again.");
        return;
      }

      const token = createGmToken(GM_PASSWORD);
      setSessionGmToken(token);
      if (gmAuthState.remember?.checked) {
        setStoredGmToken(token);
      } else {
        setStoredGmToken(null);
      }

      gmAccessGranted = true;
      if (gmAuthState.feedback) {
        gmAuthState.feedback.textContent = "Access granted.";
        gmAuthState.feedback.classList.add("is-success");
      }
      gmAuthState.input.classList.remove("is-invalid");

      window.setTimeout(() => {
        teardownGmAuthOverlay();
        renderGmSheet();
      }, 180);
    }

    function showGmAuthError(message) {
      if (!gmAuthState.input) {
        return;
      }
      gmAuthState.input.classList.add("is-invalid");
      if (gmAuthState.feedback) {
        gmAuthState.feedback.textContent = message;
        gmAuthState.feedback.classList.remove("is-success");
      }
      gmAuthState.input.focus();
      gmAuthState.input.select();
    }

    function teardownGmAuthOverlay() {
      if (gmAuthState.overlay) {
        gmAuthState.overlay.remove();
      }
      gmAuthState.overlay = null;
      gmAuthState.form = null;
      gmAuthState.input = null;
      gmAuthState.remember = null;
      gmAuthState.feedback = null;
    }

    function renderGmSheet() {
      document.body.classList.add("is-gm-sheet");
      if (!document.title.toLowerCase().includes("gm reference sheet")) {
        document.title = `GM Reference Sheet — ${document.title}`;
      }
      if (rootMain) {
        rootMain.classList.add("is-hidden");
      }
      gmSheet?.classList.remove("is-hidden");

      renderGmLists();
      renderGmTeamOrders();
      ensureGmCellListeners();
    }

    function renderGmLists() {
      renderGmStartList();
      renderGmOverrideList();
      renderGmLocationList();
    }

    function renderGmStartList() {
      if (!gmStartList) return;
      const startEntries = Object.entries(START_CODES).sort((a, b) => a[1] - b[1]);
      gmStartList.innerHTML = startEntries
        .map(([code, index]) => {
          const teamName = TEAM_NAMES[index] ?? `Team ${index + 1}`;
          return buildGmCellItemMarkup({
            code,
            category: "start",
            primary: teamName,
            secondary: "Start QR",
            title: `${teamName}`,
            subtitle: "Team start badge"
          });
        })
        .join("");
    }

    function renderGmOverrideList() {
      if (!gmOverrideList) return;
      const overrideEntries = Object.entries(GM_TEAM_CODES).sort((a, b) => a[1] - b[1]);
      gmOverrideList.innerHTML = overrideEntries
        .map(([code, index]) => {
          const teamName = TEAM_NAMES[index] ?? `Team ${index + 1}`;
          return buildGmCellItemMarkup({
            code,
            category: "override",
            primary: teamName,
            secondary: "GM Override",
            title: `${teamName}`,
            subtitle: "Override access"
          });
        })
        .join("");
    }

    function renderGmLocationList() {
      if (!gmLocationList) return;
      gmLocationList.innerHTML = puzzles
        .map((puzzle, index) => {
          const label = puzzle?.floor ?? `Puzzle ${index + 1}`;
          return buildGmCellItemMarkup({
            code: puzzle.qr,
            category: "location",
            primary: label,
            secondary: "Location QR",
            title: label,
            subtitle: "Onsite checkpoint"
          });
        })
        .join("");
    }

    function buildGmCellItemMarkup({ code, category, primary, secondary, title, subtitle }) {
      const safePrimary = escapeHtml(primary);
      const safeSecondary = escapeHtml(secondary ?? "");
      const safeTitle = escapeHtml(title ?? primary ?? "QR Code");
      const safeSubtitle = escapeHtml(subtitle ?? "");
      const safeCode = escapeHtml(code);
      const safeCategory = escapeHtml(category ?? "general");
      return `
        <button type="button" role="listitem" class="gm-cell-item" data-code="${safeCode}" data-category="${safeCategory}" data-label="${safeTitle}" data-subtitle="${safeSubtitle}" aria-label="${safeTitle} QR">
          <span class="gm-cell-label">
            <span class="gm-cell-primary">${safePrimary}</span>
            <span class="gm-cell-secondary">${safeSecondary}</span>
          </span>
          <span class="gm-cell-action">View</span>
        </button>
      `;
    }

    function renderGmTeamOrders() {
      if (!gmTeamOrders) return;

      gmTeamOrders.innerHTML = TEAM_ORDERS.map((order, teamIndex) => {
        const teamName = TEAM_NAMES[teamIndex] ?? `Team ${teamIndex + 1}`;
        const listItems = order
          .map((puzzleIndex, step) => {
            const puzzle = puzzles[puzzleIndex];
            const label = puzzle ? puzzle.floor : `Puzzle ${puzzleIndex}`;
            return `<li>Step ${step + 1}: ${escapeHtml(label)}</li>`;
          })
          .join("");
        return `<article class="gm-order-card"><h3>${escapeHtml(teamName)}</h3><ol class="gm-order-list">${listItems}</ol></article>`;
      }).join("");
    }

    function ensureGmCellListeners() {
      if (!gmCellsBound && gmCells) {
        gmCells.addEventListener("click", handleGmCellClick);
        gmCellsBound = true;
      }

      if (!gmOverlayCloseBound) {
        gmQrOverlayClose?.addEventListener("click", closeGmQrOverlay);
        gmQrOverlay?.addEventListener("click", event => {
          if (event.target === gmQrOverlay) {
            closeGmQrOverlay();
          }
        });
        gmOverlayCloseBound = true;
      }
    }

    function handleGmCellClick(event) {
      const trigger = event.target.closest(".gm-cell-item");
      if (!trigger) {
        return;
      }

      const code = trigger.dataset.code;
      if (!code) {
        return;
      }

      gmLastActivatedCell = trigger;
      const label = trigger.dataset.label || trigger.querySelector(".gm-cell-primary")?.textContent || "QR Code";
      const subtitle = trigger.dataset.subtitle || "";
      const category = trigger.dataset.category || "general";

      openGmQrOverlay({ code, label, subtitle, category });
    }

    function openTowerMapOverlay() {
      if (!towerMapOverlay || !towerLevels) {
        return;
      }
      renderTowerMap();
      towerMapOverlay.classList.add("is-visible");
      towerMapOverlay.removeAttribute("hidden");
      document.body.classList.add("is-map-overlay-open");
      towerMapOverlayClose?.focus({ preventScroll: true });
      if (!mapOverlayEscapeBound) {
        window.addEventListener("keydown", handleMapOverlayKeydown, { passive: true });
        mapOverlayEscapeBound = true;
      }
    }

    function closeTowerMapOverlay() {
      if (!towerMapOverlay) {
        return;
      }
      towerMapOverlay.classList.remove("is-visible");
      towerMapOverlay.setAttribute("hidden", "true");
      document.body.classList.remove("is-map-overlay-open");
      viewTowerMapButton?.focus({ preventScroll: true });
      if (mapOverlayEscapeBound) {
        window.removeEventListener("keydown", handleMapOverlayKeydown);
        mapOverlayEscapeBound = false;
      }
    }

    function handleMapOverlayKeydown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeTowerMapOverlay();
      }
    }

    function openStartOverlay({ teamName, firstFloor, hadProgress }) {
      if (!startGameOverlay) {
        beginPendingTeamStart();
        return;
      }

      startGameOverlay.classList.add("is-visible");
      startGameOverlay.removeAttribute("hidden");
      startGameOverlay.setAttribute("aria-hidden", "false");
      document.body.classList.add("is-start-overlay-open");

      if (startGameTeamLabel) {
        startGameTeamLabel.textContent = teamName ?? "";
      }

      if (startGameSummary) {
        if (firstFloor) {
          const basementPrefix = firstFloor.toLowerCase().includes("basement")
            ? `Launch from the basement control room and stay on ${firstFloor}.`
            : `Launch from the basement control room, then head to ${firstFloor}.`;
          startGameSummary.textContent = basementPrefix;
        } else {
          startGameSummary.textContent = "Launch from the basement control room and await instructions.";
        }
      }

      if (startGameNote) {
        startGameNote.textContent = hadProgress
          ? "Previous progress on this device was cleared for a fresh run."
          : "Coordinate with your team and press begin when you're ready.";
      }

      if (startGameBegin) {
        startGameBegin.focus({ preventScroll: true });
      }

      if (!startOverlayEscapeBound) {
        window.addEventListener("keydown", handleStartOverlayKeydown);
        startOverlayEscapeBound = true;
      }
    }

    function closeStartOverlay() {
      if (!startGameOverlay) {
        return;
      }

      startGameOverlay.classList.remove("is-visible");
      startGameOverlay.setAttribute("hidden", "true");
      startGameOverlay.setAttribute("aria-hidden", "true");
      document.body.classList.remove("is-start-overlay-open");

      if (startOverlayEscapeBound) {
        window.removeEventListener("keydown", handleStartOverlayKeydown);
        startOverlayEscapeBound = false;
      }
    }

    function handleStartOverlayKeydown(event) {
      if ((event.key === "Enter" || event.key === " ") && pendingTeamStart) {
        event.preventDefault();
        beginPendingTeamStart();
      }
    }

    function beginPendingTeamStart() {
      if (!pendingTeamStart) {
        closeStartOverlay();
        return;
      }

      const details = pendingTeamStart;
      pendingTeamStart = null;
      closeStartOverlay();

      finalizeTeamAssignment({
        statusMessage: details.statusMessage,
        nextIndex: details.nextIndex,
        hadProgress: details.hadProgress,
        fromIndex: details.fromIndex
      });
    }

    function clearAnswerOverlayTimers() {
      if (!answerOverlayTimers.length) {
        return;
      }
      answerOverlayTimers.forEach(id => window.clearTimeout(id));
      answerOverlayTimers = [];
    }

    function hideAnswerOverlay({ immediate = false } = {}) {
      if (!answerOverlay) {
        return;
      }
      clearAnswerOverlayTimers();
      if (immediate) {
        answerOverlay.classList.remove("is-visible", "is-loading", "is-result", "is-success", "is-error", "is-closing");
        answerOverlay.setAttribute("hidden", "true");
        answerOverlay.setAttribute("aria-hidden", "true");
        return;
      }
      answerOverlay.classList.add("is-closing");
      const removalTimer = window.setTimeout(() => {
        answerOverlay.classList.remove("is-visible", "is-loading", "is-result", "is-success", "is-error", "is-closing");
        answerOverlay.setAttribute("hidden", "true");
        answerOverlay.setAttribute("aria-hidden", "true");
      }, 240);
      answerOverlayTimers.push(removalTimer);
    }

    function runAnswerOverlay({ status, floorName }) {
      if (!answerOverlay) {
        return Promise.resolve();
      }

      clearAnswerOverlayTimers();
      answerOverlay.classList.remove("is-result", "is-success", "is-error", "is-closing");
      answerOverlay.classList.add("is-visible", "is-loading");
      answerOverlay.removeAttribute("hidden");
      answerOverlay.setAttribute("aria-hidden", "false");

      if (answerOverlayLoadingText) {
        const label = floorName ? `Checking ${floorName}…` : "Checking answer…";
        answerOverlayLoadingText.textContent = label;
      }
      if (answerOverlayMessage) {
        answerOverlayMessage.textContent = "";
      }
      if (answerOverlaySubtext) {
        answerOverlaySubtext.textContent = "";
      }

      return new Promise(resolve => {
        const loadingTimer = window.setTimeout(() => {
          answerOverlay.classList.remove("is-loading");
          answerOverlay.classList.add("is-result");

          const isCorrect = status === "correct";
          answerOverlay.classList.toggle("is-success", isCorrect);
          answerOverlay.classList.toggle("is-error", !isCorrect);

          if (answerOverlayMessage) {
            answerOverlayMessage.textContent = isCorrect ? "Correct!" : "Not Quite";
          }
          if (answerOverlaySubtext) {
            const name = floorName ?? "this puzzle";
            answerOverlaySubtext.textContent = isCorrect
              ? `${name} cleared.`
              : `Try again on ${name}.`;
          }

          const resultTimer = window.setTimeout(() => {
            answerOverlay.classList.add("is-closing");
            const closeTimer = window.setTimeout(() => {
              hideAnswerOverlay({ immediate: true });
              resolve();
            }, 240);
            answerOverlayTimers.push(closeTimer);
          }, 1500);

          answerOverlayTimers.push(resultTimer);
        }, 500);

        answerOverlayTimers.push(loadingTimer);
      });
    }

    function openGmOverrideOverlay(teamId) {
      if (!gmOverrideOverlay || !gmOverrideOptions) {
        return;
      }

      const sanitizedTeam = clampNumber(teamId, 0, TEAM_COUNT - 1);
      gmOverrideSession.teamId = sanitizedTeam;

      const teamName = TEAM_NAMES[sanitizedTeam] ?? `Team ${sanitizedTeam + 1}`;
      if (gmOverrideSubtitle) {
        gmOverrideSubtitle.textContent = `${teamName} • Override Controls`;
      }

      renderGmOverrideOptions(sanitizedTeam);

      if (gmOverrideFeedback) {
        gmOverrideFeedback.textContent = "Select the state that matches where this team should resume.";
      }

      gmOverrideOverlay.classList.add("is-visible");
      gmOverrideOverlay.removeAttribute("hidden");
      gmOverrideOverlay.setAttribute("aria-hidden", "false");
      document.body.classList.add("is-gm-override-open");

      const defaultRadio = gmOverrideOptions.querySelector('input[type="radio"]:checked') ??
        gmOverrideOptions.querySelector('input[type="radio"]');
      if (defaultRadio) {
        defaultRadio.focus({ preventScroll: true });
      }

      if (!gmOverrideEscapeBound) {
        window.addEventListener("keydown", handleGmOverrideKeydown, { passive: true });
        gmOverrideEscapeBound = true;
      }
    }

    function closeGmOverrideOverlay() {
      if (!gmOverrideOverlay) {
        return;
      }

      gmOverrideOverlay.classList.remove("is-visible");
      gmOverrideOverlay.setAttribute("hidden", "true");
      gmOverrideOverlay.setAttribute("aria-hidden", "true");
      document.body.classList.remove("is-gm-override-open");

      if (gmOverrideEscapeBound) {
        window.removeEventListener("keydown", handleGmOverrideKeydown);
        gmOverrideEscapeBound = false;
      }

      gmOverrideForm?.reset();

      if (gmOverrideFeedback) {
        gmOverrideFeedback.textContent = "";
      }

      resetGmOverrideSession();
      gmOverrideButton?.focus({ preventScroll: true });
    }

    function handleGmOverrideKeydown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeGmOverrideOverlay();
      }
    }

    function renderGmOverrideOptions(teamId) {
      if (!gmOverrideOptions) {
        return;
      }

      gmOverrideOptions.innerHTML = "";
      const optionGroup = document.createDocumentFragment();

      const order = getTeamOrder(teamId);
      if (!order.length) {
        const empty = document.createElement("div");
        empty.textContent = "No missions configured for this team.";
        empty.className = "gm-override-feedback";
        optionGroup.append(empty);
        gmOverrideOptions.append(optionGroup);
        return;
      }

      const selection = deriveGmDefaultSelection(teamId);

      const resetOption = createGmOverrideOption({
        id: `gm-override-${teamId}-reset`,
        value: "reset",
        label: "Reset to Start",
        description: "Clears all progress and reveals the first destination.",
        mode: "reset"
      });
      optionGroup.append(resetOption);

      order.forEach((puzzleIndex, position) => {
        const floorName = puzzles[puzzleIndex]?.floor ?? `Mission ${puzzleIndex + 1}`;
        const travelOption = createGmOverrideOption({
          id: `gm-override-${teamId}-travel-${puzzleIndex}`,
          value: `travel-${puzzleIndex}`,
          label: `Travel to ${floorName}`,
          description: position === order.length - 1
            ? "Send the team to the final mission location."
            : "Mark previous missions as complete and direct the team to travel here.",
          mode: "travel",
          puzzleIndex
        });

        const solveOption = createGmOverrideOption({
          id: `gm-override-${teamId}-solve-${puzzleIndex}`,
          value: `solve-${puzzleIndex}`,
          label: `Solve ${floorName}`,
          description: "Unlock this puzzle so the team can work on it immediately.",
          mode: "solve",
          puzzleIndex
        });

        optionGroup.append(travelOption, solveOption);
      });

      const completeOption = createGmOverrideOption({
        id: `gm-override-${teamId}-complete`,
        value: "complete",
        label: "Mark Tower Complete",
        description: "Set every mission as solved for this team.",
        mode: "complete"
      });
      optionGroup.append(completeOption);

      gmOverrideOptions.append(optionGroup);

      const radios = gmOverrideOptions.querySelectorAll('input[type="radio"]');
      radios.forEach(radio => {
        if (radio.value === selection) {
          radio.checked = true;
        }
      });

      if (!gmOverrideOptions.querySelector('input[type="radio"]:checked') && radios.length > 0) {
        radios[0].checked = true;
      }
    }

    function createGmOverrideOption({ id, value, label, description, mode, puzzleIndex }) {
      const option = document.createElement("label");
      option.className = "gm-override-option";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "gmOverrideState";
      input.value = value;
      input.id = id;
      input.required = true;
      if (mode) {
        input.dataset.mode = mode;
      }
      if (Number.isInteger(puzzleIndex)) {
        input.dataset.puzzleIndex = String(puzzleIndex);
      }

      const title = document.createElement("strong");
      title.textContent = label;

      const detail = document.createElement("span");
      detail.textContent = description;

      option.append(input, title, detail);
      return option;
    }

    function deriveGmDefaultSelection(teamId) {
      if (!Number.isInteger(state.teamId) || state.teamId !== teamId || !state.hasStarted) {
        return "reset";
      }

      if (state.completions.every(Boolean)) {
        return "complete";
      }

      const order = getTeamOrder(teamId);
      const pending = order.find(index => !state.completions[index]);

      if (typeof pending !== "number") {
        return "complete";
      }

      return (state.unlocked[pending] ? "solve-" : "travel-") + pending;
    }

    function handleGmOverrideSubmit(event) {
      event.preventDefault();
      if (!gmOverrideOptions) {
        return;
      }

      const selected = gmOverrideOptions.querySelector('input[name="gmOverrideState"]:checked');
      if (!selected) {
        if (gmOverrideFeedback) {
          gmOverrideFeedback.textContent = "Pick a state before applying it.";
        }
        return;
      }

      const teamId = gmOverrideSession.teamId;
      if (!Number.isInteger(teamId)) {
        if (gmOverrideFeedback) {
          gmOverrideFeedback.textContent = "Scan a GM override code to choose a team first.";
        }
        return;
      }

      const mode = selected.dataset.mode ?? "";
      const indexValue = selected.dataset.puzzleIndex;
      const puzzleIndex = typeof indexValue === "string" ? Number.parseInt(indexValue, 10) : null;

      const applied = applyGmOverrideState({ teamId, mode, puzzleIndex });
      if (!applied) {
        if (gmOverrideFeedback) {
          gmOverrideFeedback.textContent = "Unable to apply that state. Try a different option.";
        }
        return;
      }

      closeGmOverrideOverlay();
    }

    function applyGmOverrideState({ teamId, mode, puzzleIndex }) {
      if (!mode) {
        return false;
      }

      const sanitizedTeam = clampNumber(teamId, 0, TEAM_COUNT - 1);
      const order = getTeamOrder(sanitizedTeam);
      if (!order.length) {
        return false;
      }

      const working = defaultState(sanitizedTeam);
      working.hasStarted = true;

      const describe = { message: "", tone: "success" };

      if (mode === "reset") {
        const first = order[0];
        if (typeof first === "number") {
          working.revealed[first] = true;
        }
        working.hasWon = false;
        describe.message = `${TEAM_NAMES[sanitizedTeam] ?? `Team ${sanitizedTeam + 1}`} reset. First mission revealed.`;
      } else if (mode === "complete") {
        working.revealed.fill(true);
        working.unlocked.fill(true);
        working.completions.fill(true);
        working.hasWon = true;
        describe.message = `${TEAM_NAMES[sanitizedTeam] ?? `Team ${sanitizedTeam + 1}`} marked as tower complete.`;
      } else if ((mode === "travel" || mode === "solve") && Number.isInteger(puzzleIndex)) {
        const position = order.indexOf(puzzleIndex);
        if (position === -1) {
          return false;
        }

        for (let step = 0; step < position; step += 1) {
          const clearedIndex = order[step];
          working.revealed[clearedIndex] = true;
          working.unlocked[clearedIndex] = true;
          working.completions[clearedIndex] = true;
        }

        working.revealed[puzzleIndex] = true;
        working.unlocked[puzzleIndex] = mode === "solve";
        working.completions[puzzleIndex] = false;
        working.hasWon = false;

        const destination = puzzles[puzzleIndex]?.floor ?? `Mission ${puzzleIndex + 1}`;
        describe.message = mode === "solve"
          ? `${TEAM_NAMES[sanitizedTeam] ?? `Team ${sanitizedTeam + 1}`} now solving ${destination}.`
          : `${TEAM_NAMES[sanitizedTeam] ?? `Team ${sanitizedTeam + 1}`} traveling to ${destination}.`;
      } else {
        return false;
      }

      state = sanitizeState(working);
      pendingPuzzleUnlockIndex = null;
      saveState();
      if (!isWinView) {
        render();
      }

      showStatus(describe.message.trim(), describe.tone);
      if (!state.hasWon) {
        try {
          if (window.location.pathname?.toLowerCase().includes('/win')) {
            window.location.replace('/');
          }
        } catch (err) {
          // ignore navigation errors
        }
      }
      return true;
    }

    function resetGmOverrideSession() {
      gmOverrideSession.teamId = null;
      gmOverrideSession.sourceCode = null;
    }

    function openGmQrOverlay({ code, label, subtitle, category }) {
      if (!gmQrOverlay || !gmQrOverlayCode) {
        return;
      }

      gmQrOverlayCode.innerHTML = "";
      const size = 520;
      const encoded = encodeURIComponent(code ?? "");
      const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=" + size + "x" + size + "&data=" + encoded + "&margin=20";

      const img = document.createElement("img");
      img.alt = label ? `QR code for ${label}` : "QR code";
      img.width = size;
      img.height = size;
      img.loading = "lazy";
      img.decoding = "async";
      const loadingText = document.createElement("div");
      loadingText.textContent = "Generating QR…";
      loadingText.className = "gm-qr-overlay-loading";
      gmQrOverlayCode.append(loadingText);
      gmQrOverlayCode.append(img);

      img.addEventListener("error", () => {
        console.error("Unable to display QR code image");
        loadingText.remove();
        img.replaceWith(document.createTextNode("Unable to load QR code."));
      });

      fetch(qrUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`QR server responded with ${response.status}`);
          }
          return response.blob();
        })
        .then(blob => {
          const objectUrl = URL.createObjectURL(blob);
          img.src = objectUrl;
          img.addEventListener("load", () => {
            URL.revokeObjectURL(objectUrl);
            loadingText.remove();
          }, { once: true });
        })
        .catch(error => {
          console.error("Unable to fetch QR code", error);
          loadingText.remove();
          img.replaceWith(document.createTextNode("Unable to load QR code."));
        });

      if (gmQrOverlayTitle) {
        gmQrOverlayTitle.textContent = label;
      }
      if (gmQrOverlaySubtitle) {
        const displaySubtitle = subtitle || categoryLabel(category);
        gmQrOverlaySubtitle.textContent = displaySubtitle;
      }

      gmQrOverlay.classList.add("is-visible");
      gmQrOverlay.removeAttribute("hidden");
      document.body.classList.add("is-qr-overlay-open");
      gmQrOverlayClose?.focus({ preventScroll: true });

      if (!gmOverlayEscapeBound) {
        window.addEventListener("keydown", handleGmOverlayKeydown, { passive: true });
        gmOverlayEscapeBound = true;
      }
    }

    function closeGmQrOverlay() {
      if (!gmQrOverlay) {
        return;
      }

      gmQrOverlay.classList.remove("is-visible");
      gmQrOverlay.setAttribute("hidden", "true");
      gmQrOverlayCode?.replaceChildren();
      document.body.classList.remove("is-qr-overlay-open");

      if (gmLastActivatedCell) {
        gmLastActivatedCell.focus({ preventScroll: true });
        gmLastActivatedCell = null;
      }

      if (gmOverlayEscapeBound) {
        window.removeEventListener("keydown", handleGmOverlayKeydown);
        gmOverlayEscapeBound = false;
      }
    }

    function handleGmOverlayKeydown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeGmQrOverlay();
      }
    }

    function categoryLabel(category) {
      switch (category) {
        case "start":
          return "Team start badge";
        case "override":
          return "GM override access";
        case "location":
          return "Mission checkpoint";
        default:
          return "QR code";
      }
    }

    function escapeHtml(value) {
      return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }


    function detectPlatform() {
      const ua = navigator.userAgent || "";
      const isIOS = /iPad|iPhone|iPod/.test(ua);
      const isAndroid = /Android/.test(ua);
      const isMobile = /Mobi|Android/i.test(ua);
      let label = isMobile ? "Platform: Mobile" : "Platform: Desktop";
      if (isIOS) label += " • iOS";
      if (isAndroid) label += " • Android";
      if (!hasMediaDevices) {
        label += " • Camera unavailable";
      }
      platformTag.textContent = label;
    }

    function attachEventListeners() {
      resetButton?.addEventListener("click", () => {
        if (!confirm("Reset all progress on this device?")) return;
        state = defaultState(null);
        pendingPuzzleUnlockIndex = null;
        clearStateCookie();
        hideFloorTransition();
        render();
        showStatus("Progress reset.", "success");
      });

      exportButton?.addEventListener("click", exportProgress);
      importButton?.addEventListener("click", importProgress);
      gmOverrideButton?.addEventListener("click", () => {
        if (!gmOverrideButton.disabled) {
          openScanner({ mode: "gmOverride" });
        }
      });

      scanButton?.addEventListener("click", () => {
        const intent = buildScanIntent();
        if (intent.mode === "complete") {
          showStatus("All missions already cleared.");
          return;
        }
        openScanner(intent);
      });

      answerForm?.addEventListener("submit", async event => {
        event.preventDefault();
        try {
          await submitPuzzleAnswer();
        } catch (err) {
          console.error("Answer submission failed", err);
        }
      });

      submitCodeButton?.addEventListener("click", () => {
        const code = manualCodeInput.value.trim();
        if (!code) {
          updateScanStatus("Enter a code before submitting.", "error");
          manualCodeInput.focus();
          return;
        }
        handleScanResult(code);
      });

      cancelScanButton?.addEventListener("click", () => {
        closeScanner("Scan cancelled.");
      });

      window.addEventListener("beforeunload", stopScannerStream);
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          stopScannerStream();
        }
      });

      gmOverrideClose?.addEventListener("click", event => {
        event.preventDefault();
        closeGmOverrideOverlay();
      });

      gmOverrideCancel?.addEventListener("click", event => {
        event.preventDefault();
        closeGmOverrideOverlay();
      });

      gmOverrideOverlay?.addEventListener("click", event => {
        if (event.target === gmOverrideOverlay) {
          closeGmOverrideOverlay();
        }
      });

      gmOverrideForm?.addEventListener("submit", handleGmOverrideSubmit);
    }

    function loadState() {
      const cookieValue = getCookie(COOKIE_NAME);
      if (!cookieValue) {
        return defaultState(null);
      }

      const normalized = safeDecodeURIComponent(cookieValue);
      let decoded = decodeStatePayload(normalized);
      if (!decoded && normalized !== cookieValue) {
        decoded = decodeStatePayload(cookieValue);
      }
      if (decoded) {
        return sanitizeState(decoded);
      }

      console.warn("Failed to parse cookie, resetting progress");
      return defaultState(null);
    }

    function saveState() {
      state = sanitizeState(state);
      const payload = encodeStatePayload(state);
      if (!payload) {
        return;
      }
      const maxAge = CACHE_DURATION_DAYS * 24 * 60 * 60;
      const encoded = encodeURIComponent(payload);
      document.cookie = `${COOKIE_NAME}=${encoded}; max-age=${maxAge}; path=/; SameSite=Lax`;
    }

    function clearStateCookie() {
      document.cookie = `${COOKIE_NAME}=; max-age=0; path=/; SameSite=Lax`;
    }

    function getCookie(name) {
      const prefix = `${name}=`;
      return document.cookie
        .split(";")
        .map(entry => entry.trim())
        .find(entry => entry.startsWith(prefix))
        ?.slice(prefix.length)
        ?.replace(/^"|"$/g, "");
    }

    function safeDecodeURIComponent(value) {
      if (typeof value !== "string") {
        return value;
      }
      try {
        return decodeURIComponent(value);
      } catch (err) {
        return value;
      }
    }

    function encodeStatePayload(currentState) {
      try {
        const sanitized = sanitizeState(currentState);
        return JSON.stringify(sanitized);
      } catch (error) {
        console.error("Failed to encode state", error);
        return null;
      }
    }

    function decodeStatePayload(value) {
      if (!value) {
        return null;
      }

      const candidates = buildDecodeCandidates(value);

      for (const candidate of candidates) {
        if (!candidate) continue;

        try {
          return JSON.parse(candidate);
        } catch (err) {
          const legacy = tryDecodeObfuscated(candidate);
          if (legacy) {
            return legacy;
          }

          try {
            const ascii = atob(candidate);
            if (ascii) {
              const nested = JSON.parse(ascii);
              return nested;
            }
          } catch (err2) {
            // ignore
          }
        }
      }

      return null;
    }

    function buildDecodeCandidates(initial) {
      const results = [];
      const seen = new Set();
      let current = initial;

      for (let index = 0; index < 4; index += 1) {
        if (typeof current !== "string" || !current) {
          break;
        }
        const trimmed = current.trim();
        if (!trimmed || seen.has(trimmed)) {
          break;
        }
        seen.add(trimmed);
        results.push(trimmed);

        const decoded = safeDecodeURIComponent(trimmed);
        if (decoded === trimmed) {
          break;
        }
        current = decoded;
      }

      return results;
    }

    function tryDecodeObfuscated(candidate) {
      try {
        const bytes = base64UrlToBytes(candidate);
        if (!bytes || !bytes.length) {
          return null;
        }
        const deobfuscated = xorBytes(bytes);
        const reversed = decodeUtf8(deobfuscated);
        const combined = reversed.split("").reverse().join("");
        const separatorIndex = combined.indexOf(":");
        if (separatorIndex === -1) {
          return null;
        }
        const signature = combined.slice(0, separatorIndex);
        const json = combined.slice(separatorIndex + 1);
        if (!signature || !json) {
          return null;
        }
        const expected = simpleSignature(json + COOKIE_SECRET);
        if (signature !== expected) {
          try {
            const parsed = JSON.parse(json);
            console.warn("Cookie signature mismatch, accepting payload without verification.");
            return parsed;
          } catch (err) {
            return null;
          }
        }
        return JSON.parse(json);
      } catch (err) {
        return null;
      }
    }

    function bytesToBase64Url(bytes) {
      let binary = "";
      for (let index = 0; index < bytes.length; index += 1) {
        binary += String.fromCharCode(bytes[index]);
      }
      return toBase64Url(binary);
    }

    function base64UrlToBytes(value) {
      const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
      const padLength = (4 - (normalized.length % 4)) % 4;
      const padded = normalized + "=".repeat(padLength);
      const binary = atob(padded);
      const bytes = new Uint8Array(binary.length);
      for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
      }
      return bytes;
    }

    function toBase64Url(binary) {
      return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
    }

    function encodeUtf8(value) {
      if (typeof TextEncoder === "function") {
        return new TextEncoder().encode(value);
      }
      const bytes = new Uint8Array(value.length);
      for (let index = 0; index < value.length; index += 1) {
        bytes[index] = value.charCodeAt(index) & 0xff;
      }
      return bytes;
    }

    function decodeUtf8(bytes) {
      if (typeof TextDecoder === "function") {
        return new TextDecoder().decode(bytes);
      }
      let result = "";
      for (let index = 0; index < bytes.length; index += 1) {
        result += String.fromCharCode(bytes[index]);
      }
      return result;
    }

    function xorBytes(bytes) {
      const secretBytes = getSecretBytes();
      if (!secretBytes.length) {
        return bytes.slice();
      }
      const result = new Uint8Array(bytes.length);
      for (let index = 0; index < bytes.length; index += 1) {
        result[index] = bytes[index] ^ secretBytes[index % secretBytes.length];
      }
      return result;
    }

    function getSecretBytes() {
      if (!obfuscationSecretBytes) {
        obfuscationSecretBytes = encodeUtf8(COOKIE_SECRET);
      }
      return obfuscationSecretBytes;
    }

    function simpleSignature(input) {
      let hash = 0;
      for (let index = 0; index < input.length; index += 1) {
        hash = (hash << 5) - hash + input.charCodeAt(index);
        hash |= 0;
      }
      return Math.abs(hash).toString(36);
    }

    function sanitizeState(candidate) {
      const fallback = defaultState(null);
      if (!candidate || typeof candidate !== "object") {
        return fallback;
      }

      let teamId = null;
      if (Number.isInteger(candidate.teamId)) {
        teamId = clampNumber(candidate.teamId, 0, TEAM_COUNT - 1);
      } else if (Number.isInteger(candidate.activeTeam)) {
        teamId = clampNumber(candidate.activeTeam, 0, TEAM_COUNT - 1);
      }

      let completions = candidate.completions;

      if (Array.isArray(candidate.progress) && candidate.progress.every(Array.isArray)) {
        const activeTeamIndex = Number.isInteger(candidate.activeTeam)
          ? clampNumber(candidate.activeTeam, 0, candidate.progress.length - 1)
          : Number.isInteger(teamId)
          ? clampNumber(teamId, 0, candidate.progress.length - 1)
          : 0;
        const source = candidate.progress[activeTeamIndex] ?? [];
        completions = source.map(Boolean);
      } else if (Array.isArray(candidate.progress)) {
        completions = candidate.progress.map(Boolean);
      }

      if (!Array.isArray(completions)) {
        completions = [];
      }

      const sanitizedCompletions = Array.from({ length: PUZZLE_COUNT }, (_, index) => Boolean(completions[index]));

      const unlockedSource = Array.isArray(candidate.unlocked) ? candidate.unlocked : [];
      const sanitizedUnlocked = Array.from({ length: PUZZLE_COUNT }, (_, index) => {
        if (sanitizedCompletions[index]) return true;
        return Boolean(unlockedSource[index]);
      });

      const revealedSource = Array.isArray(candidate.revealed) ? candidate.revealed : [];
      const sanitizedRevealed = Array.from({ length: PUZZLE_COUNT }, (_, index) => {
        if (sanitizedUnlocked[index]) return true;
        return Boolean(revealedSource[index]);
      });

      const hasStarted =
        Boolean(candidate.hasStarted) ||
        sanitizedRevealed.some(Boolean) ||
        sanitizedUnlocked.some(Boolean) ||
        sanitizedCompletions.some(Boolean);

      let hasWon = Boolean(candidate.hasWon);
      if (!hasWon && sanitizedCompletions.every(Boolean)) {
        hasWon = true;
      }

      return {
        teamId,
        hasStarted,
        completions: sanitizedCompletions,
        unlocked: sanitizedUnlocked,
        revealed: sanitizedRevealed,
        hasWon
      };
    }

    function clampNumber(value, min, max) {
      const n = Number.isFinite(value) ? Number(value) : min;
      return Math.min(Math.max(n, min), max);
    }

    function getTeamOrder(teamIdOverride = state.teamId) {
      if (!Number.isInteger(teamIdOverride)) {
        return [];
      }
      const sanitized = clampNumber(teamIdOverride, 0, TEAM_COUNT - 1);
      return TEAM_ORDERS[sanitized]?.slice() ?? [];
    }

    function solvedCount() {
      return state.completions.filter(Boolean).length;
    }

    function getNextDestinationIndex() {
      if (!Number.isInteger(state.teamId)) {
        return null;
      }
      const order = getTeamOrder();
      const next = order.find(index => !state.completions[index]);
      return typeof next === "number" ? next : null;
    }

    function getCurrentSolvingIndex() {
      if (!Number.isInteger(state.teamId)) {
        return null;
      }
      const order = getTeamOrder();
      const next = order.find(index => state.unlocked[index] && !state.completions[index]);
      return typeof next === "number" ? next : null;
    }

    function getStepNumber(puzzleIndex) {
      const order = getTeamOrder();
      const position = order.indexOf(puzzleIndex);
      return position === -1 ? null : position + 1;
    }

    function buildScanIntent() {
      if (!state.hasStarted || !Number.isInteger(state.teamId)) {
        return { mode: "start" };
      }

      const currentSolving = getCurrentSolvingIndex();
      if (currentSolving !== null) {
        return { mode: "location", puzzleIndex: currentSolving, reason: "rescan" };
      }

      const nextIndex = getNextDestinationIndex();
      if (nextIndex !== null) {
        if (state.revealed[nextIndex]) {
          return { mode: "location", puzzleIndex: nextIndex, reason: "travel" };
        }
        return { mode: "locked", puzzleIndex: nextIndex };
      }

      return { mode: "complete" };
    }

    function render() {
      renderProgress();
      renderProgressList();
      renderTowerMap();
      processQueuedAnimations();
      renderPuzzle();
    }

    function renderProgress() {
      const solved = solvedCount();
      progressBar.max = PUZZLE_COUNT;
      progressBar.value = solved;
      progressCount.textContent = `${solved} / ${PUZZLE_COUNT} puzzles solved`;

      if (Number.isInteger(state.teamId)) {
        progressLabel.textContent = `${TEAM_NAMES[state.teamId]} Progress`;
      } else if (state.hasStarted) {
        progressLabel.textContent = "Progress";
      } else {
        progressLabel.textContent = "Awaiting start";
      }
    }

    function renderProgressList() {
      const order = getTeamOrder();
      if (!state.hasStarted || !order.length) {
        updateProgressDescriptor({ message: "Scan the starting QR to begin." });
        renderProgressCard(null);
        return;
      }

      const currentSolving = getCurrentSolvingIndex();
      const nextDestination = getNextDestinationIndex();
      const cardData = buildProgressCardData({ currentSolving, nextDestination, order });
      updateProgressDescriptor(cardData.descriptor);
      renderProgressCard(cardData.card);
    }

    function buildProgressCardData({ currentSolving, nextDestination, order }) {
      const descriptor = { current: "", next: "" };
      const card = {
        stageLabel: "",
        stageStatus: "",
        index: null,
        total: order.length,
        travelHint: ""
      };

      if (currentSolving !== null) {
        const step = order.indexOf(currentSolving) + 1;
        descriptor.current = puzzles[currentSolving]?.floor ?? `Puzzle ${currentSolving}`;
        descriptor.next = nextDestination !== null && nextDestination !== currentSolving ? puzzles[nextDestination]?.floor : "Awaiting unlock";
        card.stageLabel = descriptor.current;
        card.stageStatus = "Solve this floor";
        card.index = step;
        card.travelHint = "Submit the correct answer to reveal the next location.";
        return { descriptor, card };
      }

      if (nextDestination !== null) {
        const step = order.indexOf(nextDestination) + 1;
        const destination = puzzles[nextDestination]?.floor ?? `Puzzle ${nextDestination}`;
        descriptor.current = "Awaiting travel";
        descriptor.next = destination;
        card.stageLabel = destination;
        card.stageStatus = "Travel to this floor";
        card.index = step;
        card.travelHint = "Scan the onsite QR code to unlock the puzzle.";
        return { descriptor, card };
      }

      descriptor.current = "Tower complete";
      descriptor.next = "All missions cleared";
      card.stageLabel = "Mission Complete";
      card.stageStatus = "Await further instructions";
      card.travelHint = "Enjoy the victory lap.";
      return { descriptor, card };
    }

    function updateProgressDescriptor(data) {
      if (!progressDescriptor) return;
      if (!data) {
        progressDescriptor.innerHTML = "";
        return;
      }

      if (data.message) {
        progressDescriptor.innerHTML = `<span>${data.message}</span>`;
        return;
      }

      const parts = [];
      if (data.current) {
        parts.push(`<div><strong>Current</strong><span>${data.current}</span></div>`);
      }
      if (data.next) {
        parts.push(`<div><strong>Next</strong><span>${data.next}</span></div>`);
      }
      progressDescriptor.innerHTML = parts.join("");
    }

    function renderProgressCard(card) {
      if (!progressCard) return;
      if (!card) {
        progressCard.innerHTML = "";
        progressCard.className = "progress-card";
        return;
      }

      const classes = ["progress-card"];
      if (card.stageStatus.includes("Travel")) {
        classes.push("is-travel");
      } else if (card.stageStatus.includes("Solve")) {
        classes.push("is-solving");
      }

      const progressBadge = card.index
        ? `<div class="progress-index">${card.index}</div>`
        : "";

      const totalLabel = card.index
        ? `<div class="progress-total">Step ${card.index} of ${card.total}</div>`
        : "";

      progressCard.className = classes.join(" ");
      progressCard.innerHTML = `
        <div class="progress-card-body">
          <div class="progress-card-header">
            ${progressBadge}
            <div class="progress-card-title">
              <div>${card.stageLabel}</div>
              ${totalLabel}
            </div>
          </div>
          <div class="progress-card-status">${card.stageStatus}</div>
          <div class="travel-instruction">${card.travelHint}</div>
        </div>
      `;
    }

    function renderTowerMap() {
      if (!towerLevels) return;

      towerLevels.innerHTML = "";

      const hasTeam = Number.isInteger(state.teamId);
      const currentSolving = getCurrentSolvingIndex();
      const nextDestination = getNextDestinationIndex();
      const orderSet = new Set(getTeamOrder());

      for (let index = puzzles.length - 1; index >= 0; index -= 1) {
        const puzzle = puzzles[index];
        const solved = Boolean(state.completions[index]);
        const unlocked = Boolean(state.unlocked[index]);
        const revealed = Boolean(state.revealed[index]);
        const inPath = orderSet.has(index);

        let statusClass = "is-pending";
        let statusLabel = "Waiting";

        if (state.hasStarted && hasTeam && inPath) {
          statusClass = "is-locked";
          statusLabel = "Locked";

          if (solved) {
            statusClass = "is-solved";
            statusLabel = "Solved";
          } else if (currentSolving === index) {
            statusClass = "is-active";
            statusLabel = "Solve now";
          } else if (unlocked) {
            statusClass = "is-unlocked";
            statusLabel = "Solve now";
          } else if (revealed) {
            statusClass = "is-revealed";
            statusLabel = "Travel";
          } else if (nextDestination === index) {
            statusLabel = "Next";
          }
        }

        const level = document.createElement("div");
        level.className = "tower-map-level";
        level.classList.add(statusClass);
        level.dataset.floorIndex = String(index);

        const entry = document.createElement("div");
        entry.className = "tower-map-entry";

        const lockIcon = createTowerLockIcon();

        const label = document.createElement("div");
        label.className = "tower-map-label";
        label.textContent = puzzle.floor;

        entry.append(lockIcon, label);

        const status = document.createElement("div");
        status.className = "tower-map-status";
        status.textContent = statusLabel;

        level.append(entry, status);
        towerLevels.append(level);

        if (index === 1) {
          const ground = document.createElement("div");
          ground.className = "tower-ground-line";
          towerLevels.append(ground);
        }
      }
    }

    function createTowerLockIcon() {
      const svg = document.createElementNS(SVG_NS, "svg");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("aria-hidden", "true");
      svg.classList.add("tower-map-lock");

      const shackle = document.createElementNS(SVG_NS, "path");
      shackle.setAttribute("d", "M8 10V8a4 4 0 0 1 8 0v2");
      shackle.classList.add("tower-map-lock-shackle");

      const body = document.createElementNS(SVG_NS, "rect");
      body.setAttribute("x", "6");
      body.setAttribute("y", "10");
      body.setAttribute("width", "12");
      body.setAttribute("height", "10");
      body.setAttribute("rx", "2.2");
      body.classList.add("tower-map-lock-body");

      const keyholeCircle = document.createElementNS(SVG_NS, "circle");
      keyholeCircle.setAttribute("cx", "12");
      keyholeCircle.setAttribute("cy", "14.4");
      keyholeCircle.setAttribute("r", "1.3");
      keyholeCircle.classList.add("tower-map-lock-keyhole");

      const keyholeStem = document.createElementNS(SVG_NS, "rect");
      keyholeStem.setAttribute("x", "11.4");
      keyholeStem.setAttribute("y", "15.4");
      keyholeStem.setAttribute("width", "1.2");
      keyholeStem.setAttribute("height", "3.2");
      keyholeStem.setAttribute("rx", "0.6");
      keyholeStem.classList.add("tower-map-lock-keyhole");

      svg.append(shackle, body, keyholeCircle, keyholeStem);
      return svg;
    }

    function processQueuedAnimations() {
      if (!towerLevels || unlockAnimationQueue.size === 0) {
        unlockAnimationQueue.clear();
        return;
      }

      const indexes = Array.from(unlockAnimationQueue);
      unlockAnimationQueue.clear();

      requestAnimationFrame(() => {
        indexes.forEach(index => {
          const target = towerLevels.querySelector(`[data-floor-index="${index}"]`);
          if (target) {
            target.classList.add("is-just-unlocked");
          }
        });
      });
    }

    function setPuzzleLockState(stateName, { message, actionLabel, actionDisabled = false } = {}) {
      if (!puzzleLock) {
        return;
      }

      if (puzzleLockMessage) {
        puzzleLockMessage.textContent = message ?? "";
      }

      if (puzzleLockAction) {
        if (actionLabel) {
          puzzleLockAction.hidden = false;
          puzzleLockAction.textContent = actionLabel;
          puzzleLockAction.disabled = Boolean(actionDisabled);
        } else {
          puzzleLockAction.hidden = true;
        }
      }

      if (puzzleLockTimeoutId) {
        clearTimeout(puzzleLockTimeoutId);
        puzzleLockTimeoutId = null;
      }

      puzzleLock.classList.remove("is-unlocking");

      if (stateName === "hidden") {
        puzzleLock.classList.remove("is-visible");
        puzzleLock.setAttribute("aria-hidden", "true");
        puzzleView?.classList.remove("is-locked");
        puzzleLockCurrentState = "hidden";
        if (puzzleLockAction) {
          puzzleLockAction.hidden = true;
        }
        return;
      }

      puzzleLock.classList.add("is-visible");
      puzzleLock.setAttribute("aria-hidden", "false");
      puzzleView?.classList.add("is-locked");

      if (stateName === "unlocking") {
        if (puzzleLockAction) {
          puzzleLockAction.hidden = true;
        }
        puzzleLock.classList.add("is-unlocking");
        puzzleLockCurrentState = "unlocking";
        puzzleLockTimeoutId = window.setTimeout(() => {
          puzzleLock.classList.remove("is-unlocking");
          puzzleView?.classList.remove("is-locked");
          setPuzzleLockState("hidden");
        }, 1100);
        return;
      }

      puzzleLockCurrentState = "locked";
    }

    function renderPuzzle() {
      const hasTeam = Number.isInteger(state.teamId);
      toggleWaitingAnimation(false);

      if (!state.hasStarted || !hasTeam) {
        puzzleTitle.textContent = "Awaiting Start";
        puzzleMeta.textContent = "Scan the starting QR code to receive your mission order.";
        puzzleBody.textContent = "Tap \"Scan Start Code\" when the game master signals the beginning of your run.";
        setPuzzleFeedback("");
        scanButton.disabled = false;
        scanButton.textContent = "Scan Start Code";
        toggleAnswerForm(false);
        toggleWaitingAnimation(true);
        setPuzzleLockState("locked", {
          message: "Locked • Ready to scan start code",
          actionLabel: scanButton.textContent,
          actionDisabled: scanButton.disabled
        });
        if (!state.hasStarted && !state.revealed.some(Boolean)) {
          showStatus("Ready to scan the team start QR code.", "success");
        }
        return;
      }

      const currentSolving = getCurrentSolvingIndex();
      if (currentSolving !== null) {
        const stepNumber = getStepNumber(currentSolving) ?? 0;
        const puzzle = puzzles[currentSolving];
        const fallbackPuzzleLabel = stepNumber ? `Puzzle ${stepNumber}` : `Puzzle ${currentSolving + 1}`;
        const puzzleName = puzzle?.floor ?? fallbackPuzzleLabel;
        puzzleTitle.textContent = puzzleName;
        puzzleMeta.textContent = `${TEAM_NAMES[state.teamId]} • Puzzle ${stepNumber} of ${PUZZLE_COUNT}`;
        puzzleBody.textContent = puzzle?.prompt ?? "Puzzle intel loading.";
        setPuzzleFeedback("Enter the correct answer to unlock the next destination.");
        scanButton.disabled = false;
        scanButton.textContent = "Scan QR Code";
        if (pendingPuzzleUnlockIndex === currentSolving) {
          setPuzzleLockState("unlocking", { message: `Unlocked • ${puzzleName}` });
          pendingPuzzleUnlockIndex = null;
        } else {
          setPuzzleLockState("hidden");
        }
        toggleAnswerForm(true);
        return;
      }

      const nextIndex = getNextDestinationIndex();
      if (nextIndex === null) {
        puzzleTitle.textContent = "Tower Run Complete";
        puzzleMeta.textContent = `${TEAM_NAMES[state.teamId]} • Mission complete`;
        puzzleBody.textContent = "Every level from the basement through Floor 11 is secure. Await further instructions or reset to replay.";
        setPuzzleFeedback("");
        scanButton.disabled = true;
        scanButton.textContent = "Scan QR Code";
        toggleAnswerForm(false);
        setPuzzleLockState("hidden");
        return;
      }

      const revealed = Boolean(state.revealed[nextIndex]);
      const stepNumber = getStepNumber(nextIndex) ?? 0;

      if (revealed) {
        const puzzle = puzzles[nextIndex];
        const fallbackDestination = stepNumber ? `Puzzle ${stepNumber}` : `Puzzle ${nextIndex + 1}`;
        const destination = puzzle?.floor ?? fallbackDestination;
        puzzleTitle.textContent = destination;
        puzzleMeta.textContent = `${TEAM_NAMES[state.teamId]} • Step ${stepNumber} of ${PUZZLE_COUNT}`;
        puzzleBody.textContent = "Travel to this location and scan the onsite QR code to unlock the puzzle.";
        setPuzzleFeedback("");
        scanButton.disabled = false;
        scanButton.textContent = "Scan Location QR";
        setPuzzleLockState("locked", {
          message: `Locked • Scan ${destination}`,
          actionLabel: scanButton.textContent,
          actionDisabled: scanButton.disabled
        });
      } else {
        puzzleTitle.textContent = "Mission Locked";
        puzzleMeta.textContent = `${TEAM_NAMES[state.teamId]} • Step ${stepNumber} of ${PUZZLE_COUNT}`;
        puzzleBody.textContent = "Solve the current puzzle to discover your next destination.";
        setPuzzleFeedback("Use a GM override code here if you need to switch teams.");
        scanButton.disabled = false;
        scanButton.textContent = "Scan QR Code";
        setPuzzleLockState("hidden");
      }

      toggleAnswerForm(false);
    }

    function toggleAnswerForm(shouldShow) {
      if (!answerForm) return;

      if (shouldShow) {
        answerForm.classList.remove("is-hidden");
        if (answerInput) {
          answerInput.disabled = false;
        }
        if (answerSubmitButton) {
          answerSubmitButton.disabled = false;
        }
      } else {
        answerForm.classList.add("is-hidden");
        if (answerInput) {
          answerInput.value = "";
          answerInput.disabled = true;
        }
        if (answerSubmitButton) {
          answerSubmitButton.disabled = true;
        }
      }
    }

    function toggleWaitingAnimation(shouldShow) {
      if (!waitingAurora) return;

      if (shouldShow) {
        waitingAurora.setAttribute("aria-hidden", "false");
        waitingAurora.classList.add("is-active");
      } else {
        waitingAurora.classList.remove("is-active");
        waitingAurora.setAttribute("aria-hidden", "true");
      }
    }

    function triggerConfetti({ theme = "general", pieces = 120, spread = 12 } = {}) {
      if (prefersReducedMotion || typeof document === "undefined" || !document.body) {
        return;
      }

      const colors = CONFETTI_THEMES[theme] ?? CONFETTI_THEMES.general;
      const layer = document.createElement("div");
      layer.className = "confetti-layer";

      const baseDuration = 2400;

      for (let index = 0; index < pieces; index += 1) {
        const piece = document.createElement("span");
        piece.className = "confetti-piece";
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.setProperty("--confetti-color", colors[index % colors.length]);
        piece.style.setProperty("--confetti-travel", `${(Math.random() * 2 - 1) * spread}vw`);
        piece.style.setProperty("--confetti-duration", `${baseDuration + Math.random() * 900}ms`);
        piece.style.animationDelay = `${Math.random() * 180}ms`;
        piece.style.transform = `rotate(${Math.random() * 360}deg)`;
        layer.append(piece);
      }

      document.body.append(layer);

      window.setTimeout(() => {
        layer.remove();
      }, baseDuration + 1400);
    }

    function triggerFloorTransition({ fromIndex = null, toIndex = null } = {}) {
      if (!floorTransition || prefersReducedMotion) {
        return;
      }

      const sanitizedToIndex = Number.isInteger(toIndex) ? clampNumber(toIndex, 0, PUZZLE_COUNT - 1) : null;
      const sanitizedFromIndex = Number.isInteger(fromIndex) ? clampNumber(fromIndex, 0, PUZZLE_COUNT - 1) : null;

      if (!Number.isInteger(sanitizedToIndex)) {
        hideFloorTransition();
        return;
      }

      clearFloorTransitionStageTimers();
      if (floorTransitionTimeoutId) {
        clearTimeout(floorTransitionTimeoutId);
        floorTransitionTimeoutId = null;
      }

      const direction = determineFloorDirection(sanitizedFromIndex, sanitizedToIndex);
      const currentLabel = resolveFloorLabel(sanitizedFromIndex);
      const nextLabel = resolveFloorLabel(sanitizedToIndex);
      const callout = buildFloorCallout(sanitizedToIndex);

      const mapDetails = renderFloorTransitionMapContent({ fromIndex: sanitizedFromIndex, toIndex: sanitizedToIndex }) ?? {};
      const currentLevel = mapDetails.currentEl ?? null;
      const targetLevel = mapDetails.targetEl ?? null;

      floorTransition.dataset.direction = direction;
      if (floorTransitionCurrent) {
        floorTransitionCurrent.textContent = currentLabel;
      }
      if (floorTransitionNext) {
        floorTransitionNext.textContent = nextLabel;
      }

      if (floorTransitionLabel) {
        floorTransitionLabel.textContent = sanitizedToIndex === 0
          ? "GET TO THE BASEMENT FOR THE FINAL PUZZLE!!"
          : `GO TO FLOOR: ${callout}`;
      }

      floorTransition.classList.add("is-active");
      floorTransition.removeAttribute("hidden");
      floorTransition.setAttribute("aria-hidden", "false");
      setFloorTransitionStage(null);
      setFloorTransitionStage("is-stage-hold");

      if (floorTransitionMap) {
        floorTransitionMap.style.setProperty("--floor-shift-current", "0px");
        floorTransitionMap.style.setProperty("--floor-shift-target", "0px");
      }

      requestAnimationFrame(() => {
        if (!floorTransition || !floorTransition.classList.contains("is-active")) {
          return;
        }

        const containerRect = floorTransitionMap?.getBoundingClientRect() ?? null;
        const currentShiftRaw = calculateFloorCenterShift({
          containerRect,
          element: currentLevel
        });
        const targetShiftRaw = calculateFloorCenterShift({
          containerRect,
          element: targetLevel
        });

        const resolvedCurrentShift = Number.isFinite(currentShiftRaw)
          ? currentShiftRaw
          : Number.isFinite(targetShiftRaw)
          ? targetShiftRaw
          : 0;
        const resolvedTargetShift = Number.isFinite(targetShiftRaw)
          ? targetShiftRaw
          : resolvedCurrentShift;

        const currentPx = `${resolvedCurrentShift.toFixed(2)}px`;
        const targetPx = `${resolvedTargetShift.toFixed(2)}px`;

        if (floorTransitionMap) {
          floorTransitionMap.style.setProperty("--floor-shift-current", currentPx);
          floorTransitionMap.style.setProperty("--floor-shift-target", targetPx);
        }

        if (!floorTransition || !floorTransition.classList.contains("is-active")) {
          return;
        }

        FLOOR_TRANSITION_STAGE_TIMELINE.forEach(({ stage, delay }) => {
          scheduleFloorTransitionStage(stage, delay);
        });
      });

      floorTransitionTimeoutId = window.setTimeout(() => {
        hideFloorTransition();
      }, FLOOR_TRANSITION_TOTAL_DURATION + 400);
    }

    function hideFloorTransition() {
      if (!floorTransition) {
        return;
      }

      clearFloorTransitionStageTimers();

      if (floorTransitionTimeoutId) {
        clearTimeout(floorTransitionTimeoutId);
        floorTransitionTimeoutId = null;
      }
      const finalizeHide = () => {
        setFloorTransitionStage(null);

        floorTransition.classList.remove("is-active", "is-closing");
        floorTransition.setAttribute("hidden", "true");
        floorTransition.setAttribute("aria-hidden", "true");
        floorTransition.dataset.direction = "";

        if (floorTransitionCurrent) {
          floorTransitionCurrent.textContent = "";
        }
        if (floorTransitionNext) {
          floorTransitionNext.textContent = "";
        }
        if (floorTransitionLabel) {
          floorTransitionLabel.textContent = "";
        }

        if (floorTransitionMap) {
          floorTransitionMap.style.removeProperty("--floor-shift");
          floorTransitionMap.style.removeProperty("--floor-shift-current");
          floorTransitionMap.style.removeProperty("--floor-shift-target");
          floorTransitionMap.replaceChildren();
        }
      };

      if (floorTransition.classList.contains("is-active")) {
        floorTransition.classList.add("is-closing");
        window.setTimeout(finalizeHide, 340);
      } else {
        finalizeHide();
      }
    }

    function resolveFloorLabel(index) {
      if (!Number.isInteger(index)) {
        return "CONTROL ROOM";
      }
      if (index === 0) {
        return "BASEMENT";
      }
      const label = puzzles[index]?.floor ?? `Floor ${index}`;
      return label.toUpperCase();
    }

    function buildFloorCallout(index) {
      if (!Number.isInteger(index)) {
        return "CONTROL ROOM";
      }
      if (index === 0) {
        return "BASEMENT";
      }
      const label = puzzles[index]?.floor ?? `Floor ${index}`;
      const match = label.match(/floor\s*(\d+)/i);
      if (match) {
        return match[1];
      }
      return label.toUpperCase();
    }

    function scheduleFloorTransitionStage(stage, delay) {
      const timerId = window.setTimeout(() => {
        setFloorTransitionStage(stage);
      }, delay);
      floorTransitionStageTimers.push(timerId);
    }

    function setFloorTransitionStage(stage) {
      if (!floorTransition) {
        return;
      }
      FLOOR_TRANSITION_STAGE_CLASSES.forEach(className => {
        floorTransition.classList.remove(className);
      });
      if (stage) {
        floorTransition.classList.add(stage);
      }
    }

    function clearFloorTransitionStageTimers() {
      while (floorTransitionStageTimers.length > 0) {
        const timerId = floorTransitionStageTimers.pop();
        if (timerId) {
          clearTimeout(timerId);
        }
      }
    }

    function renderFloorTransitionMapContent({ fromIndex, toIndex }) {
      if (!floorTransitionMap) {
        return null;
      }

      const sanitizedFrom = Number.isInteger(fromIndex) ? clampNumber(fromIndex, 0, PUZZLE_COUNT - 1) : null;
      const sanitizedTo = Number.isInteger(toIndex) ? clampNumber(toIndex, 0, PUZZLE_COUNT - 1) : null;

      floorTransitionMap.replaceChildren();

      let sourceElement = null;
      if (towerLevels) {
        sourceElement = towerLevels.cloneNode(true);
        sourceElement.removeAttribute("id");
      } else {
        sourceElement = buildFallbackTransitionLevels();
      }

      let mapWrapper = null;
      if (sourceElement.classList.contains("tower-map")) {
        mapWrapper = sourceElement;
      } else {
        mapWrapper = document.createElement("div");
        mapWrapper.className = "tower-map";
        mapWrapper.append(sourceElement);
      }

      const levelsRoot = mapWrapper.querySelector(".tower-map-levels") ?? mapWrapper;
      levelsRoot.querySelectorAll(".tower-map-level").forEach(level => {
        level.classList.remove("is-just-unlocked", "is-current-floor", "is-target-floor");
      });

      let currentEl = Number.isInteger(sanitizedFrom)
        ? levelsRoot.querySelector(`[data-floor-index="${sanitizedFrom}"]`)
        : null;
      const targetEl = Number.isInteger(sanitizedTo)
        ? levelsRoot.querySelector(`[data-floor-index="${sanitizedTo}"]`)
        : null;

      if (currentEl) {
        currentEl.classList.add("is-current-floor");
      }

      if (targetEl) {
        targetEl.classList.add("is-target-floor");
      }

      if (!currentEl && targetEl) {
        targetEl.classList.add("is-current-floor");
        currentEl = targetEl;
      }

      floorTransitionMap.append(mapWrapper);

      return {
        currentEl,
        targetEl
      };
    }

    function buildFallbackTransitionLevels() {
      const levels = document.createElement("div");
      levels.className = "tower-map-levels";

      for (let index = puzzles.length - 1; index >= 0; index -= 1) {
        const level = document.createElement("div");
        level.className = "tower-map-level";
        level.dataset.floorIndex = String(index);

        const entry = document.createElement("div");
        entry.className = "tower-map-entry";

        const lock = createTowerLockIcon();

        const label = document.createElement("div");
        label.className = "tower-map-label";
        label.textContent = puzzles[index]?.floor ?? `Floor ${index}`;

        entry.append(lock, label);

        const status = document.createElement("div");
        status.className = "tower-map-status";
        status.textContent = "";

        level.append(entry, status);
        levels.append(level);

        if (index === 1) {
          const ground = document.createElement("div");
          ground.className = "tower-ground-line";
          levels.append(ground);
        }
      }

      return levels;
    }

    function calculateFloorCenterShift({ containerRect, element }) {
      if (!containerRect || !element) {
        return NaN;
      }

      const elementRect = element.getBoundingClientRect();
      const elementCenter = elementRect.top + elementRect.height / 2;
      const containerCenter = containerRect.top + containerRect.height / 2;
      return containerCenter - elementCenter;
    }

    function determineFloorDirection(fromIndex, toIndex) {
      if (!Number.isInteger(toIndex)) {
        return "up";
      }
      if (!Number.isInteger(fromIndex)) {
        return toIndex === 0 ? "down" : "up";
      }
      if (toIndex === fromIndex) {
        return "up";
      }
      return toIndex > fromIndex ? "up" : "down";
    }

    function setPuzzleFeedback(message, tone) {
      if (!puzzleFeedback) return;
      puzzleFeedback.className = "answer-feedback";
      if (tone === "success") {
        puzzleFeedback.classList.add("success");
      } else if (tone === "error") {
        puzzleFeedback.classList.add("error");
      }
      puzzleFeedback.textContent = message;
    }

    function queueNextScanFrame() {
      if (scannerModal.hidden) {
        return;
      }

      if (scanSession.rafId) {
        cancelAnimationFrame(scanSession.rafId);
        scanSession.rafId = null;
      }

      if (scanSession.detector) {
        scanSession.rafId = requestAnimationFrame(scanLoop);
      } else if (scanSession.useJsQr) {
        scanSession.rafId = requestAnimationFrame(scanLoopJsQr);
      }
    }

    function openScanner(intent) {
      scanSession.intent = intent ?? null;
      scannerModal.hidden = false;
      finalizeValidation();
      if (manualCodeInput) {
        manualCodeInput.value = "";
        manualCodeInput.disabled = false;
      }
      if (submitCodeButton) {
        submitCodeButton.disabled = false;
      }
      updateScannerInstruction(intent);
      configureScannerUi(intent);
      const initialStatus = intent?.mode === "gmOverride" ? "Preparing GM override scanner…" : "Initializing camera…";
      updateScanStatus(initialStatus);
      startScannerStream();
    }

    function updateScannerInstruction(intent) {
      if (!scannerInstruction) {
        return;
      }

      let message = "Align the QR code inside the frame.";

      if (!intent) {
        scannerInstruction.textContent = message;
        return;
      }

      switch (intent.mode) {
        case "start":
          message = "Scan the starting QR code provided by the game master.";
          break;
        case "location":
          message = "Scan the QR code posted at this mission location.";
          break;
        case "locked":
          message = "Scan an override code from the game master or return after unlocking the next mission.";
          break;
        case "complete":
          message = "The hunt is complete, but you can still scan a GM override if needed.";
          break;
        case "gmOverride":
          message = "GM Override active. Scan the team's override badge to manage progress.";
          break;
        default:
          break;
      }

      scannerInstruction.textContent = message;
    }

    function configureScannerUi(intent) {
      const mode = intent?.mode ?? "puzzle";
      if (scannerTitle) {
        scannerTitle.textContent = mode === "gmOverride" ? "GM Override Scanner" : "Scan Mission QR";
      }
      if (scannerShell) {
        scannerShell.classList.toggle("is-gm-override", mode === "gmOverride");
      }
      if (manualCodeInput) {
        const placeholder = mode === "gmOverride" ? "Enter GM override code" : "Enter code manually";
        manualCodeInput.placeholder = placeholder;
        manualCodeInput.setAttribute("aria-label", mode === "gmOverride" ? "GM override code" : "Manual code entry");
      }
      if (submitCodeButton) {
        submitCodeButton.textContent = mode === "gmOverride" ? "Submit Override" : "Submit Code";
      }
    }

    async function startScannerStream() {
      stopScannerStream();

      if (!hasMediaDevices) {
        updateScanStatus("Camera unavailable. Enter the code manually.", "error");
        showStatus("Camera unavailable on this device. Use manual code entry instead.", "error");
        manualCodeInput?.focus({ preventScroll: true });
        if (typeof manualCodeInput?.select === "function") {
          manualCodeInput.select();
        }
        return;
      }

      const mode = scanSession.intent?.mode ?? null;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        scanSession.stream = stream;
        scannerVideo.srcObject = stream;
        await scannerVideo.play();

        if (window.BarcodeDetector) {
          scanSession.detector = new window.BarcodeDetector({ formats: ["qr_code"] });
          scanSession.rafId = requestAnimationFrame(scanLoop);
          updateScanStatus(mode === "gmOverride" ? "Scanning… Align the GM badge inside the frame." : "Scanning… Align the QR inside the frame.");
        } else {
          updateScanStatus(mode === "gmOverride" ? "Loading override scanner fallback…" : "Preparing fallback scanner…");
          const jsQrReady = await loadJsQrLibrary();
          if (jsQrReady) {
            startJsQrLoop();
            updateScanStatus(mode === "gmOverride" ? "Scanning… Align the GM badge inside the frame." : "Scanning… Align the QR inside the frame.");
          } else {
            updateScanStatus("QR detector unavailable. Enter the code manually.", "error");
          }
        }
      } catch (err) {
        console.error("Unable to start camera", err);
        updateScanStatus(mode === "gmOverride" ? "Camera access denied. Enter the override code manually." : "Camera access denied. Enter the code manually.", "error");
        showStatus("Camera access denied. Enter the QR code manually.", "error");
        manualCodeInput?.focus({ preventScroll: true });
        if (typeof manualCodeInput?.select === "function") {
          manualCodeInput.select();
        }
      }
    }

    async function scanLoop() {
      if (!scanSession.detector || scannerVideo.readyState !== 4) {
        scanSession.rafId = requestAnimationFrame(scanLoop);
        return;
      }

      try {
        const barcodes = await scanSession.detector.detect(scannerVideo);
        if (barcodes.length > 0) {
          const value = barcodes[0].rawValue;
          handleScanResult(value);
          return;
        }
      } catch (err) {
        console.error("Barcode detection failed", err);
      }

      scanSession.rafId = requestAnimationFrame(scanLoop);
    }

    async function loadJsQrLibrary() {
      if (typeof window.jsQR === "function") {
        return true;
      }
      if (jsQrLoadPromise) {
        return jsQrLoadPromise;
      }

      jsQrLoadPromise = new Promise(resolve => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js";
        script.async = true;
        script.crossOrigin = "anonymous";
        script.onload = () => resolve(typeof window.jsQR === "function");
        script.onerror = () => resolve(false);
        document.head.appendChild(script);
      });

      const ready = await jsQrLoadPromise;
      if (!ready) {
        jsQrLoadPromise = null;
      }
      return ready;
    }

    function startJsQrLoop() {
      scanSession.detector = null;
      scanSession.useJsQr = true;

      if (!scanSession.canvas) {
        scanSession.canvas = document.createElement("canvas");
        scanSession.canvasContext =
          scanSession.canvas.getContext("2d", { willReadFrequently: true }) ||
          scanSession.canvas.getContext("2d");
      }

      if (!scanSession.canvasContext) {
        console.warn("Unable to initialise fallback QR canvas context");
        scanSession.useJsQr = false;
        return;
      }

      scanSession.rafId = requestAnimationFrame(scanLoopJsQr);
    }

    function scanLoopJsQr() {
      if (!scanSession.useJsQr) {
        return;
      }

      if (scannerVideo.readyState !== 4) {
        scanSession.rafId = requestAnimationFrame(scanLoopJsQr);
        return;
      }

      const videoWidth = scannerVideo.videoWidth || scannerVideo.clientWidth;
      const videoHeight = scannerVideo.videoHeight || scannerVideo.clientHeight;

      if (!videoWidth || !videoHeight) {
        scanSession.rafId = requestAnimationFrame(scanLoopJsQr);
        return;
      }

      const maxDimension = 480;
      const scale = Math.min(1, maxDimension / Math.max(videoWidth, videoHeight));
      const drawWidth = Math.max(1, Math.floor(videoWidth * scale));
      const drawHeight = Math.max(1, Math.floor(videoHeight * scale));

      if (scanSession.canvas.width !== drawWidth || scanSession.canvas.height !== drawHeight) {
        scanSession.canvas.width = drawWidth;
        scanSession.canvas.height = drawHeight;
      }

      scanSession.canvasContext.drawImage(scannerVideo, 0, 0, drawWidth, drawHeight);

      try {
        const imageData = scanSession.canvasContext.getImageData(0, 0, drawWidth, drawHeight);
        const detector = window.jsQR;
        if (typeof detector === "function") {
          const result = detector(imageData.data, drawWidth, drawHeight, { inversionAttempts: "dontInvert" });
          if (result?.data) {
            handleScanResult(result.data);
            return;
          }
        }
      } catch (err) {
        console.error("Fallback QR scan failed", err);
      }

      scanSession.rafId = requestAnimationFrame(scanLoopJsQr);
    }

    function handleScanResult(rawValue) {
      if (scanSession.isProcessing) {
        return;
      }

      const normalizedValue = normalizeCode(rawValue);

      if (!normalizedValue) {
        updateScanStatus("Unrecognized code. Try again.", "error");
        queueNextScanFrame();
        return;
      }

      scanSession.isProcessing = true;
      pauseScanLoop();
      setScannerBusy(true);
      updateScanStatus("Validating code…", "validating");

      if (scanSession.validationTimer) {
        clearTimeout(scanSession.validationTimer);
        scanSession.validationTimer = null;
      }

      scanSession.validationTimer = window.setTimeout(() => {
        processValidatedCode(normalizedValue, rawValue);
      }, VALIDATION_DELAY_MS);
    }

    function processValidatedCode(normalizedValue, rawValue) {
      scanSession.validationTimer = null;
      let handled = false;

      const intentMode = scanSession.intent?.mode ?? null;

      if (Object.prototype.hasOwnProperty.call(GM_TEAM_CODES, normalizedValue)) {
        handled = handleGmOverrideCode(GM_TEAM_CODES[normalizedValue], rawValue);
      } else if (Object.prototype.hasOwnProperty.call(START_CODES, normalizedValue)) {
        if (intentMode === "gmOverride") {
          updateScanStatus("Leave GM Override mode before scanning start badges.", "error");
        } else {
          handled = handleStartCode(START_CODES[normalizedValue], rawValue);
        }
      } else if (Object.prototype.hasOwnProperty.call(PUZZLE_CODE_LOOKUP, normalizedValue)) {
        if (intentMode === "gmOverride") {
          updateScanStatus("GM Override mode only accepts override badges.", "error");
        } else {
          handled = handleLocationScan(PUZZLE_CODE_LOOKUP[normalizedValue]);
        }
      } else {
        updateScanStatus("Code not recognized for this hunt. Check with the game master.", "error");
      }

      if (!handled) {
        finalizeValidation({ resume: true });
      }
    }

    function finalizeValidation({ resume = false } = {}) {
      if (scanSession.validationTimer) {
        clearTimeout(scanSession.validationTimer);
        scanSession.validationTimer = null;
      }
      scanSession.isProcessing = false;
      setScannerBusy(false);

      if (resume) {
        queueNextScanFrame();
      }
    }

    function setScannerBusy(isBusy) {
      if (isBusy) {
        scannerShell?.classList.add("is-validating");
      } else {
        scannerShell?.classList.remove("is-validating");
      }

      if (submitCodeButton) {
        submitCodeButton.disabled = Boolean(isBusy);
      }
      if (manualCodeInput) {
        manualCodeInput.disabled = Boolean(isBusy);
      }
    }

    function pauseScanLoop() {
      if (scanSession.rafId) {
        cancelAnimationFrame(scanSession.rafId);
        scanSession.rafId = null;
      }
    }

    function handleStartCode(teamId, rawValue) {
      if (!Number.isInteger(teamId)) {
        updateScanStatus("Start code not recognized.", "error");
        return false;
      }

      const sanitizedTeam = clampNumber(teamId, 0, TEAM_COUNT - 1);
      const existingTeam = Number.isInteger(state.teamId) ? state.teamId : null;
      if (existingTeam !== null && existingTeam !== sanitizedTeam) {
        const lockedName = TEAM_NAMES[existingTeam] ?? `Team ${existingTeam + 1}`;
        updateScanStatus(`This device is bound to ${lockedName}. Use GM Override to change teams.`, "error");
        return false;
      }

      const result = assignTeamRun(sanitizedTeam, { sourceLabel: "Start", rawValue });
      return Boolean(result);
    }

    function handleGmOverrideCode(teamId, rawValue) {
      if (!Number.isInteger(teamId)) {
        updateScanStatus("Override code not recognized.", "error");
        return false;
      }

      const sanitizedTeam = clampNumber(teamId, 0, TEAM_COUNT - 1);
      gmOverrideSession.teamId = sanitizedTeam;
      gmOverrideSession.sourceCode = rawValue;

      const teamName = TEAM_NAMES[sanitizedTeam] ?? `Team ${sanitizedTeam + 1}`;

      const performReset = () => {
        const applied = applyGmOverrideState({ teamId: sanitizedTeam, mode: "reset" });
        if (!applied) {
          showStatus(`Unable to reset ${teamName}. Try a different option.`, "error");
        }
      };

      if (isWinView) {
        closeScanner(`Override badge accepted for ${teamName}.`, "success");
        performReset();
        hideAnswerOverlay({ immediate: true });
        return true;
      }

      scanSession.intent = { mode: "gmOverride" };
      closeScanner(`Override badge accepted for ${teamName}.`, "success");
      openGmOverrideOverlay(sanitizedTeam);
      return true;
    }

    function handleLocationScan(puzzleIndex) {
      if (!state.hasStarted || !Number.isInteger(state.teamId)) {
        updateScanStatus("Scan your starting code before visiting floors.", "error");
        return false;
      }

      if (!Number.isInteger(puzzleIndex) || puzzleIndex < 0 || puzzleIndex >= PUZZLE_COUNT) {
        updateScanStatus("That QR code isn't part of this hunt.", "error");
        return false;
      }

      const floorName = puzzles[puzzleIndex]?.floor ?? "This mission";

      if (state.completions[puzzleIndex]) {
        updateScanStatus(`${floorName} is already solved.`, "success");
        return false;
      }

      if (state.unlocked[puzzleIndex]) {
        updateScanStatus(`${floorName} is already unlocked. Submit the answer to continue.`, "success");
        return false;
      }

      const currentSolving = getCurrentSolvingIndex();
      if (currentSolving !== null && currentSolving !== puzzleIndex) {
        const activeName = puzzles[currentSolving]?.floor ?? "your current mission";
        updateScanStatus(`Finish ${activeName} before scanning another mission.`, "error");
        return false;
      }

      const nextIndex = getNextDestinationIndex();
      if (nextIndex !== puzzleIndex) {
        updateScanStatus(`${floorName} isn't unlocked yet for your team.`, "error");
        return false;
      }

      if (!state.revealed[puzzleIndex]) {
        updateScanStatus("That mission is still hidden. Solve the clue you already unlocked.", "error");
        return false;
      }

      state.unlocked[puzzleIndex] = true;
      state.revealed[puzzleIndex] = true;
      unlockAnimationQueue.add(puzzleIndex);
      pendingPuzzleUnlockIndex = puzzleIndex;
      saveState();
      render();

      closeScanner(`Location confirmed: ${floorName}.`, "success");
      showStatus(`${floorName} puzzle unlocked.`, "success");
      triggerConfetti({ theme: "unlock", pieces: 95, spread: 8 });

      window.setTimeout(() => {
        if (answerInput && !answerInput.disabled) {
          answerInput.focus({ preventScroll: true });
        }
      }, 200);

      return true;
    }

    function assignTeamRun(teamId, { sourceLabel = "Team", force = false } = {}) {
      const sanitizedTeam = clampNumber(teamId, 0, TEAM_COUNT - 1);
      const existingTeam = Number.isInteger(state.teamId) ? state.teamId : null;
      const hadProgress = state.hasStarted && hasRecordedProgress();
      const sameTeamWithoutProgress = state.hasStarted && existingTeam === sanitizedTeam && !hadProgress;

      if (!force && existingTeam !== null && existingTeam !== sanitizedTeam) {
        const lockedName = TEAM_NAMES[existingTeam] ?? `Team ${existingTeam + 1}`;
        updateScanStatus(`This device is bound to ${lockedName}. Use GM Override to change teams.`, "error");
        return false;
      }

      if (sameTeamWithoutProgress) {
        updateScanStatus(`Already assigned to ${TEAM_NAMES[sanitizedTeam]}.`, "success");
        return false;
      }

      state = defaultState(sanitizedTeam);
      state.hasStarted = true;
      revealNextDestination();
      pendingPuzzleUnlockIndex = null;
      saveState();
      render();

      const nextIndex = getNextDestinationIndex();
      const firstFloor = nextIndex !== null ? puzzles[nextIndex].floor : null;
      const progressNote = hadProgress ? " Previous progress cleared." : "";
      const teamName = TEAM_NAMES[sanitizedTeam];
      const statusMessage = `${teamName} mission queue ready.${firstFloor ? ` Head to ${firstFloor}.` : ""}${progressNote}`.trim();

      closeScanner(`${sourceLabel} code accepted for ${teamName}.`, "success");

      if (sourceLabel === "Start" && startGameOverlay) {
        pendingTeamStart = {
          teamName,
          statusMessage,
          nextIndex,
          hadProgress,
          fromIndex: 0,
          firstFloor
        };
        openStartOverlay({ teamName, firstFloor, hadProgress });
      } else {
        pendingTeamStart = null;
        finalizeTeamAssignment({
          statusMessage,
          nextIndex,
          hadProgress,
          fromIndex: null
        });
      }

      return true;
    }

    function finalizeTeamAssignment({ statusMessage, nextIndex, hadProgress, fromIndex }) {
      if (Number.isInteger(nextIndex)) {
        triggerFloorTransition({ fromIndex, toIndex: nextIndex });
      }
      showStatus(statusMessage, "success");
      triggerConfetti({ theme: "start", pieces: hadProgress ? 140 : 110, spread: 10 });
    }

    function hasRecordedProgress() {
      return state.unlocked.some(Boolean) || state.completions.some(Boolean);
    }

    function revealNextDestination() {
      const nextIndex = getNextDestinationIndex();
      if (nextIndex === null) {
        return null;
      }
      state.revealed[nextIndex] = true;
      return nextIndex;
    }

    async function submitPuzzleAnswer() {
      if (!answerInput || answerInput.disabled) {
        setPuzzleFeedback("Unlock a puzzle before submitting an answer.", "error");
        return;
      }

      const solvingIndex = getCurrentSolvingIndex();
      if (solvingIndex === null) {
        setPuzzleFeedback("Unlock a puzzle before submitting an answer.", "error");
        return;
      }

      const guess = answerInput.value.trim();
      if (!guess) {
        setPuzzleFeedback("Enter an answer before submitting.", "error");
        answerInput.focus();
        return;
      }

      const puzzle = puzzles[solvingIndex];
      const normalizedGuess = normalizeAnswer(guess);
      const expectedAnswer = normalizeAnswer(puzzle.answer ?? "");

      if (expectedAnswer && normalizedGuess !== expectedAnswer) {
        await runAnswerOverlay({ status: "incorrect", floorName: puzzle.floor });
        setPuzzleFeedback("That answer isn't correct yet. Keep trying.", "error");
        answerInput.select();
        return;
      }

      await runAnswerOverlay({ status: "correct", floorName: puzzle.floor });

      answerInput.value = "";
      state.unlocked[solvingIndex] = true;
      state.completions[solvingIndex] = true;
      const nextIndex = revealNextDestination();
      state.hasWon = nextIndex === null;
      saveState();
      render();

      if (nextIndex !== null) {
        triggerFloorTransition({ fromIndex: solvingIndex, toIndex: nextIndex });
      }

      const parts = [`${puzzle.floor} solved!`];
      if (nextIndex !== null) {
        parts.push(`Next mission revealed: ${puzzles[nextIndex].floor}.`);
      } else {
        parts.push("All missions complete!");
      }

      const summary = parts.join(" ");
      setPuzzleFeedback(summary, "success");
      showStatus(summary, "success");
      if (nextIndex === null) {
        triggerConfetti({ theme: "finale", pieces: 180, spread: 16 });
        window.setTimeout(() => {
          try {
            window.location.replace("/win.html");
          } catch (err) {
            // ignore navigation errors
          }
        }, 200);
      } else {
        triggerConfetti({ theme: "solve", pieces: 130, spread: 10 });
      }
    }


    function closeScanner(message, tone) {
      if (message) {
        updateScanStatus(message, tone);
      }
      finalizeValidation();
      stopScannerStream();
      scannerModal.hidden = true;
    }

    function stopScannerStream() {
      pauseScanLoop();
      if (scanSession.stream) {
        scanSession.stream.getTracks().forEach(track => track.stop());
        scanSession.stream = null;
      }
      if (scannerVideo.srcObject) {
        scannerVideo.srcObject = null;
      }
      if (scanSession.validationTimer) {
        clearTimeout(scanSession.validationTimer);
        scanSession.validationTimer = null;
      }
      scanSession.isProcessing = false;
      setScannerBusy(false);
      scanSession.detector = null;
      scanSession.useJsQr = false;
      scanSession.intent = null;
    }

    function updateScanStatus(message, tone) {
      if (!scanStatus) return;
      scanStatus.textContent = message;
      scanStatus.className = "scan-status";
      if (tone === "success") {
        scanStatus.classList.add("success");
      } else if (tone === "error") {
        scanStatus.classList.add("error");
      } else if (tone === "validating") {
        scanStatus.classList.add("validating");
      }
    }

    function normalizeCode(value) {
      return value.trim().toUpperCase().replace(/[^A-Z0-9-]/g, "");
    }

    function normalizeAnswer(value) {
      return value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    }

    function showStatus(message, tone = "info") {
      if (!statusMessage) return;
      statusMessage.className = "status-message";
      if (tone === "success") {
        statusMessage.classList.add("success");
      } else if (tone === "error") {
        statusMessage.classList.add("error");
      }
      statusMessage.textContent = message;
      statusMessage.classList.add("visible");

      if (statusTimeoutId) {
        clearTimeout(statusTimeoutId);
      }
      statusTimeoutId = window.setTimeout(() => {
        statusMessage.className = "status-message";
        statusMessage.textContent = "";
        statusTimeoutId = null;
      }, 4500);
    }

    function fallbackCopyPrompt(code) {
      const promptMessage = "Progress code ready. Press Ctrl+C (Cmd+C on Mac) to copy:";
      const response = window.prompt(promptMessage, code);
      if (response !== null) {
        showStatus("Progress code ready to share.", "success");
      } else {
        showStatus("Copy cancelled.");
      }
    }

    function createShareCode(currentState) {
      return encodeStatePayload(currentState);
    }

    function exportProgress() {
      const shareCode = createShareCode(state);
      if (!shareCode) {
        showStatus("Unable to generate a progress code right now.", "error");
        return;
      }
      if (navigator.clipboard?.writeText) {
        navigator.clipboard
          .writeText(shareCode)
          .then(() => showStatus("Copied progress code to clipboard.", "success"))
          .catch(() => {
            fallbackCopyPrompt(shareCode);
          });
        return;
      }

      fallbackCopyPrompt(shareCode);
    }

    function parseProgressInput(rawInput) {
      const trimmed = rawInput.trim();
      if (!trimmed) {
        throw new Error("No data supplied");
      }

      const cookiePattern = new RegExp(`${COOKIE_NAME}=([^;\s]+)`);
      const cookieMatch = trimmed.match(cookiePattern);
      const encoded = cookieMatch ? cookieMatch[1] : trimmed;

      const decodedCandidate = safeDecodeURIComponent(encoded);
      const decoded = decodeStatePayload(decodedCandidate) ?? decodeStatePayload(encoded);
      if (decoded) {
        return decoded;
      }

      throw new Error("Unable to parse progress input");
    }

    function importProgress() {
      const input = window.prompt("Paste a progress code or cookie value to import:");
      if (input === null) {
        showStatus("Import cancelled.");
        return;
      }

      if (!input.trim()) {
        showStatus("Nothing to import. Paste a code and try again.", "error");
        return;
      }

      try {
        const parsed = parseProgressInput(input);
        state = sanitizeState(parsed);
        pendingPuzzleUnlockIndex = null;
        saveState();
        render();
        showStatus("Progress imported successfully.", "success");
      } catch (err) {
        console.error("Import failed", err);
        showStatus("Import failed. Check the code and try again.", "error");
      }
    }
