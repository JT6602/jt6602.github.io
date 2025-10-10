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

    const ANSWER_TYPES = Object.freeze({
      TEXT: "text",
      PUZZLE: "puzzle"
    });

    const puzzles = [
      {
        floor: "Basement",
        prompt: "Solve the multi-step cipher with its logic twist; progression triggers automatically once cracked.",
        answerType: ANSWER_TYPES.PUZZLE,
        cipherChallenge: {
          title: "Cipher Relay",
          intro: "Solve each layer in order. Earlier solutions unlock the later logic check.",
          steps: [
            {
              id: "cipher-caesar",
              type: "input",
              label: "Step 1 — Caesar Shift",
              prompt: "Shift each letter backward by 1 to decode BTDFOE.",
              solution: "ASCEND",
              placeholder: "Decoded word",
              hint: "Reverse a +1 rotation."
            },
            {
              id: "cipher-atbash",
              type: "input",
              label: "Step 2 — Atbash Mirror",
              prompt: "Mirror the alphabet (A↔Z, B↔Y, ...) to decode OVEVO.",
              solution: "LEVEL",
              placeholder: "Decoded word",
              hint: "Flip the alphabet end-to-end."
            },
            {
              id: "cipher-logic",
              type: "choice",
              label: "Step 3 — Logic Link",
              prompt: "Only one of these statements is true about your decoded words. Which one?",
              choices: [
                {
                  id: "choice-a",
                  label: "They share more than one letter."
                },
                {
                  id: "choice-b",
                  label: "Step 1 answer comes alphabetically before Step 2 answer."
                },
                {
                  id: "choice-c",
                  label: "Both answers are palindromes."
                }
              ],
              correctChoiceId: "choice-b",
              successMessage: "Logic checks out." 
            }
          ],
          completionMessage: "Cipher relay complete."
        },
        qr: QR_CODES.BASEMENT
      },
      {
        floor: "Floor 1",
        prompt: "Unscramble RACTE.",
        answerType: ANSWER_TYPES.TEXT,
        answer: "trace",
        qr: QR_CODES.FLOOR_1
      },
      {
        floor: "Floor 2",
        prompt:
          "I have keys but no locks, I have space but no room, you can enter but not go outside. What am I?",
        answerType: ANSWER_TYPES.TEXT,
        answer: "keyboard",
        qr: QR_CODES.FLOOR_2
      },
      {
        floor: "Floor 3",
        prompt: "Decode mfwfm with a Caesar shift of -1.",
        answerType: ANSWER_TYPES.TEXT,
        answer: "level",
        qr: QR_CODES.FLOOR_3
      },
      {
        floor: "Floor 4",
        prompt: "Find the words panel, lever, cable, gauge, and wires hidden in the grid to progress.",
        answerType: ANSWER_TYPES.PUZZLE,
        wordSearch: {
          size: 8,
          words: ["panel", "lever", "cable", "gauge", "wires"],
          grid: [
            "P A N E L S X L",
            "G Q T H M A N E",
            "A R I O P L D V",
            "U C A B L E T E",
            "G S Y R K F H R",
            "E L C N O P T A",
            "B U W I R E S G",
            "J M Q D Z H V C"
          ]
        },
        qr: QR_CODES.FLOOR_4
      },
      {
        floor: "Floor 5",
        prompt:
          "You see a 3×3 grid of switches (ON/OFF). Toggling a switch flips itself and its orthogonal neighbors. Goal: turn all switches OFF. Start in a random mixed state.",
        answerType: ANSWER_TYPES.PUZZLE,
        switchPuzzle: {
          gridSize: 3
        },
        qr: QR_CODES.FLOOR_5
      },
      {
        floor: "Floor 6",
        prompt: "Locate the words console, monitor, switch, circuit, relay, sensor, and module hidden in the grid to progress.",
        answerType: ANSWER_TYPES.PUZZLE,
        wordSearch: {
          size: 8,
          words: ["console", "monitor", "switch", "circuit", "relay", "sensor"],
          grid: [
            "C O N S O L E P M T",
            "A H Q Z V R B L O M",
            "D S W I T C H A N O",
            "F U L Q X S P H I D",
            "T E C I R C U I T U",
            "K R E L A Y G B O L",
            "J N P C F H Q E R E",
            "L T A S E N S O R W",
            "P V D G L T M C A H",
            "Q X J B K D V R Y S"
          ]
        },
        qr: QR_CODES.FLOOR_6
      },
      {
        floor: "Floor 7",
        prompt: "What is 7 × 8?",
        answerType: ANSWER_TYPES.TEXT,
        answer: "56",
        qr: QR_CODES.FLOOR_7
      },
      {
        floor: "Floor 8",
        prompt: "Decode the Morse code .-. .. -.. -.. .-.. .",
        answerType: ANSWER_TYPES.TEXT,
        answer: "riddle",
        qr: QR_CODES.FLOOR_8
      },
      {
        floor: "Floor 9",
        prompt: "Trace the keypad path forming an L shape to advance.",
        answerType: ANSWER_TYPES.PUZZLE,
        keypadPath: {
          gridSize: 3,
          correctPath: [1, 4, 7, 8, 9],
          hints: [
            "Begin at the top-left key.",
            "You must move vertically first, then horizontally."
          ]
        },
        qr: QR_CODES.FLOOR_9
      },
      {
        floor: "Floor 10",
        prompt: "Match card pairs until the hidden word is revealed to progress.",
        answerType: ANSWER_TYPES.PUZZLE,
        memoryGame: {
          finalWord: "BEACON",
          pairs: [
            { id: "letter-b", face: "B" },
            { id: "letter-e", face: "E" },
            { id: "letter-a", face: "A" },
            { id: "letter-c", face: "C" },
            { id: "letter-o", face: "O" },
            { id: "letter-n", face: "N" }
          ]
        },
        qr: QR_CODES.FLOOR_10
      },
      {
        floor: "Floor 11",
        prompt: "Replace each letter with the one before it in the alphabet: uijt.",
        answerType: ANSWER_TYPES.TEXT,
        answer: "this",
        qr: QR_CODES.FLOOR_11
      }
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
    const teamStartTimeLabel = document.getElementById("teamStartTime");
    const teamTimerLabel = document.getElementById("teamTimer");
    const towerLevels = document.getElementById("towerLevels");
    const towerMapOverlay = document.getElementById("towerMapOverlay");
    const towerMapOverlayClose = document.getElementById("towerMapOverlayClose");
    const viewTowerMapButton = document.getElementById("viewTowerMap");
    const showOtherProgressButton = document.getElementById("showOtherProgress");
    const teamProgressOverlay = document.getElementById("teamProgressOverlay");
    const teamProgressOverlayClose = document.getElementById("teamProgressOverlayClose");
    const teamProgressContent = document.getElementById("teamProgressContent");
    const teamProgressStatus = document.getElementById("teamProgressStatus");
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
    const startGameCard = document.getElementById("startGameCard");
    const startGameShout = document.getElementById("startGameShout");
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
      hasWon: false,
      puzzleState: {},
      startTimestamp: null
    });

    const DASHBOARD_SYNC_DEBOUNCE_MS = 600;
    const DEFAULT_PROGRESS_PATHS = ["progress", "sync", "report"];
    const DEFAULT_STATE_PATH = "state";
    let dashboardOverrides = resolveDashboardOverrides();
    let dashboardConfig = createDashboardConfig(resolveDashboardBase(), dashboardOverrides);
    let dashboardSyncTimer = null;
    let dashboardPendingReason = "state-change";
    let dashboardLastSignature = null;
    let dashboardOverridePayload = null;
    let dashboardRetryCount = 0;

    function ensurePuzzleStateContainer() {
      if (!state.puzzleState || typeof state.puzzleState !== "object") {
        state.puzzleState = {};
      }
      return state.puzzleState;
    }

    function getPuzzleInteractiveState(puzzleIndex) {
      if (!Number.isInteger(puzzleIndex)) {
        return null;
      }
      const container = state.puzzleState;
      if (!container || typeof container !== "object") {
        return null;
      }
      return container[puzzleIndex] ?? null;
    }

    function setPuzzleInteractiveState(puzzleIndex, value, { save = true } = {}) {
      if (!Number.isInteger(puzzleIndex) || !value || typeof value !== "object") {
        return;
      }
      const container = ensurePuzzleStateContainer();
      container[puzzleIndex] = value;
      if (save) {
        saveState();
      }
    }

    function clearPuzzleInteractiveState(puzzleIndex, { save = true } = {}) {
      if (!Number.isInteger(puzzleIndex)) {
        return;
      }
      const container = state.puzzleState;
      if (!container || typeof container !== "object") {
        return;
      }
      if (!Object.prototype.hasOwnProperty.call(container, puzzleIndex)) {
        return;
      }
      delete container[puzzleIndex];
      if (Object.keys(container).length === 0) {
        state.puzzleState = {};
      }
      if (save) {
        saveState();
      }
    }

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
    let startLaunchActive = false;
    let startLaunchFallbackId = null;
    let startLaunchAnimationHandler = null;
    let answerOverlayTimers = [];
    let scannerListenersBound = false;
    let teamTimerIntervalId = null;
    let teamTimerStartDate = null;
    let teamTimerIsoString = null;
    let teamProgressOverlayEscapeBound = false;
    let teamProgressAbortController = null;
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
    configureTeamProgressButton();
    render();
    maybePromptForWin();
    scheduleDashboardSync("init");
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

      ensureScannerListeners();
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

    function openTeamProgressOverlay() {
      if (!teamProgressOverlay) {
        return;
      }

      if (!dashboardConfig?.stateEndpoint) {
        setTeamProgressStatus("Dashboard connection not configured.", "error");
      } else {
        setTeamProgressStatus("Loading team progress…", "info");
        loadTeamProgressSnapshot();
      }

      teamProgressOverlay.classList.add("is-visible");
      teamProgressOverlay.removeAttribute("hidden");
      document.body.classList.add("is-team-progress-open");
      teamProgressOverlayClose?.focus({ preventScroll: true });

      if (!teamProgressOverlayEscapeBound) {
        window.addEventListener("keydown", handleTeamProgressOverlayKeydown, { passive: true });
        teamProgressOverlayEscapeBound = true;
      }
    }

    function closeTeamProgressOverlay() {
      if (!teamProgressOverlay) {
        return;
      }

      if (teamProgressAbortController) {
        try {
          teamProgressAbortController.abort();
        } catch (err) {
          // ignore abort errors
        }
        teamProgressAbortController = null;
      }

      teamProgressOverlay.classList.remove("is-visible");
      teamProgressOverlay.setAttribute("hidden", "true");
      document.body.classList.remove("is-team-progress-open");
      showOtherProgressButton?.focus({ preventScroll: true });

      if (teamProgressOverlayEscapeBound) {
        window.removeEventListener("keydown", handleTeamProgressOverlayKeydown);
        teamProgressOverlayEscapeBound = false;
      }
    }

    function handleTeamProgressOverlayKeydown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeTeamProgressOverlay();
      }
    }

    async function loadTeamProgressSnapshot() {
      if (!dashboardConfig?.stateEndpoint || !teamProgressContent) {
        return;
      }

      teamProgressContent.innerHTML = "";

      if (teamProgressAbortController) {
        try {
          teamProgressAbortController.abort();
        } catch (err) {
          // ignore
        }
      }

      try {
        teamProgressAbortController = typeof AbortController === "function" ? new AbortController() : null;
        const response = await fetch(dashboardConfig.stateEndpoint, {
          method: "GET",
          mode: "cors",
          credentials: "omit",
          cache: "no-store",
          signal: teamProgressAbortController?.signal
        });

        if (!response.ok) {
          throw new Error(`Team progress request failed with ${response.status}`);
        }

        const payload = await response.json();
        renderTeamProgressOverlay(payload);
      } catch (err) {
        if (err && typeof err === "object" && err.name === "AbortError") {
          return;
        }
        console.warn("Failed to load team progress", err);
        setTeamProgressStatus("Unable to load team progress. Try again soon.", "error");
      } finally {
        teamProgressAbortController = null;
      }
    }

    function renderTeamProgressOverlay(scoreboard) {
      if (!teamProgressContent) {
        return;
      }

      teamProgressContent.innerHTML = "";

      const teams = scoreboard && typeof scoreboard === "object" && scoreboard.teams
        ? Object.values(scoreboard.teams)
        : [];

      if (!Array.isArray(teams) || !teams.length) {
        setTeamProgressStatus("No teams have reported progress yet.", "neutral");
        return;
      }

      const puzzleCount = Number.isFinite(scoreboard.puzzleCount) ? scoreboard.puzzleCount : PUZZLE_COUNT;
      const myTeamId = Number.isInteger(state.teamId) ? state.teamId : null;

      const otherTeams = teams
        .map(entry => normalizeTeamProgressEntry(entry, puzzleCount))
        .filter(Boolean)
        .filter(entry => entry.hasStarted && entry.teamId !== myTeamId);

      const visibleTeams = otherTeams.length
        ? otherTeams
        : teams
            .map(entry => normalizeTeamProgressEntry(entry, puzzleCount))
            .filter(Boolean)
            .filter(entry => entry.hasStarted);

      if (!visibleTeams.length) {
        setTeamProgressStatus("No active teams to display yet.", "neutral");
        return;
      }

      visibleTeams.sort((a, b) => {
        const solvedDiff = b.solved - a.solved;
        if (solvedDiff !== 0) return solvedDiff;
        const winDiff = Number(b.hasWon) - Number(a.hasWon);
        if (winDiff !== 0) return winDiff;
        const runtimeDiff = (a.runtimeSeconds ?? Infinity) - (b.runtimeSeconds ?? Infinity);
        if (Number.isFinite(runtimeDiff) && runtimeDiff !== 0) return runtimeDiff;
        const updatedDiff = (Date.parse(b.updatedAt ?? "") || 0) - (Date.parse(a.updatedAt ?? "") || 0);
        if (updatedDiff !== 0) return updatedDiff;
        return a.teamId - b.teamId;
      });

      const fragment = document.createDocumentFragment();

      visibleTeams.forEach(team => {
        const card = document.createElement("article");
        card.className = "team-progress-card";

        const heading = document.createElement("header");
        heading.className = "team-progress-card__header";

        const title = document.createElement("h3");
        title.textContent = team.teamName;
        heading.append(title);

        const meta = document.createElement("div");
        meta.className = "team-progress-card__meta";
        const progressLabel = `${team.solved} / ${team.puzzleCount} solved`;
        const runtimeLabel = Number.isFinite(team.runtimeSeconds)
          ? `Runtime ${formatElapsedDuration(team.runtimeSeconds * 1000)}`
          : null;
        const statusLabel = team.hasWon ? "Tower complete" : team.currentLabel;
        const metaParts = [progressLabel];
        if (runtimeLabel) metaParts.push(runtimeLabel);
        if (statusLabel) metaParts.push(statusLabel);
        meta.textContent = metaParts.join(" · ");
        heading.append(meta);

        const body = document.createElement("div");
        body.className = "team-progress-card__body";

        const progressRail = document.createElement("div");
        progressRail.className = "team-progress-rail";
        const progressBar = document.createElement("div");
        progressBar.className = "team-progress-bar";
        progressBar.style.width = `${team.progressPercent}%`;
        progressRail.append(progressBar);

        const status = document.createElement("div");
        status.className = "team-progress-status-line";
        status.textContent = team.statusMessage;

        body.append(progressRail, status);

        if (team.updatedAtLabel) {
          const footer = document.createElement("footer");
          footer.className = "team-progress-card__footer";
          footer.textContent = `Updated ${team.updatedAtLabel}`;
          body.append(footer);
        }

        card.append(heading, body);
        fragment.append(card);
      });

      teamProgressContent.append(fragment);

      const updatedAtLabel = formatAbsoluteTimestamp(scoreboard.updatedAt);
      setTeamProgressStatus(updatedAtLabel ? `Last sync ${updatedAtLabel}` : "Team progress snapshot", "success");
    }

    function normalizeTeamProgressEntry(entry, puzzleCount) {
      if (!entry || typeof entry !== "object") {
        return null;
      }

      const teamId = Number.isFinite(entry.teamId) ? entry.teamId : null;
      if (teamId === null) {
        return null;
      }

      const teamName = typeof entry.teamName === "string" && entry.teamName.trim()
        ? entry.teamName.trim()
        : `Team ${teamId + 1}`;

      const solved = Number.isFinite(entry.solved) ? entry.solved : 0;
      const sanitizedPuzzleCount = Number.isFinite(entry.puzzleCount) ? entry.puzzleCount : puzzleCount;
      const progressPercent = sanitizedPuzzleCount > 0
        ? Math.round(Math.min(100, Math.max(0, (solved / sanitizedPuzzleCount) * 100)))
        : 0;
      const hasStarted = Boolean(entry.hasStarted);
      const hasWon = Boolean(entry.hasWon) || solved >= sanitizedPuzzleCount;
      const currentIndex = Number.isInteger(entry.currentPuzzleIndex) ? entry.currentPuzzleIndex : null;
      const nextIndex = Number.isInteger(entry.nextPuzzleIndex) ? entry.nextPuzzleIndex : null;
      const runtimeSeconds = Number.isFinite(entry.runtimeSeconds) ? Math.max(0, Math.floor(entry.runtimeSeconds)) : null;
      const updatedAt = typeof entry.updatedAt === "string" ? entry.updatedAt : null;
      const lastEvent = typeof entry.lastEvent === "string" && entry.lastEvent.trim() ? entry.lastEvent.trim() : "";

      const currentLabel = currentIndex !== null ? puzzles[currentIndex]?.floor ?? `Mission ${currentIndex + 1}` : "Exploring";
      const nextLabel = nextIndex !== null ? puzzles[nextIndex]?.floor ?? `Mission ${nextIndex + 1}` : null;

      let statusMessage = hasWon
        ? "Tower cleared"
        : currentIndex !== null
        ? `Solving ${currentLabel}`
        : nextLabel
        ? `Traveling to ${nextLabel}`
        : "Launching the tower run";

      if (hasWon) {
        statusMessage = "Tower complete";
      }

      if (lastEvent) {
        statusMessage = `${statusMessage} · ${lastEvent}`;
      }

      const updatedAtLabel = updatedAt ? formatAbsoluteTimestamp(updatedAt) : "";

      return {
        teamId,
        teamName,
        solved,
        puzzleCount: sanitizedPuzzleCount,
        progressPercent,
        hasStarted,
        hasWon,
        currentLabel,
        statusMessage,
        runtimeSeconds,
        updatedAt,
        updatedAtLabel
      };
    }

    function setTeamProgressStatus(message, tone = "neutral") {
      if (!teamProgressStatus) {
        return;
      }
      const safeMessage = typeof message === "string" ? message : "";
      teamProgressStatus.textContent = safeMessage;
      teamProgressStatus.className = "team-progress-status";
      if (tone) {
        teamProgressStatus.classList.add(`is-${tone}`);
      }
    }

    function formatAbsoluteTimestamp(value) {
      if (!value || typeof value !== "string") {
        return "";
      }
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) {
        return "";
      }
      try {
        return date.toLocaleString();
      } catch (err) {
        return date.toISOString();
      }
    }

    function openStartOverlay({ teamName, firstFloor, hadProgress }) {
      if (!startGameOverlay) {
        beginPendingTeamStart();
        return;
      }

      resetStartOverlayAnimation();
      if (startGameShout) {
        startGameShout.textContent = "HERE WE GO!!!";
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

      resetStartOverlayAnimation();
    }

    function resetStartOverlayAnimation() {
      if (startLaunchFallbackId !== null) {
        window.clearTimeout(startLaunchFallbackId);
        startLaunchFallbackId = null;
      }

      if (startLaunchAnimationHandler && startGameCard) {
        startGameCard.removeEventListener("animationend", startLaunchAnimationHandler);
        startLaunchAnimationHandler = null;
      }

      startLaunchActive = false;

      startGameOverlay?.classList.remove("is-launching");
      startGameCard?.classList.remove("is-launching");

      if (startGameBegin) {
        startGameBegin.disabled = false;
      }
    }

    function handleStartOverlayKeydown(event) {
      if ((event.key === "Enter" || event.key === " ") && pendingTeamStart) {
        event.preventDefault();
        handleStartGameBegin(event);
      }
    }

    function handleStartGameBegin(event) {
      event?.preventDefault?.();

      if (!pendingTeamStart) {
        beginPendingTeamStart();
        return;
      }

      if (prefersReducedMotion || !startGameOverlay || !startGameCard) {
        beginPendingTeamStart();
        return;
      }

      if (startLaunchActive) {
        return;
      }

      startLaunchActive = true;

      if (startGameBegin) {
        startGameBegin.disabled = true;
      }

      startGameOverlay.classList.add("is-launching");
      startGameCard.classList.add("is-launching");

      if (startLaunchAnimationHandler && startGameCard) {
        startGameCard.removeEventListener("animationend", startLaunchAnimationHandler);
        startLaunchAnimationHandler = null;
      }

      if (startLaunchFallbackId !== null) {
        window.clearTimeout(startLaunchFallbackId);
        startLaunchFallbackId = null;
      }

      const finalizeLaunch = () => {
        if (!startLaunchActive) {
          return;
        }
        startLaunchActive = false;

        if (startLaunchAnimationHandler && startGameCard) {
          startGameCard.removeEventListener("animationend", startLaunchAnimationHandler);
          startLaunchAnimationHandler = null;
        }

        if (startLaunchFallbackId !== null) {
          window.clearTimeout(startLaunchFallbackId);
          startLaunchFallbackId = null;
        }

        beginPendingTeamStart();
      };

      startLaunchAnimationHandler = animationEvent => {
        if (animationEvent.target !== startGameCard || animationEvent.animationName !== "startLaunchSequence") {
          return;
        }
        finalizeLaunch();
      };

      startGameCard.addEventListener("animationend", startLaunchAnimationHandler);

      startLaunchFallbackId = window.setTimeout(() => {
        startLaunchFallbackId = null;
        finalizeLaunch();
      }, 1600);
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


    const WORD_SEARCH_DIRECTIONS = Object.freeze([
      { row: 1, col: 0 },
      { row: -1, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: -1 },
      { row: 1, col: 1 },
      { row: -1, col: -1 },
      { row: 1, col: -1 },
      { row: -1, col: 1 }
    ]);

    function shuffleArray(values) {
      const array = Array.isArray(values) ? values.slice() : [];
      for (let index = array.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        const temp = array[index];
        array[index] = array[swapIndex];
        array[swapIndex] = temp;
      }
      return array;
    }

    function randomLetter() {
      return String.fromCharCode(65 + Math.floor(Math.random() * 26));
    }

    function createWordSearchLayout(wordEntries, desiredSize) {
      const normalizedSize = clampNumber(Number(desiredSize) || 10, 3, 26);
      const normalizedEntries = Array.isArray(wordEntries) ? wordEntries.slice() : [];
      if (!normalizedEntries.length) {
        return { grid: [], placements: [] };
      }

      const coordinatePool = Array.from({ length: normalizedSize * normalizedSize }, (_, index) => ({
        row: Math.floor(index / normalizedSize),
        col: index % normalizedSize
      }));

      const maxAttempts = Math.max(18, normalizedEntries.length * 12);

      for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        const grid = Array.from({ length: normalizedSize }, () => Array(normalizedSize).fill(null));
        const placements = [];
        const entries = attempt === 0 ? normalizedEntries : shuffleArray(normalizedEntries);
        let failed = false;

        for (const entry of entries) {
          const letters = entry.word.split("");
          let placed = false;

          const directionOptions = shuffleArray(WORD_SEARCH_DIRECTIONS);
          for (const direction of directionOptions) {
            if (placed) {
              break;
            }

            const startPositions = shuffleArray(coordinatePool);
            for (const start of startPositions) {
              const path = [];
              let canPlace = true;

              for (let step = 0; step < letters.length; step += 1) {
                const targetRow = start.row + direction.row * step;
                const targetCol = start.col + direction.col * step;

                if (
                  targetRow < 0 ||
                  targetRow >= normalizedSize ||
                  targetCol < 0 ||
                  targetCol >= normalizedSize
                ) {
                  canPlace = false;
                  break;
                }

                const existing = grid[targetRow][targetCol];
                if (existing !== null && existing !== letters[step]) {
                  canPlace = false;
                  break;
                }

                path.push({ row: targetRow, col: targetCol });
              }

              if (canPlace) {
                path.forEach((position, index) => {
                  grid[position.row][position.col] = letters[index];
                });
                placements.push({ key: entry.key, word: entry.word, path });
                placed = true;
                break;
              }
            }
          }

          if (!placed) {
            failed = true;
            break;
          }
        }

        if (!failed) {
          for (let row = 0; row < normalizedSize; row += 1) {
            for (let col = 0; col < normalizedSize; col += 1) {
              if (grid[row][col] === null) {
                grid[row][col] = randomLetter();
              }
            }
          }

          return { grid, placements };
        }
      }

      throw new Error(`Unable to place all words after ${maxAttempts} attempts.`);
    }

    function findWordPlacementsFromGrid(grid, wordEntries) {
      if (!Array.isArray(grid) || !grid.length || !Array.isArray(wordEntries) || !wordEntries.length) {
        return null;
      }

      const rowCount = grid.length;
      const colCount = Array.isArray(grid[0]) ? grid[0].length : 0;
      if (!colCount) {
        return null;
      }

      const placements = [];

      wordEntries.forEach(entry => {
        const letters = entry.word.split("");
        let foundPath = null;

        for (let row = 0; row < rowCount && !foundPath; row += 1) {
          for (let col = 0; col < colCount && !foundPath; col += 1) {
            if (grid[row][col] !== letters[0]) {
              continue;
            }

            for (const direction of WORD_SEARCH_DIRECTIONS) {
              const path = [];
              let matches = true;

              for (let step = 0; step < letters.length; step += 1) {
                const targetRow = row + direction.row * step;
                const targetCol = col + direction.col * step;

                if (
                  targetRow < 0 ||
                  targetRow >= rowCount ||
                  targetCol < 0 ||
                  targetCol >= colCount ||
                  grid[targetRow][targetCol] !== letters[step]
                ) {
                  matches = false;
                  break;
                }

                path.push({ row: targetRow, col: targetCol });
              }

              if (matches) {
                foundPath = path;
                break;
              }
            }
          }
        }

        if (!foundPath) {
          placements.push(null);
        } else {
          placements.push({ key: entry.key, word: entry.word, path: foundPath });
        }
      });

      if (placements.some(placement => !placement)) {
        return null;
      }

      return placements;
    }

    function cloneWordSearchGrid(grid) {
      return Array.isArray(grid) ? grid.map(row => (Array.isArray(row) ? row.slice() : [])) : [];
    }

    function wordSearchGridsEqual(gridA, gridB) {
      if (!Array.isArray(gridA) || !Array.isArray(gridB) || gridA.length !== gridB.length) {
        return false;
      }
      for (let row = 0; row < gridA.length; row += 1) {
        const rowA = gridA[row];
        const rowB = gridB[row];
        if (!Array.isArray(rowA) || !Array.isArray(rowB) || rowA.length !== rowB.length) {
          return false;
        }
        for (let col = 0; col < rowA.length; col += 1) {
          const letterA = String(rowA[col] ?? "").toUpperCase();
          const letterB = String(rowB[col] ?? "").toUpperCase();
          if (letterA !== letterB) {
            return false;
          }
        }
      }
      return true;
    }

    function sanitizeWordSearchGrid(grid) {
      if (!Array.isArray(grid) || !grid.length) {
        return null;
      }

      const sanitized = [];
      let columnCount = null;

      for (const row of grid) {
        const letters = Array.isArray(row)
          ? row
          : typeof row === "string"
          ? row.trim().split(/\s+/)
          : null;

        if (!letters || !letters.length) {
          return null;
        }

        const sanitizedRow = letters.map(letter => String(letter ?? "").slice(0, 1).toUpperCase());
        if (sanitizedRow.length === 0) {
          return null;
        }

        if (columnCount === null) {
          columnCount = sanitizedRow.length;
        } else if (sanitizedRow.length !== columnCount) {
          return null;
        }

        sanitized.push(sanitizedRow);
      }

      return sanitized.length ? sanitized : null;
    }

    function renderWordSearchPuzzle(container, { puzzleIndex, wordSearch, prompt, onSolved }) {
      if (!container || !wordSearch) {
        return;
      }

      const normalizedIndex = Number.isInteger(puzzleIndex) ? clampNumber(puzzleIndex, 0, PUZZLE_COUNT - 1) : null;

      const words = Array.isArray(wordSearch.words)
        ? wordSearch.words
            .map((word, index) => {
              const trimmed = String(word ?? "").trim();
              if (!trimmed) {
                return null;
              }
              const normalized = trimmed.toUpperCase();
              return {
                key: `${normalized}-${index}`,
                word: normalized,
                display: normalized
              };
            })
            .filter(Boolean)
        : [];

      let generatedGrid;
      let placements = [];

      const storedInteractiveState = Number.isInteger(normalizedIndex) ? getPuzzleInteractiveState(normalizedIndex) : null;
      const storedWordSearchState = storedInteractiveState?.wordSearch ?? null;
      const storedFoundKeys = Array.isArray(storedWordSearchState?.foundKeys)
        ? storedWordSearchState.foundKeys.map(key => String(key ?? "").trim()).filter(Boolean)
        : [];

      if (!generatedGrid && Array.isArray(storedWordSearchState?.grid)) {
        const restoredGrid = sanitizeWordSearchGrid(storedWordSearchState.grid);
        if (restoredGrid) {
          generatedGrid = restoredGrid.map(row => row.slice());
          const restoredPlacements = findWordPlacementsFromGrid(generatedGrid, words);
          if (restoredPlacements) {
            placements = restoredPlacements;
          } else {
            generatedGrid = undefined;
            placements = [];
          }
        }
      }

      if (!generatedGrid && words.length) {
        try {
          const layout = createWordSearchLayout(words, wordSearch.size ?? 10);
          generatedGrid = layout.grid;
          placements = layout.placements;
        } catch (error) {
          console.error(error);
        }
      }

      if (!generatedGrid && Array.isArray(wordSearch.grid)) {
        const fallbackGrid = wordSearch.grid.map(row =>
          (Array.isArray(row) ? row : String(row ?? "").trim().split(/\s+/)).map(letter =>
            String(letter ?? "").slice(0, 1).toUpperCase()
          )
        );

        const fallbackPlacements = findWordPlacementsFromGrid(fallbackGrid, words);
        if (fallbackPlacements) {
          generatedGrid = fallbackGrid;
          placements = fallbackPlacements;
        }
      }

      if (placements.length === 0 && Array.isArray(generatedGrid)) {
        const derivedPlacements = findWordPlacementsFromGrid(generatedGrid, words);
        if (derivedPlacements) {
          placements = derivedPlacements;
        }
      }

      if (!Array.isArray(generatedGrid)) {
        container.innerHTML = "";
        const error = document.createElement("div");
        error.className = "word-search-error";
        error.textContent = "Word search failed to load. Please refresh or contact a game master.";
        container.append(error);
        return;
      }

      const validPlacementKeys = new Set(placements.map(entry => entry.key));
      const foundPlacements = new Set();
      storedFoundKeys.forEach(key => {
        if (validPlacementKeys.has(key)) {
          foundPlacements.add(key);
        }
      });

      const hadInvalidStoredKeys = foundPlacements.size !== storedFoundKeys.length;

      const shouldPersistInitialLayout =
        Number.isInteger(normalizedIndex) &&
        (!storedWordSearchState || !Array.isArray(storedWordSearchState.grid) ||
          !wordSearchGridsEqual(storedWordSearchState.grid, generatedGrid));

      container.innerHTML = "";

      const wrapper = document.createElement("div");
      wrapper.className = "word-search-wrapper";

      if (prompt) {
        const intro = document.createElement("p");
        intro.className = "word-search-prompt";
        intro.textContent = prompt;
        wrapper.append(intro);
      }

      const grid = document.createElement("div");
      grid.className = "word-search-grid";
      const cellMatrix = generatedGrid.map(() => []);

      generatedGrid.forEach((rowLetters, rowIndex) => {
        const rowEl = document.createElement("div");
        rowEl.className = "word-search-row";

        rowLetters.forEach((letter, colIndex) => {
          const cell = document.createElement("span");
          cell.className = "word-search-cell";
          const cellLetter = String(letter ?? "").slice(0, 1).toUpperCase();
          cell.textContent = cellLetter;
          cell.dataset.row = String(rowIndex);
          cell.dataset.col = String(colIndex);
          cell.dataset.letter = cellLetter;
          rowEl.append(cell);
          cellMatrix[rowIndex][colIndex] = cell;
        });

        grid.append(rowEl);
      });

      wrapper.append(grid);

      let wordList;
      const wordListItems = new Map();
      let puzzleCompleted = false;

      if (words.length) {
        wordList = document.createElement("div");
        wordList.className = "word-search-word-list";
        const heading = document.createElement("h4");
        heading.textContent = "Words to find";
        wordList.append(heading);
        const list = document.createElement("ul");
        words.forEach(entry => {
          const item = document.createElement("li");
          item.textContent = entry.display;
          item.dataset.wordKey = entry.key;
          wordListItems.set(entry.key, item);
          list.append(item);
        });
        wordList.append(list);
        wrapper.append(wordList);
      }

      container.append(wrapper);

      if (!words.length || !placements.length) {
        const notice = document.createElement("div");
        notice.className = "word-search-error";
        notice.textContent = !words.length
          ? "No words available for this puzzle."
          : "Word search data incomplete. Please refresh or contact a game master.";
        wrapper.append(notice);
        return;
      }

      function persistWordSearchState() {
        if (!Number.isInteger(normalizedIndex)) {
          return;
        }
        if (!Array.isArray(generatedGrid) || !generatedGrid.length) {
          return;
        }
        setPuzzleInteractiveState(normalizedIndex, {
          wordSearch: {
            grid: cloneWordSearchGrid(generatedGrid),
            foundKeys: Array.from(foundPlacements)
          }
        });
      }

      if (shouldPersistInitialLayout || hadInvalidStoredKeys) {
        persistWordSearchState();
      }

      const selectionState = {
        pointerId: null,
        direction: null,
        cells: [],
        start: null
      };

      if (foundPlacements.size) {
        foundPlacements.forEach(key => {
          const placement = placements.find(entry => entry.key === key);
          if (!placement) {
            return;
          }
          placement.path.forEach(position => {
            const cell = getCellFromCoordinates(position.row, position.col);
            if (cell) {
              cell.classList.add("is-found");
            }
          });
          const listItem = wordListItems.get(key);
          if (listItem) {
            listItem.classList.add("is-found");
          }
        });

        if (!puzzleCompleted && foundPlacements.size === placements.length && placements.length) {
          window.setTimeout(() => {
            try {
              maybeComplete();
            } catch (error) {
              console.error("Word search auto-complete failed", error);
            }
          }, 0);
        }
      }

      function resetSelectionClasses() {
        selectionState.cells.forEach(cell => {
          if (!cell.element.classList.contains("is-found")) {
            cell.element.classList.remove("is-selecting");
          }
        });
      }

      function clearSelectionState() {
        resetSelectionClasses();
        selectionState.pointerId = null;
        selectionState.direction = null;
        selectionState.cells = [];
        selectionState.start = null;
      }

      function getCellFromCoordinates(row, col) {
        if (row < 0 || col < 0) {
          return null;
        }
        return cellMatrix[row] ? cellMatrix[row][col] : null;
      }

      function setSelectionCells(cells) {
        resetSelectionClasses();
        selectionState.cells = cells;
        cells.forEach(cell => {
          if (!cell.element.classList.contains("is-found")) {
            cell.element.classList.add("is-selecting");
          }
        });
      }

      function startSelection(cell, pointerId) {
        const row = Number(cell.dataset.row);
        const col = Number(cell.dataset.col);
        selectionState.pointerId = pointerId;
        selectionState.direction = null;
        selectionState.start = { row, col };
        setSelectionCells([
          {
            row,
            col,
            element: cell
          }
        ]);
      }

      function updateSelection(cell) {
        if (!selectionState.start) {
          return;
        }

        const targetRow = Number(cell.dataset.row);
        const targetCol = Number(cell.dataset.col);
        const rowDelta = targetRow - selectionState.start.row;
        const colDelta = targetCol - selectionState.start.col;

        if (rowDelta === 0 && colDelta === 0) {
          return;
        }

        const stepRow = rowDelta === 0 ? 0 : rowDelta / Math.abs(rowDelta);
        const stepCol = colDelta === 0 ? 0 : colDelta / Math.abs(colDelta);

        if (stepRow !== 0 && stepCol !== 0 && Math.abs(rowDelta) !== Math.abs(colDelta)) {
          return;
        }

        const proposedDirection = { row: stepRow, col: stepCol };
        if (!selectionState.direction) {
          selectionState.direction = proposedDirection;
        }

        if (
          selectionState.direction.row !== proposedDirection.row ||
          selectionState.direction.col !== proposedDirection.col
        ) {
          return;
        }

        const steps = Math.max(Math.abs(rowDelta), Math.abs(colDelta));
        const cells = [];
        for (let step = 0; step <= steps; step += 1) {
          const row = selectionState.start.row + selectionState.direction.row * step;
          const col = selectionState.start.col + selectionState.direction.col * step;
          const targetCell = getCellFromCoordinates(row, col);
          if (!targetCell) {
            return;
          }
          cells.push({
            row,
            col,
            element: targetCell
          });
        }

        setSelectionCells(cells);
      }

      function findMatchingPlacement(cells) {
        const coordinates = cells.map(cell => ({ row: cell.row, col: cell.col }));
        return placements.find(placement => {
          if (foundPlacements.has(placement.key) || placement.path.length !== coordinates.length) {
            return false;
          }

          const directMatch = placement.path.every((position, index) => {
            const coordinate = coordinates[index];
            return coordinate.row === position.row && coordinate.col === position.col;
          });

          if (directMatch) {
            return true;
          }

          return placement.path.every((position, index) => {
            const coordinate = coordinates[coordinates.length - 1 - index];
            return coordinate.row === position.row && coordinate.col === position.col;
          });
        });
      }

      function markPlacementFound(placement, cells) {
        foundPlacements.add(placement.key);
        cells.forEach(cell => {
          cell.element.classList.remove("is-selecting");
          cell.element.classList.add("is-found");
        });

        const listItem = wordListItems.get(placement.key);
        if (listItem) {
          listItem.classList.add("is-found");
        }

        persistWordSearchState();
        maybeComplete();
      }

      function maybeComplete() {
        if (puzzleCompleted) {
          return;
        }

        if (foundPlacements.size < placements.length) {
          return;
        }

        puzzleCompleted = true;
        clearSelectionState();
        grid.classList.add("is-complete");

        if (typeof onSolved === "function") {
          try {
            const result = onSolved();
            if (result && typeof result.catch === "function") {
              result.catch(error => {
                console.error("Word search completion handler failed", error);
              });
            }
          } catch (error) {
            console.error("Word search completion handler failed", error);
          }
        }
      }

      function completeSelection() {
        if (!selectionState.cells.length) {
          clearSelectionState();
          return;
        }

        const placement = findMatchingPlacement(selectionState.cells);
        if (placement) {
          markPlacementFound(placement, selectionState.cells);
        }

        clearSelectionState();
      }

      function handlePointerDown(event) {
        if (puzzleCompleted) {
          return;
        }

        const cell = event.target.closest(".word-search-cell");
        if (!cell || !grid.contains(cell)) {
          return;
        }

        if (event.pointerType === "mouse" && event.button !== 0) {
          return;
        }

        event.preventDefault();
        if (typeof grid.setPointerCapture === "function") {
          grid.setPointerCapture(event.pointerId);
        }
        startSelection(cell, event.pointerId);
      }

      function handlePointerMove(event) {
        if (puzzleCompleted) {
          return;
        }

        if (selectionState.pointerId !== event.pointerId) {
          return;
        }

        event.preventDefault();
        const element = document.elementFromPoint(event.clientX, event.clientY);
        const cell = element ? element.closest(".word-search-cell") : null;

        if (cell && grid.contains(cell)) {
          updateSelection(cell);
        }
      }

      function handlePointerUp(event) {
        if (puzzleCompleted) {
          return;
        }

        if (selectionState.pointerId !== event.pointerId) {
          return;
        }

        event.preventDefault();
        if (
          typeof grid.releasePointerCapture === "function" &&
          grid.hasPointerCapture &&
          grid.hasPointerCapture(event.pointerId)
        ) {
          grid.releasePointerCapture(event.pointerId);
        }
        const element = document.elementFromPoint(event.clientX, event.clientY);
        const cell = element ? element.closest(".word-search-cell") : null;
        if (cell && grid.contains(cell)) {
          updateSelection(cell);
        }
        completeSelection();
      }

      function handlePointerCancel(event) {
        if (puzzleCompleted) {
          return;
        }

        if (selectionState.pointerId !== event.pointerId) {
          return;
        }
        if (
          typeof grid.releasePointerCapture === "function" &&
          grid.hasPointerCapture &&
          grid.hasPointerCapture(event.pointerId)
        ) {
          grid.releasePointerCapture(event.pointerId);
        }
        clearSelectionState();
      }

      grid.addEventListener("pointerdown", handlePointerDown);
      grid.addEventListener("pointermove", handlePointerMove);
      grid.addEventListener("pointerup", handlePointerUp);
      grid.addEventListener("pointercancel", handlePointerCancel);
      grid.addEventListener("pointerleave", event => {
        if (selectionState.pointerId !== event.pointerId) {
          return;
        }

        if (grid.hasPointerCapture && grid.hasPointerCapture(event.pointerId)) {
          handlePointerUp(event);
        } else {
          clearSelectionState();
        }
      });
    }

    function renderCipherChallenge(container, { puzzleIndex, cipherChallenge, prompt, onSolved }) {
      if (!container || !cipherChallenge || !Array.isArray(cipherChallenge.steps)) {
        return;
      }

      const rawSteps = Array.isArray(cipherChallenge.steps) ? cipherChallenge.steps : [];
      const steps = rawSteps
        .map((entry, index) => {
          if (!entry || typeof entry !== "object") {
            return null;
          }

          const id = String(entry.id ?? `step-${index + 1}`).trim();
          if (!id) {
            return null;
          }

          const type = entry.type === "choice" ? "choice" : "input";
          const step = {
            id,
            type,
            label: String(entry.label ?? `Step ${index + 1}`),
            prompt: String(entry.prompt ?? ""),
            hint: String(entry.hint ?? ""),
            successMessage: String(entry.successMessage ?? "Correct."),
            placeholder: String(entry.placeholder ?? "")
          };

          if (type === "input") {
            const solution = String(entry.solution ?? "").trim();
            if (!solution) {
              return null;
            }
            step.solution = solution;
          } else {
            const rawChoices = Array.isArray(entry.choices) ? entry.choices : [];
            const choices = rawChoices
              .map((choice, choiceIndex) => {
                if (!choice || typeof choice !== "object") {
                  return null;
                }
                const choiceId = String(choice.id ?? `${id}-choice-${choiceIndex + 1}`).trim();
                const label = String(choice.label ?? ``).trim();
                if (!choiceId || !label) {
                  return null;
                }
                return { id: choiceId, label };
              })
              .filter(Boolean);

            if (!choices.length) {
              return null;
            }

            const correctChoiceId = String(entry.correctChoiceId ?? choices[0].id).trim();
            const matchingChoice = choices.find(choice => choice.id === correctChoiceId);
            step.choices = choices;
            step.correctChoiceId = matchingChoice ? correctChoiceId : choices[0].id;
          }

          return step;
        })
        .filter(Boolean);

      if (!steps.length) {
        container.textContent = "Cipher challenge unavailable.";
        return;
      }

      const normalizedIndex = Number.isInteger(puzzleIndex) ? clampNumber(puzzleIndex, 0, PUZZLE_COUNT - 1) : null;
      const storedInteractiveState = Number.isInteger(normalizedIndex) ? getPuzzleInteractiveState(normalizedIndex) : null;
      const storedCipherState = storedInteractiveState?.cipherChallenge ?? null;

      const stepIdSet = new Set(steps.map(step => step.id));

      const storedCompleted = Array.isArray(storedCipherState?.completedStepIds)
        ? storedCipherState.completedStepIds
            .map(id => String(id ?? "").trim())
            .filter(id => stepIdSet.has(id))
        : [];
      const completedStepIds = new Set(storedCompleted);

      const storedInputs = storedCipherState?.inputs && typeof storedCipherState.inputs === "object"
        ? storedCipherState.inputs
        : {};
      const inputs = {};
      stepIdSet.forEach(stepId => {
        const value = storedInputs[stepId];
        if (typeof value === "string" && value) {
          inputs[stepId] = value;
        }
      });

      const storedChoices = storedCipherState?.selectedChoices && typeof storedCipherState.selectedChoices === "object"
        ? storedCipherState.selectedChoices
        : {};
      const selectedChoices = {};
      stepIdSet.forEach(stepId => {
        const value = storedChoices[stepId];
        if (typeof value === "string" && value) {
          selectedChoices[stepId] = value;
        }
      });

      let puzzleCompleted = completedStepIds.size === steps.length;

      container.innerHTML = "";

      const wrapper = document.createElement("div");
      wrapper.className = "cipher-challenge-wrapper";

      if (cipherChallenge.title) {
        const heading = document.createElement("h3");
        heading.className = "cipher-challenge-title";
        heading.textContent = cipherChallenge.title;
        wrapper.append(heading);
      }

      const descriptionBlock = document.createElement("div");
      descriptionBlock.className = "cipher-challenge-description";

      if (prompt) {
        const promptEl = document.createElement("p");
        promptEl.textContent = prompt;
        descriptionBlock.append(promptEl);
      }

      if (cipherChallenge.intro) {
        const introEl = document.createElement("p");
        introEl.textContent = cipherChallenge.intro;
        descriptionBlock.append(introEl);
      }

      if (descriptionBlock.children.length) {
        wrapper.append(descriptionBlock);
      }

      const progressEl = document.createElement("p");
      progressEl.className = "cipher-challenge-progress";
      wrapper.append(progressEl);

      const stepsContainer = document.createElement("div");
      stepsContainer.className = "cipher-challenge-steps";
      wrapper.append(stepsContainer);

      const completionMessage = document.createElement("p");
      completionMessage.className = "cipher-challenge-complete-message";
      wrapper.append(completionMessage);

      container.append(wrapper);

      const stepContexts = [];

      function persistState() {
        if (!Number.isInteger(normalizedIndex)) {
          return;
        }

        const payload = {
          completedStepIds: Array.from(completedStepIds),
          inputs: { ...inputs },
          selectedChoices: { ...selectedChoices }
        };

        setPuzzleInteractiveState(normalizedIndex, { cipherChallenge: payload });
      }

      function setStepStatus(context, message, tone = "info") {
        if (!context?.statusEl) {
          return;
        }
        context.statusEl.textContent = message ?? "";
        context.statusEl.className = "cipher-challenge-status";
        if (tone === "success") {
          context.statusEl.classList.add("is-success");
        } else if (tone === "error") {
          context.statusEl.classList.add("is-error");
        }
      }

      function updateProgress() {
        const solved = completedStepIds.size;
        const total = steps.length;
        progressEl.textContent = `Progress: ${solved} of ${total} steps solved.`;
      }

      function isStepUnlocked(stepIndex) {
        if (completedStepIds.has(steps[stepIndex].id)) {
          return true;
        }
        if (stepIndex === 0) {
          return true;
        }
        for (let i = 0; i < stepIndex; i += 1) {
          if (!completedStepIds.has(steps[i].id)) {
            return false;
          }
        }
        return true;
      }

      function maybeComplete() {
        if (puzzleCompleted || completedStepIds.size < steps.length) {
          return;
        }

        puzzleCompleted = true;

        if (cipherChallenge.completionMessage) {
          completionMessage.textContent = cipherChallenge.completionMessage;
          completionMessage.classList.add("is-visible");
        }

        if (typeof onSolved === "function") {
          try {
            const result = onSolved();
            if (result && typeof result.catch === "function") {
              result.catch(error => console.error("Cipher challenge completion handler failed", error));
            }
          } catch (error) {
            console.error("Cipher challenge completion handler failed", error);
          }
        }
      }

      function refreshStepStates() {
        stepContexts.forEach((context, index) => {
          if (!context) {
            return;
          }

          const step = steps[index];
          const isComplete = completedStepIds.has(step.id);
          const unlocked = isStepUnlocked(index);

          context.element.classList.toggle("is-complete", isComplete);
          context.element.classList.toggle("is-locked", !unlocked);

          if (context.input) {
            if (isComplete) {
              context.input.value = step.solution ?? context.input.value;
            }
            context.input.disabled = isComplete || !unlocked;
          }

          if (context.submitButton) {
            context.submitButton.disabled = isComplete || !unlocked;
          }

          if (context.choiceButtons) {
            context.choiceButtons.forEach(button => {
              button.disabled = isComplete || !unlocked;
              const choiceId = button.dataset.choiceId;
              button.classList.toggle("is-selected", selectedChoices[step.id] === choiceId);
              button.classList.toggle("is-correct", isComplete && choiceId === step.correctChoiceId);
            });
          }

          if (isComplete && !context.completedShown) {
            setStepStatus(context, context.step.successMessage ?? "Correct.", "success");
            context.completedShown = true;
          }
        });

        updateProgress();

        if (puzzleCompleted) {
          stepsContainer.classList.add("is-complete");
        }
      }

      steps.forEach((step, index) => {
        const stepEl = document.createElement("section");
        stepEl.className = "cipher-challenge-step";
        stepEl.dataset.stepId = step.id;

        const heading = document.createElement("header");
        heading.className = "cipher-challenge-step-header";

        const label = document.createElement("h4");
        label.textContent = step.label;
        heading.append(label);

        if (step.prompt) {
          const promptEl = document.createElement("p");
          promptEl.className = "cipher-challenge-step-prompt";
          promptEl.textContent = step.prompt;
          heading.append(promptEl);
        }

        stepEl.append(heading);

        const body = document.createElement("div");
        body.className = "cipher-challenge-step-body";
        stepEl.append(body);

        const statusEl = document.createElement("p");
        statusEl.className = "cipher-challenge-status";
        body.append(statusEl);

        const context = {
          step,
          element: stepEl,
          statusEl,
          completedShown: completedStepIds.has(step.id)
        };

        if (step.type === "input") {
          const form = document.createElement("form");
          form.className = "cipher-challenge-form";

          const input = document.createElement("input");
          input.type = "text";
          input.autocomplete = "off";
          input.spellcheck = false;
          input.placeholder = step.placeholder || "Enter answer";
          input.value = inputs[step.id] ?? (completedStepIds.has(step.id) ? step.solution : "");

          const submit = document.createElement("button");
          submit.type = "submit";
          submit.textContent = "Check";

          form.append(input, submit);
          body.insertBefore(form, statusEl);

          if (step.hint) {
            const hint = document.createElement("p");
            hint.className = "cipher-challenge-hint";
            hint.textContent = step.hint;
            body.insertBefore(hint, form);
          }

          form.addEventListener("submit", event => {
            event.preventDefault();
            if (puzzleCompleted || completedStepIds.has(step.id) || !isStepUnlocked(index)) {
              return;
            }

            const guess = input.value.trim();
            if (!guess) {
              setStepStatus(context, "Enter an answer before submitting.", "error");
              input.focus();
              return;
            }

            if (normalizeAnswer(guess) !== normalizeAnswer(step.solution)) {
              setStepStatus(context, "Not quite. Try again.", "error");
              input.select();
              return;
            }

            input.value = step.solution;
            completedStepIds.add(step.id);
            inputs[step.id] = step.solution;
            setStepStatus(context, step.successMessage ?? "Correct.", "success");
            persistState();
            refreshStepStates();
            maybeComplete();
          });

          context.form = form;
          context.input = input;
          context.submitButton = submit;
        } else if (step.type === "choice") {
          const choicesList = document.createElement("div");
          choicesList.className = "cipher-challenge-choices";
          const buttons = [];

          step.choices.forEach(choice => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "cipher-challenge-choice";
            button.dataset.choiceId = choice.id;
            button.textContent = choice.label;

            button.addEventListener("click", () => {
              if (puzzleCompleted || completedStepIds.has(step.id) || !isStepUnlocked(index)) {
                return;
              }

              selectedChoices[step.id] = choice.id;
              persistState();

              if (choice.id === step.correctChoiceId) {
                completedStepIds.add(step.id);
                setStepStatus(context, step.successMessage ?? "Correct.", "success");
                refreshStepStates();
                maybeComplete();
              } else {
                setStepStatus(context, "That's not the true statement.", "error");
                refreshStepStates();
              }
            });

            buttons.push(button);
            choicesList.append(button);
          });

          body.insertBefore(choicesList, statusEl);
          context.choiceButtons = buttons;
        }

        stepsContainer.append(stepEl);
        stepContexts[index] = context;
      });

      refreshStepStates();
      if (puzzleCompleted) {
        completionMessage.textContent = cipherChallenge.completionMessage ?? "Cipher relay complete.";
        completionMessage.classList.add("is-visible");
      }
    }

    function renderSpotDifferencePuzzle(container, { puzzleIndex, spotDifference, prompt, onSolved }) {
      if (!container || !spotDifference) {
        return;
      }

      const scenes = Array.isArray(spotDifference.scenes)
        ? spotDifference.scenes
            .map((scene, index) => {
              if (!scene || typeof scene !== "object") {
                return null;
              }
              const id = String(scene.id ?? `scene-${index + 1}`).trim();
              const label = String(scene.label ?? `Scene ${index + 1}`);
              if (!id) {
                return null;
              }
              return { id, label };
            })
            .filter(Boolean)
        : [];

      const normalizedScenes = scenes.length ? scenes : [
        { id: "scene-a", label: "Scene A" },
        { id: "scene-b", label: "Scene B" }
      ];

      const sceneIdSet = new Set(normalizedScenes.map(scene => scene.id));

      const differences = Array.isArray(spotDifference.differences)
        ? spotDifference.differences
            .map((entry, index) => {
              if (!entry || typeof entry !== "object") {
                return null;
              }
              const id = String(entry.id ?? `diff-${index + 1}`).trim();
              const label = String(entry.label ?? `Difference ${index + 1}`);
              if (!id) {
                return null;
              }

              const targets = Array.isArray(entry.targets)
                ? entry.targets
                    .map(target => {
                      if (!target || typeof target !== "object") {
                        return null;
                      }
                      const sceneId = String(target.scene ?? "").trim();
                      if (!sceneIdSet.has(sceneId)) {
                        return null;
                      }
                      const topPercent = Number(target.topPercent);
                      const leftPercent = Number(target.leftPercent);
                      const diameterPercent = Number(target.diameterPercent);

                      if (!Number.isFinite(topPercent) || !Number.isFinite(leftPercent)) {
                        return null;
                      }

                      return {
                        sceneId,
                        topPercent,
                        leftPercent,
                        diameterPercent: Number.isFinite(diameterPercent) ? diameterPercent : 16
                      };
                    })
                    .filter(Boolean)
                : [];

              if (!targets.length) {
                return null;
              }

              return { id, label, targets };
            })
            .filter(Boolean)
        : [];

      if (!differences.length) {
        container.textContent = "Spot-the-difference scene failed to load.";
        return;
      }

      const normalizedIndex = Number.isInteger(puzzleIndex) ? clampNumber(puzzleIndex, 0, PUZZLE_COUNT - 1) : null;
      const storedInteractiveState = Number.isInteger(normalizedIndex) ? getPuzzleInteractiveState(normalizedIndex) : null;
      const storedSpotDifference = storedInteractiveState?.spotDifference ?? null;

      const differenceIdSet = new Set(differences.map(diff => diff.id));

      const storedFoundIds = Array.isArray(storedSpotDifference?.foundDifferenceIds)
        ? storedSpotDifference.foundDifferenceIds
            .map(id => String(id ?? "").trim())
            .filter(id => differenceIdSet.has(id))
        : [];

      const foundDifferences = new Set(storedFoundIds);
      let puzzleCompleted = foundDifferences.size === differences.length;

      container.innerHTML = "";

      const wrapper = document.createElement("div");
      wrapper.className = "spot-difference-wrapper";

      if (prompt) {
        const promptEl = document.createElement("p");
        promptEl.className = "spot-difference-prompt";
        promptEl.textContent = prompt;
        wrapper.append(promptEl);
      }

      const scenesContainer = document.createElement("div");
      scenesContainer.className = "spot-difference-scenes";
      wrapper.append(scenesContainer);

      const differencePanel = document.createElement("div");
      differencePanel.className = "spot-difference-panel";

      const listHeading = document.createElement("h4");
      listHeading.textContent = "Differences";
      differencePanel.append(listHeading);

      const differenceList = document.createElement("ul");
      differenceList.className = "spot-difference-list";
      differencePanel.append(differenceList);

      const statusEl = document.createElement("p");
      statusEl.className = "spot-difference-status";
      differencePanel.append(statusEl);

      wrapper.append(differencePanel);
      container.append(wrapper);

      const sceneElements = new Map();

      normalizedScenes.forEach((scene, index) => {
        const sceneWrapper = document.createElement("div");
        sceneWrapper.className = "spot-difference-scene";
        sceneWrapper.dataset.sceneId = scene.id;

        const label = document.createElement("span");
        label.className = "spot-difference-scene-label";
        label.textContent = scene.label;
        sceneWrapper.append(label);

        const graphic = createSpotDifferenceSceneGraphic(index);
        sceneWrapper.append(graphic);

        scenesContainer.append(sceneWrapper);
        sceneElements.set(scene.id, sceneWrapper);
      });

      differences.forEach((difference, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = difference.label || `Difference ${index + 1}`;
        if (foundDifferences.has(difference.id)) {
          listItem.classList.add("is-found");
        }
        differenceList.append(listItem);

        difference.targets.forEach(target => {
          const sceneWrapper = sceneElements.get(target.sceneId);
          if (!sceneWrapper) {
            return;
          }

          const marker = document.createElement("button");
          marker.type = "button";
          marker.className = "spot-difference-target";
          marker.dataset.differenceId = difference.id;
          marker.setAttribute("aria-label", `Mark difference: ${difference.label}`);

          const diameter = Math.max(6, target.diameterPercent || 16);
          const half = diameter / 2;
          const top = Math.max(0, target.topPercent - half);
          const left = Math.max(0, target.leftPercent - half);

          marker.style.top = `${top}%`;
          marker.style.left = `${left}%`;
          marker.style.width = `${diameter}%`;
          marker.style.height = `${diameter}%`;

          if (foundDifferences.has(difference.id)) {
            marker.classList.add("is-found");
            marker.disabled = true;
          }

          marker.addEventListener("click", () => {
            if (puzzleCompleted || foundDifferences.has(difference.id)) {
              return;
            }

            foundDifferences.add(difference.id);
            marker.classList.add("is-found");
            marker.disabled = true;
            listItem.classList.add("is-found");

            persistState();
            updateStatus();
            maybeComplete();
          });

          sceneWrapper.append(marker);
        });

      });

      function persistState() {
        if (!Number.isInteger(normalizedIndex)) {
          return;
        }
        const payload = {
          foundDifferenceIds: Array.from(foundDifferences)
        };
        setPuzzleInteractiveState(normalizedIndex, { spotDifference: payload });
      }

      function updateStatus() {
        const total = differences.length;
        const found = foundDifferences.size;
        statusEl.textContent = `Found ${found} of ${total} differences.`;
      }

      function maybeComplete() {
        if (puzzleCompleted || foundDifferences.size < differences.length) {
          return;
        }

        puzzleCompleted = true;
        wrapper.classList.add("is-complete");

        if (typeof onSolved === "function") {
          try {
            const result = onSolved();
            if (result && typeof result.catch === "function") {
              result.catch(error => console.error("Spot the difference completion handler failed", error));
            }
          } catch (error) {
            console.error("Spot the difference completion handler failed", error);
          }
        }
      }

      function createSpotDifferenceSceneGraphic(index) {
        const variant = index === 0 ? "A" : "B";
        const svg = document.createElementNS(SVG_NS, "svg");
        svg.setAttribute("viewBox", "0 0 160 200");
        svg.setAttribute("role", "presentation");
        svg.classList.add("spot-difference-graphic");

        const backdrop = document.createElementNS(SVG_NS, "rect");
        backdrop.setAttribute("x", "0");
        backdrop.setAttribute("y", "0");
        backdrop.setAttribute("width", "160");
        backdrop.setAttribute("height", "200");
        backdrop.setAttribute("rx", "16");
        backdrop.classList.add("spot-difference-backdrop");
        svg.append(backdrop);

        const towerBase = document.createElementNS(SVG_NS, "rect");
        towerBase.setAttribute("x", "50");
        towerBase.setAttribute("y", "40");
        towerBase.setAttribute("width", "60");
        towerBase.setAttribute("height", "120");
        towerBase.setAttribute("rx", "12");
        towerBase.classList.add("spot-difference-tower");
        svg.append(towerBase);

        const roof = document.createElementNS(SVG_NS, "polygon");
        roof.setAttribute("points", "80 18, 46 40, 114 40");
        roof.classList.add("spot-difference-roof");
        svg.append(roof);

        const flagPole = document.createElementNS(SVG_NS, "rect");
        flagPole.setAttribute("x", "78");
        flagPole.setAttribute("y", "5");
        flagPole.setAttribute("width", "4");
        flagPole.setAttribute("height", "20");
        flagPole.classList.add("spot-difference-flagpole");
        svg.append(flagPole);

        const flagGroup = document.createElementNS(SVG_NS, "g");
        flagGroup.setAttribute("transform", "translate(82,8)");
        const flagShape = document.createElementNS(SVG_NS, "path");
        flagShape.setAttribute("d", "M0 0 L26 6 L0 12 Z");
        flagShape.classList.add("spot-difference-flag");
        flagGroup.append(flagShape);

        if (variant === "A") {
          const stripeOne = document.createElementNS(SVG_NS, "rect");
          stripeOne.setAttribute("x", "4");
          stripeOne.setAttribute("y", "1.6");
          stripeOne.setAttribute("width", "18");
          stripeOne.setAttribute("height", "2.6");
          stripeOne.classList.add("spot-difference-flag-stripe");

          const stripeTwo = document.createElementNS(SVG_NS, "rect");
          stripeTwo.setAttribute("x", "4");
          stripeTwo.setAttribute("y", "6.6");
          stripeTwo.setAttribute("width", "18");
          stripeTwo.setAttribute("height", "2.6");
          stripeTwo.classList.add("spot-difference-flag-stripe");

          flagGroup.append(stripeOne, stripeTwo);
        }

        svg.append(flagGroup);

        const windowFrame = document.createElementNS(SVG_NS, "rect");
        windowFrame.setAttribute("x", "68");
        windowFrame.setAttribute("y", "72");
        windowFrame.setAttribute("width", "24");
        windowFrame.setAttribute("height", "30");
        windowFrame.setAttribute("rx", "6");
        windowFrame.classList.add("spot-difference-window-frame");
        svg.append(windowFrame);

        if (variant === "A") {
          const roundWindow = document.createElementNS(SVG_NS, "circle");
          roundWindow.setAttribute("cx", "80");
          roundWindow.setAttribute("cy", "87");
          roundWindow.setAttribute("r", "9");
          roundWindow.classList.add("spot-difference-window");
          svg.append(roundWindow);
        } else {
          const squareWindow = document.createElementNS(SVG_NS, "rect");
          squareWindow.setAttribute("x", "72");
          squareWindow.setAttribute("y", "76");
          squareWindow.setAttribute("width", "16");
          squareWindow.setAttribute("height", "20");
          squareWindow.classList.add("spot-difference-window");
          svg.append(squareWindow);
        }

        const balcony = document.createElementNS(SVG_NS, "rect");
        balcony.setAttribute("x", "54");
        balcony.setAttribute("y", "112");
        balcony.setAttribute("width", "52");
        balcony.setAttribute("height", "10");
        balcony.setAttribute("rx", "5");
        balcony.classList.add("spot-difference-balcony");
        svg.append(balcony);

        const railGroup = document.createElementNS(SVG_NS, "g");
        railGroup.classList.add("spot-difference-rails");
        [0, 1, 2, 3].forEach(offset => {
          if (variant === "A" && offset === 2) {
            return;
          }
          const rail = document.createElementNS(SVG_NS, "rect");
          rail.setAttribute("x", `${60 + offset * 10}`);
          rail.setAttribute("y", "112");
          rail.setAttribute("width", "4");
          rail.setAttribute("height", "10");
          railGroup.append(rail);
        });
        svg.append(railGroup);

        const doorFrame = document.createElementNS(SVG_NS, "rect");
        doorFrame.setAttribute("x", "68");
        doorFrame.setAttribute("y", "138");
        doorFrame.setAttribute("width", "24");
        doorFrame.setAttribute("height", "32");
        doorFrame.setAttribute("rx", "6");
        doorFrame.classList.add("spot-difference-door-frame");
        svg.append(doorFrame);

        if (variant === "A") {
          const doorCircle = document.createElementNS(SVG_NS, "circle");
          doorCircle.setAttribute("cx", "80");
          doorCircle.setAttribute("cy", "154");
          doorCircle.setAttribute("r", "6");
          doorCircle.classList.add("spot-difference-door-emblem");
          svg.append(doorCircle);
        } else {
          const doorDiamond = document.createElementNS(SVG_NS, "polygon");
          doorDiamond.setAttribute("points", "80 146, 88 154, 80 162, 72 154");
          doorDiamond.classList.add("spot-difference-door-emblem");
          svg.append(doorDiamond);
        }

        return svg;
      }

      updateStatus();
      if (puzzleCompleted) {
        wrapper.classList.add("is-complete");
      }
    }

    function renderSwitchPuzzle(container, { puzzleIndex, switchPuzzle, prompt, onSolved }) {
      if (!container || !switchPuzzle) {
        return;
      }

      const rawGridSize = Number(switchPuzzle.gridSize);
      const fallbackSize = Number.isFinite(rawGridSize) ? Math.round(rawGridSize) : 3;
      const normalizedIndex = Number.isInteger(puzzleIndex) ? clampNumber(puzzleIndex, 0, PUZZLE_COUNT - 1) : null;
      const storedInteractiveState = Number.isInteger(normalizedIndex) ? getPuzzleInteractiveState(normalizedIndex) : null;
      const storedSwitchPuzzle = storedInteractiveState?.switchPuzzle ?? null;

      const storedGridSize = Number(storedSwitchPuzzle?.gridSize);
      const gridSize = Number.isFinite(storedGridSize)
        ? clampNumber(Math.round(storedGridSize), 2, 6)
        : clampNumber(Math.max(2, fallbackSize), 2, 6);

      let moveCount = Number.isFinite(storedSwitchPuzzle?.moveCount)
        ? clampNumber(Math.round(storedSwitchPuzzle.moveCount), 0, 9999)
        : 0;

      const restoredGrid = restoreSwitchGrid(storedSwitchPuzzle?.switches, gridSize);
      const hadStoredState = restoredGrid !== null;
      let gridState = hadStoredState ? restoredGrid : createRandomSwitchGrid(gridSize);

      if (!hadStoredState) {
        moveCount = 0;
      }

      let puzzleCompleted = false;
      let hasNotifiedSolve = false;

      container.innerHTML = "";

      const wrapper = document.createElement("div");
      wrapper.className = "switch-puzzle-wrapper";

      if (prompt) {
        const promptEl = document.createElement("p");
        promptEl.className = "switch-puzzle-prompt";
        promptEl.textContent = prompt;
        wrapper.append(promptEl);
      }

      const statusEl = document.createElement("p");
      statusEl.className = "switch-puzzle-status";
      wrapper.append(statusEl);

      const gridEl = document.createElement("div");
      gridEl.className = "switch-puzzle-grid";
      gridEl.style.setProperty("--switch-grid-size", String(gridSize));
      wrapper.append(gridEl);

      container.append(wrapper);

      const cellButtons = Array.from({ length: gridSize }, () => []);

      for (let row = 0; row < gridSize; row += 1) {
        for (let col = 0; col < gridSize; col += 1) {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "switch-puzzle-cell";
          button.dataset.row = String(row);
          button.dataset.col = String(col);
          button.addEventListener("click", () => {
            if (puzzleCompleted) {
              return;
            }
            handleInteraction(row, col);
          });
          gridEl.append(button);
          cellButtons[row][col] = button;
        }
      }

      updateAllCells();

      if (!hadStoredState) {
        persistState();
      }

      updateStatus();
      checkForCompletion();

      function handleInteraction(row, col) {
        toggleAt(row, col);
        toggleAt(row - 1, col);
        toggleAt(row + 1, col);
        toggleAt(row, col - 1);
        toggleAt(row, col + 1);

        moveCount = clampNumber(moveCount + 1, 0, 9999);
        persistState();
        updateStatus();
        checkForCompletion();
      }

      function persistState() {
        if (!Number.isInteger(normalizedIndex)) {
          return;
        }

        const payload = {
          gridSize,
          moveCount,
          switches: gridState.map(row => row.map(cell => (cell ? 1 : 0)))
        };

        setPuzzleInteractiveState(normalizedIndex, { switchPuzzle: payload });
      }

      function updateStatus() {
        const active = countActiveSwitches();
        statusEl.className = "switch-puzzle-status";
        if (active === 0) {
          const moveWord = moveCount === 1 ? "move" : "moves";
          statusEl.classList.add("is-complete");
          statusEl.textContent = `All switches OFF in ${moveCount} ${moveWord}.`;
        } else {
          statusEl.textContent = `Move count: ${moveCount} | Switches ON: ${active}`;
        }
      }

      function checkForCompletion() {
        if (puzzleCompleted) {
          return;
        }

        if (countActiveSwitches() === 0) {
          finalizeCompletion();
        }
      }

      function finalizeCompletion() {
        if (puzzleCompleted) {
          return;
        }

        puzzleCompleted = true;
        wrapper.classList.add("is-complete");
        gridEl.classList.add("is-complete");
        statusEl.classList.add("is-complete");
        disableAllCells();
        updateStatus();

        if (!hasNotifiedSolve && typeof onSolved === "function") {
          hasNotifiedSolve = true;
          try {
            const result = onSolved();
            if (result && typeof result.catch === "function") {
              result.catch(error => console.error("Switch puzzle completion handler failed", error));
            }
          } catch (error) {
            console.error("Switch puzzle completion handler failed", error);
          }
        }
      }

      function disableAllCells() {
        cellButtons.forEach(rowButtons => {
          rowButtons.forEach(button => {
            if (button) {
              button.disabled = true;
            }
          });
        });
      }

      function toggleAt(row, col) {
        if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) {
          return;
        }

        gridState[row][col] = !gridState[row][col];
        updateCell(row, col);
      }

      function updateCell(row, col) {
        const button = cellButtons[row]?.[col];
        if (!button) {
          return;
        }

        const isOn = Boolean(gridState[row][col]);
        button.classList.toggle("is-on", isOn);
        button.classList.toggle("is-off", !isOn);
        button.textContent = isOn ? "ON" : "OFF";
        button.setAttribute("aria-pressed", isOn ? "true" : "false");
        button.setAttribute("aria-label", `Switch row ${row + 1}, column ${col + 1}: ${isOn ? "On" : "Off"}`);
      }

      function updateAllCells() {
        for (let row = 0; row < gridSize; row += 1) {
          for (let col = 0; col < gridSize; col += 1) {
            updateCell(row, col);
          }
        }
      }

      function countActiveSwitches() {
        let total = 0;
        for (let row = 0; row < gridSize; row += 1) {
          for (let col = 0; col < gridSize; col += 1) {
            if (gridState[row][col]) {
              total += 1;
            }
          }
        }
        return total;
      }

      function createRandomSwitchGrid(size) {
        const grid = [];
        let activeCount = 0;
        for (let row = 0; row < size; row += 1) {
          const rowData = [];
          for (let col = 0; col < size; col += 1) {
            const isOn = Math.random() < 0.5;
            rowData.push(isOn);
            if (isOn) {
              activeCount += 1;
            }
          }
          grid.push(rowData);
        }

        if (activeCount === 0) {
          const randomIndex = Math.floor(Math.random() * size * size);
          const randomRow = Math.floor(randomIndex / size);
          const randomCol = randomIndex % size;
          grid[randomRow][randomCol] = true;
        }

        return grid;
      }

      function restoreSwitchGrid(source, size) {
        if (!Array.isArray(source) || source.length === 0) {
          return null;
        }

        const grid = [];
        for (let row = 0; row < size; row += 1) {
          const rowSource = Array.isArray(source[row]) ? source[row] : [];
          const rowData = [];
          for (let col = 0; col < size; col += 1) {
            const rawValue = rowSource[col];
            const isOn = rawValue === 1 || rawValue === true || rawValue === "1" || rawValue === "true";
            rowData.push(Boolean(isOn));
          }
          grid.push(rowData);
        }

        return grid;
      }
    }

    function renderKeypadPathPuzzle(container, { puzzleIndex, keypadPath, prompt, onSolved }) {
      if (!container || !keypadPath || !Array.isArray(keypadPath.correctPath)) {
        return;
      }

      const path = keypadPath.correctPath
        .map(value => Number(value))
        .filter(value => Number.isInteger(value));

      if (!path.length) {
        container.textContent = "Keypad path data unavailable.";
        return;
      }

      const normalizedIndex = Number.isInteger(puzzleIndex) ? clampNumber(puzzleIndex, 0, PUZZLE_COUNT - 1) : null;
      const storedInteractiveState = Number.isInteger(normalizedIndex) ? getPuzzleInteractiveState(normalizedIndex) : null;
      const storedKeypadPath = storedInteractiveState?.keypadPath ?? null;

      const storedPath = Array.isArray(storedKeypadPath?.currentPath)
        ? storedKeypadPath.currentPath.map(value => Number(value)).filter(value => Number.isInteger(value))
        : [];

      let currentPath = storedPath.slice(0, path.length);
      const storedComplete = Boolean(storedKeypadPath?.isComplete);
      const matchesStored = currentPath.length === path.length && currentPath.every((value, index) => value === path[index]);
      let puzzleCompleted = storedComplete && matchesStored;

      container.innerHTML = "";

      const wrapper = document.createElement("div");
      wrapper.className = "keypad-path-wrapper";

      if (prompt) {
        const promptEl = document.createElement("p");
        promptEl.className = "keypad-path-prompt";
        promptEl.textContent = prompt;
        wrapper.append(promptEl);
      }

      const hintList = Array.isArray(keypadPath.hints) ? keypadPath.hints.filter(Boolean) : [];
      if (hintList.length) {
        const hintsBlock = document.createElement("ul");
        hintsBlock.className = "keypad-path-hints";
        hintList.forEach(hint => {
          const item = document.createElement("li");
          item.textContent = String(hint);
          hintsBlock.append(item);
        });
        wrapper.append(hintsBlock);
      }

      const statusEl = document.createElement("p");
      statusEl.className = "keypad-path-status";
      wrapper.append(statusEl);

      const pathDisplay = document.createElement("p");
      pathDisplay.className = "keypad-path-display";
      wrapper.append(pathDisplay);

      const keypad = document.createElement("div");
      keypad.className = "keypad-path-grid";
      wrapper.append(keypad);

      const controls = document.createElement("div");
      controls.className = "keypad-path-controls";
      const resetButton = document.createElement("button");
      resetButton.type = "button";
      resetButton.textContent = "Reset";
      controls.append(resetButton);
      wrapper.append(controls);

      container.append(wrapper);

      const buttons = new Map();
      for (let value = 1; value <= 9; value += 1) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "keypad-path-key";
        button.dataset.value = String(value);
        button.textContent = String(value);
        keypad.append(button);
        buttons.set(value, button);

        button.addEventListener("click", () => {
          if (puzzleCompleted) {
            return;
          }

          const expected = path[currentPath.length];
          const numericValue = value;

          if (numericValue !== expected) {
            indicateError();
            currentPath = [];
            persistState();
            updateVisualPath();
            setStatus("That key breaks the L shape. Start again.", "error");
            return;
          }

          currentPath.push(numericValue);
          persistState();
          updateVisualPath();

          if (currentPath.length === path.length) {
            puzzleCompleted = true;
            setStatus("Path locked in!", "success");
            updateVisualPath();
            if (typeof onSolved === "function") {
              try {
                const result = onSolved();
                if (result && typeof result.catch === "function") {
                  result.catch(error => console.error("Keypad path completion handler failed", error));
                }
              } catch (error) {
                console.error("Keypad path completion handler failed", error);
              }
            }
          } else {
            setStatus("Good move. Keep tracing the L.", "success");
          }
        });
      }

      resetButton.addEventListener("click", () => {
        if (puzzleCompleted) {
          return;
        }
        currentPath = [];
        persistState();
        updateVisualPath();
        setStatus("Path reset.");
      });

      function persistState() {
        if (!Number.isInteger(normalizedIndex)) {
          return;
        }
        const payload = {
          currentPath: currentPath.slice(0, path.length),
          isComplete: puzzleCompleted
        };
        setPuzzleInteractiveState(normalizedIndex, { keypadPath: payload });
      }

      function setStatus(message, tone = "info") {
        statusEl.textContent = message ?? "";
        statusEl.className = "keypad-path-status";
        if (tone === "success") {
          statusEl.classList.add("is-success");
        } else if (tone === "error") {
          statusEl.classList.add("is-error");
        }
      }

      function updateVisualPath() {
        const parts = currentPath.map(String);
        pathDisplay.textContent = parts.length ? parts.join(" → ") : "No steps entered yet.";

        buttons.forEach((button, value) => {
          const isActive = currentPath.includes(value);
          button.classList.toggle("is-active", isActive);
          button.disabled = puzzleCompleted;
        });

        keypad.classList.toggle("is-complete", puzzleCompleted);
      }

      function indicateError() {
        keypad.classList.add("is-error");
        window.setTimeout(() => {
          keypad.classList.remove("is-error");
        }, 320);
      }

      updateVisualPath();
      if (puzzleCompleted) {
        setStatus("Path locked in!", "success");
      } else {
        setStatus("Trace the correct L-shaped path.");
      }
    }

    function renderMemoryGamePuzzle(container, { puzzleIndex, memoryGame, prompt, onSolved }) {
      if (!container || !memoryGame || !Array.isArray(memoryGame.pairs)) {
        return;
      }

      const pairs = memoryGame.pairs
        .map((pair, index) => {
          if (!pair || typeof pair !== "object") {
            return null;
          }
          const id = String(pair.id ?? `pair-${index + 1}`).trim();
          const face = String(pair.face ?? "").trim();
          if (!id || !face) {
            return null;
          }
          return { id, face };
        })
        .filter(Boolean);

      if (!pairs.length) {
        container.textContent = "Memory deck failed to load.";
        return;
      }

      const normalizedIndex = Number.isInteger(puzzleIndex) ? clampNumber(puzzleIndex, 0, PUZZLE_COUNT - 1) : null;
      const storedInteractiveState = Number.isInteger(normalizedIndex) ? getPuzzleInteractiveState(normalizedIndex) : null;
      const storedMemoryGame = storedInteractiveState?.memoryGame ?? null;

      const pairIdSet = new Set(pairs.map(pair => pair.id));

      const expectedDeckSize = pairs.length * 2;
      const storedDeck = Array.isArray(storedMemoryGame?.deck)
        ? storedMemoryGame.deck
            .map(card => {
              if (!card || typeof card !== "object") {
                return null;
              }
              const cardId = String(card.cardId ?? "").trim();
              const pairId = String(card.pairId ?? "").trim();
              const face = String(card.face ?? "").trim();
              if (!cardId || !pairIdSet.has(pairId) || !face) {
                return null;
              }
              return { cardId, pairId, face };
            })
            .filter(Boolean)
        : [];

      let deck;
      if (storedDeck.length === expectedDeckSize) {
        deck = storedDeck;
      } else {
        deck = [];
        pairs.forEach(pair => {
          deck.push({ cardId: `${pair.id}-a`, pairId: pair.id, face: pair.face });
          deck.push({ cardId: `${pair.id}-b`, pairId: pair.id, face: pair.face });
        });
        shuffleArray(deck);
      }

      const storedMatchedPairs = Array.isArray(storedMemoryGame?.matchedPairIds)
        ? storedMemoryGame.matchedPairIds
            .map(id => String(id ?? "").trim())
            .filter(id => pairIdSet.has(id))
        : [];

      const matchedPairIds = new Set(storedMatchedPairs);
      let puzzleCompleted = matchedPairIds.size === pairs.length;

      container.innerHTML = "";

      const wrapper = document.createElement("div");
      wrapper.className = "memory-game-wrapper";

      if (prompt) {
        const promptEl = document.createElement("p");
        promptEl.className = "memory-game-prompt";
        promptEl.textContent = prompt;
        wrapper.append(promptEl);
      }

      const statusEl = document.createElement("p");
      statusEl.className = "memory-game-status";
      wrapper.append(statusEl);

      const finalWord = String(memoryGame.finalWord ?? "").trim();
      const finalWordDisplay = document.createElement("div");
      finalWordDisplay.className = "memory-game-word";
      const wordSpans = [];
      if (finalWord) {
        finalWord.split("").forEach(letter => {
          const span = document.createElement("span");
          span.textContent = letter.toUpperCase();
          finalWordDisplay.append(span);
          wordSpans.push(span);
        });
        wrapper.append(finalWordDisplay);
      }

      const grid = document.createElement("div");
      grid.className = "memory-game-grid";
      wrapper.append(grid);
      container.append(wrapper);

      const cardContexts = new Map();
      let interactionLocked = false;
      let activeCards = [];

      deck.forEach(card => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "memory-card";
        button.dataset.cardId = card.cardId;
        button.dataset.pairId = card.pairId;
        button.setAttribute("aria-label", "Flip card");

        const back = document.createElement("span");
        back.className = "memory-card-back";
        back.textContent = "?";

        const face = document.createElement("span");
        face.className = "memory-card-face";
        face.textContent = card.face;

        button.append(back, face);
        grid.append(button);

        if (matchedPairIds.has(card.pairId)) {
          button.classList.add("is-matched");
          button.disabled = true;
        }

        button.addEventListener("click", () => {
          if (puzzleCompleted || interactionLocked || button.classList.contains("is-matched")) {
            return;
          }

          if (activeCards.find(entry => entry.button === button)) {
            return;
          }

          button.classList.add("is-flipped");
          activeCards.push({ button, card });

          if (activeCards.length === 2) {
            interactionLocked = true;
            window.setTimeout(() => {
              evaluatePair();
            }, 420);
          }
        });

        cardContexts.set(card.cardId, { button, card });
      });

      function persistState() {
        if (!Number.isInteger(normalizedIndex)) {
          return;
        }

        const payload = {
          deck: deck.map(card => ({ cardId: card.cardId, pairId: card.pairId, face: card.face })),
          matchedPairIds: Array.from(matchedPairIds)
        };

        setPuzzleInteractiveState(normalizedIndex, { memoryGame: payload });
      }

      function setStatus(message, tone = "info") {
        statusEl.textContent = message ?? "";
        statusEl.className = "memory-game-status";
        if (tone === "success") {
          statusEl.classList.add("is-success");
        } else if (tone === "error") {
          statusEl.classList.add("is-error");
        }
      }

      function evaluatePair() {
        if (activeCards.length !== 2) {
          interactionLocked = false;
          return;
        }

        const [first, second] = activeCards;
        if (first.card.pairId === second.card.pairId) {
          matchedPairIds.add(first.card.pairId);
          first.button.classList.add("is-matched");
          second.button.classList.add("is-matched");
          first.button.disabled = true;
          second.button.disabled = true;

          revealWordLetter(first.card.pairId);
          setStatus("Pair matched!", "success");

          persistState();

          if (matchedPairIds.size === pairs.length) {
            puzzleCompleted = true;
            grid.classList.add("is-complete");
            setStatus("All pairs found.", "success");
            if (typeof onSolved === "function") {
              try {
                const result = onSolved();
                if (result && typeof result.catch === "function") {
                  result.catch(error => console.error("Memory game completion handler failed", error));
                }
              } catch (error) {
                console.error("Memory game completion handler failed", error);
              }
            }
          }
        } else {
          setStatus("Not a match yet.", "error");
          window.setTimeout(() => {
            first.button.classList.remove("is-flipped");
            second.button.classList.remove("is-flipped");
          }, 340);
        }

        activeCards = [];
        interactionLocked = false;
      }

      function revealWordLetter(pairId) {
        if (!finalWord || !wordSpans.length) {
          return;
        }

        const pairIndex = pairs.findIndex(pair => pair.id === pairId);
        if (pairIndex === -1) {
          return;
        }

        const targetSpan = wordSpans[pairIndex];
        if (targetSpan) {
          targetSpan.classList.add("is-revealed");
        }
      }

      matchedPairIds.forEach(pairId => revealWordLetter(pairId));

      if (puzzleCompleted) {
        grid.classList.add("is-complete");
        setStatus("All pairs found.", "success");
      } else {
        setStatus("Flip two cards to find matching pairs.");
      }

      persistState();
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
      working.startTimestamp = new Date().toISOString();

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
        const previousTeamId = Number.isInteger(state.teamId) ? state.teamId : null;
        if (previousTeamId !== null) {
          const overrideState = defaultState(previousTeamId);
          queueDashboardOverride(overrideState, "reset");
        } else {
          scheduleDashboardSync("reset");
        }
        state = defaultState(null);
        pendingPuzzleUnlockIndex = null;
        clearStateCookie();
        hideFloorTransition();
        render();
        showStatus("Progress reset.", "success");
      });

      exportButton?.addEventListener("click", exportProgress);
      importButton?.addEventListener("click", importProgress);
      startGameBegin?.addEventListener("click", handleStartGameBegin);
      gmOverrideButton?.addEventListener("click", () => {
        if (!gmOverrideButton.disabled) {
          openScanner({ mode: "gmOverride" });
        }
      });

      showOtherProgressButton?.addEventListener("click", () => {
        if (!showOtherProgressButton.disabled) {
          openTeamProgressOverlay();
        }
      });

      ensureScannerListeners();

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

      teamProgressOverlayClose?.addEventListener("click", event => {
        event.preventDefault();
        closeTeamProgressOverlay();
      });

      teamProgressOverlay?.addEventListener("click", event => {
        if (event.target === teamProgressOverlay) {
          closeTeamProgressOverlay();
        }
      });
    }
    function ensureScannerListeners() {
      if (scannerListenersBound) {
        return;
      }
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

      scannerListenersBound = true;
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
        scheduleDashboardSync("state-save");
        return;
      }
      const maxAge = CACHE_DURATION_DAYS * 24 * 60 * 60;
      const encoded = encodeURIComponent(payload);
      document.cookie = `${COOKIE_NAME}=${encoded}; max-age=${maxAge}; path=/; SameSite=Lax`;
      scheduleDashboardSync("state-save");
    }

    function scheduleDashboardRetry(reason = "retry") {
      if (typeof window === "undefined") {
        return;
      }
      window.setTimeout(() => scheduleDashboardSync(reason), Math.max(120, Math.min(600, DASHBOARD_SYNC_DEBOUNCE_MS)));
    }

    function scheduleDashboardSync(reason = "state-change") {
      if (!dashboardConfig || typeof window === "undefined") {
        return;
      }
      dashboardPendingReason = reason;
      if (dashboardSyncTimer !== null) {
        window.clearTimeout(dashboardSyncTimer);
      }
      dashboardSyncTimer = window.setTimeout(() => {
        dashboardSyncTimer = null;
        sendDashboardSync(dashboardPendingReason).catch(error => {
          console.warn("Dashboard sync failed", error);
        });
      }, DASHBOARD_SYNC_DEBOUNCE_MS);
    }

    async function sendDashboardSync(reason = "state-change") {
      if (!dashboardConfig) {
        return false;
      }

      const overridePayload = dashboardOverridePayload;
      let payload = overridePayload ?? buildDashboardPayload(reason);
      if (!payload) {
        return false;
      }
      if (!payload.reason) {
        payload.reason = reason;
      }

      const endpoints = Array.isArray(dashboardConfig.progressEndpoints)
        ? dashboardConfig.progressEndpoints
        : [];
      if (!endpoints.length) {
        return false;
      }

      const total = endpoints.length;
      const startIndex = Math.min(dashboardConfig.activeProgressIndex ?? 0, total - 1);

      for (let offset = 0; offset < total; offset += 1) {
        const index = (startIndex + offset) % total;
        const endpoint = endpoints[index];
        const request = createDashboardRequest(endpoint, payload);
        if (!request) {
          continue;
        }

        const signature = `${endpoint}::${request.body}`;
        if (signature === dashboardLastSignature) {
          dashboardOverridePayload = null;
          return true;
        }

        let synced = false;

        if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
          try {
            const beaconBlob = new Blob([request.body], { type: request.contentType });
            synced = navigator.sendBeacon(endpoint, beaconBlob);
          } catch (err) {
            console.warn("Beacon dashboard sync failed", endpoint, err);
          }
        }

        if (!synced) {
          synced = await attemptFetchSync(endpoint, request.body, request.contentType);
        }

        if (synced) {
          dashboardConfig.activeProgressIndex = index;
          dashboardLastSignature = signature;
          dashboardOverridePayload = null;
          dashboardRetryCount = 0;
          return true;
        }
      }

      dashboardOverridePayload = overridePayload ?? payload;
      if (endpoints.length > 1) {
        dashboardConfig.activeProgressIndex = (startIndex + 1) % endpoints.length;
      }
      if (dashboardRetryCount < Math.max(3, endpoints.length * 2)) {
        dashboardRetryCount += 1;
        scheduleDashboardRetry('retry');
      } else {
        console.warn('Dashboard sync exhausted endpoints');
        dashboardRetryCount = 0;
      }
      return false;
    }

    async function attemptFetchSync(endpoint, body, contentType = "application/json") {
      try {
        let controller = null;
        let timeoutId = null;
        if (typeof AbortController === "function") {
          controller = new AbortController();
          timeoutId = window.setTimeout(() => {
            try {
              controller.abort();
            } catch (err) {
              // ignore abort errors
            }
          }, 5000);
        }

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": contentType,
            Accept: "application/json, text/plain;q=0.8, */*;q=0.5"
          },
          body,
          mode: "cors",
          credentials: "omit",
          cache: "no-store",
          keepalive: true,
          signal: controller?.signal
        });

        if (timeoutId !== null) {
          window.clearTimeout(timeoutId);
        }

        if (response.ok) {
          return true;
        }

        console.warn("Dashboard sync responded with", response.status, endpoint);
      } catch (err) {
        console.warn("Dashboard sync network error", endpoint, err);
      }
      return false;
    }

    function createDashboardRequest(endpoint, payload) {
      if (!endpoint || !payload) {
        return null;
      }

      if (isSheetEndpoint(endpoint)) {
        const csv = encodePayloadAsCsv(payload);
        if (!csv) {
          return null;
        }
        return {
          body: csv,
          contentType: "text/plain; charset=utf-8"
        };
      }

      let serialized;
      try {
        serialized = JSON.stringify(payload);
      } catch (err) {
        console.warn("Dashboard payload serialization failed", err);
        return null;
      }
      return {
        body: serialized,
        contentType: "application/json"
      };
    }

    function isSheetEndpoint(endpoint) {
      if (typeof endpoint !== "string") {
        return false;
      }
      return /script\.google\.com\/macros\//i.test(endpoint);
    }

    function encodePayloadAsCsv(payload) {
      if (!payload || typeof payload !== "object") {
        return "";
      }

      const record = {
        TeamId: typeof payload.teamId === "number" ? payload.teamId : "",
        TeamName: payload.teamName ?? "",
        HasStarted: payload.hasStarted ? "TRUE" : "FALSE",
        HasWon: payload.hasWon ? "TRUE" : "FALSE",
        SolvedCount: typeof payload.solved === "number" ? payload.solved : 0,
        PuzzleCount: typeof payload.puzzleCount === "number" ? payload.puzzleCount : 0,
        ProgressPercent: typeof payload.progressPercent === "number" ? payload.progressPercent : 0,
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

      const headers = Object.keys(record);
      const values = headers.map(key => encodeCsvValue(record[key]));
      return `${headers.join(",")}\n${values.join(",")}`;
    }

    function encodeBooleanSeries(source) {
      if (!Array.isArray(source) || !source.length) {
        return "";
      }
      return source.map(value => (value ? "1" : "0")).join("");
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

    function buildDashboardPayload(reason = "state-change") {
      return buildDashboardPayloadFromState(state, reason);
    }

    function buildDashboardPayloadFromState(targetState, reason = "state-change") {
      if (!targetState || typeof targetState !== "object") {
        return null;
      }

      const teamId = Number.isInteger(targetState.teamId)
        ? clampNumber(targetState.teamId, 0, TEAM_COUNT - 1)
        : null;

      const completions = safeBooleanArray(targetState.completions, PUZZLE_COUNT);
      const unlocked = safeBooleanArray(targetState.unlocked, PUZZLE_COUNT).map((value, index) =>
        value || completions[index]
      );

      const hasStarted = Boolean(targetState.hasStarted) || completions.some(Boolean) || unlocked.some(Boolean);

      if (teamId === null && !hasStarted) {
        return null;
      }

      const solved = completions.filter(Boolean).length;
      const puzzleCount = PUZZLE_COUNT;
      const teamName = Number.isInteger(teamId) ? TEAM_NAMES[teamId] ?? `Team ${teamId + 1}` : "Unassigned device";
      const order = getOrderForTeam(teamId);

      const currentIndex = targetState === state && Number.isInteger(teamId)
        ? getCurrentSolvingIndex()
        : inferCurrentIndexFromSnapshot({ completions, unlocked }, order);

      const nextIndex = targetState === state && Number.isInteger(teamId)
        ? getNextDestinationIndex()
        : inferNextIndexFromSnapshot(completions, order);

      const nextPuzzleLabel = Number.isInteger(nextIndex)
        ? puzzles[nextIndex]?.floor ?? `Mission ${(nextIndex ?? 0) + 1}`
        : null;

      const startedAt = sanitizeStartTimestamp(targetState.startTimestamp);
      const runtimeSeconds = startedAt ? Math.max(0, Math.floor((Date.now() - Date.parse(startedAt)) / 1000)) : null;

      const payload = {
        teamId,
        teamName,
        hasStarted,
        hasWon: Boolean(targetState.hasWon) || solved >= puzzleCount,
        solved,
        puzzleCount,
        completions,
        unlocked,
        currentPuzzleIndex: Number.isInteger(currentIndex) ? currentIndex : null,
        nextPuzzleIndex: Number.isInteger(nextIndex) ? nextIndex : null,
        nextPuzzleLabel,
        timestamp: new Date().toISOString(),
        reason,
        progressPercent: puzzleCount > 0 ? Math.round((solved / puzzleCount) * 100) : 0,
        startedAt,
        runtimeSeconds
      };

      return payload;
    }

    function queueDashboardOverride(stateSnapshot, reason = "override") {
      const snapshotPayload = buildDashboardPayloadFromState(stateSnapshot, reason);
      dashboardOverridePayload = snapshotPayload ?? null;
      if (snapshotPayload) {
        dashboardLastSignature = null;
        scheduleDashboardSync(reason);
      }
    }

    function safeBooleanArray(source, length) {
      const result = Array.from({ length }, () => false);
      if (!Array.isArray(source)) {
        return result;
      }
      for (let index = 0; index < length; index += 1) {
        result[index] = Boolean(source[index]);
      }
      return result;
    }

    function inferCurrentIndexFromSnapshot(snapshot, order) {
      if (!Array.isArray(order) || !order.length) {
        return null;
      }
      for (let i = 0; i < order.length; i += 1) {
        const index = order[i];
        if (snapshot.unlocked[index] && !snapshot.completions[index]) {
          return index;
        }
      }
      return null;
    }

    function inferNextIndexFromSnapshot(completions, order) {
      if (!Array.isArray(order) || !order.length) {
        return null;
      }
      for (let i = 0; i < order.length; i += 1) {
        const index = order[i];
        if (!completions[index]) {
          return index;
        }
      }
      return null;
    }

    function resolveDashboardBase() {
      if (typeof window === "undefined") {
        return null;
      }
      if (typeof window.__TOWER_DASHBOARD_ENDPOINT__ === "string") {
        const configured = window.__TOWER_DASHBOARD_ENDPOINT__.trim();
        if (configured) {
          return configured;
        }
      }
      const meta = document.querySelector('meta[name="tower-dashboard-base"]');
      if (meta?.content?.trim()) {
        return meta.content.trim();
      }
      const bodyAttr = document.body?.dataset?.dashboardBase?.trim();
      if (bodyAttr) {
        return bodyAttr;
      }
      return null;
    }

    function sanitizeEndpointBase(value) {
      if (!value) {
        return null;
      }
      const trimmed = String(value).trim();
      if (!trimmed) {
        return null;
      }
      return trimmed.replace(/\/+$/, "");
    }

    function sanitizeStartTimestamp(value) {
      if (!value) {
        return null;
      }

      let candidate = null;

      if (value instanceof Date) {
        candidate = value;
      } else if (typeof value === "string") {
        const parsed = new Date(value);
        if (!Number.isNaN(parsed.getTime())) {
          candidate = parsed;
        }
      } else if (typeof value === "number") {
        const parsed = new Date(value);
        if (!Number.isNaN(parsed.getTime())) {
          candidate = parsed;
        }
      }

      if (!candidate || Number.isNaN(candidate.getTime())) {
        return null;
      }

      return candidate.toISOString();
    }

    function sanitizePathSegment(value) {
      if (!value || typeof value !== "string") {
        return null;
      }
      const trimmed = value.trim().replace(/^\/+/, "").replace(/\/+$/, "");
      return trimmed ? trimmed : null;
    }

    function extractSegments(source) {
      if (typeof source !== "string") {
        return [];
      }
      return source
        .split(/[,;\s]+/)
        .map(segment => segment.trim())
        .filter(Boolean);
    }

    function sanitizeProgressPaths(paths) {
      const result = [];
      if (!Array.isArray(paths)) {
        return result;
      }
      for (const raw of paths) {
        if (typeof raw !== "string") {
          continue;
        }
        const trimmed = raw.trim();
        if (!trimmed) {
          continue;
        }
        if (/^https?:\/\//i.test(trimmed)) {
          const endpoint = sanitizeEndpointBase(trimmed);
          if (endpoint) {
            result.push(endpoint);
          }
        } else {
          const segment = sanitizePathSegment(trimmed);
          if (segment) {
            result.push(segment);
          }
        }
      }
      return Array.from(new Set(result));
    }

    function normalizeOverrides(overrides) {
      const normalized = { progressPaths: [], statePath: null };
      if (!overrides || typeof overrides !== "object") {
        return normalized;
      }
      const rawProgress = Array.isArray(overrides.progressPaths)
        ? overrides.progressPaths
        : typeof overrides.progressPath === "string"
        ? [overrides.progressPath]
        : [];
      const sanitizedProgress = sanitizeProgressPaths(rawProgress);
      if (sanitizedProgress.length) {
        normalized.progressPaths = sanitizedProgress;
      }
      if (typeof overrides.statePath === "string") {
        const trimmedState = overrides.statePath.trim();
        if (trimmedState) {
          if (/^https?:\/\//i.test(trimmedState)) {
            const endpoint = sanitizeEndpointBase(trimmedState);
            if (endpoint) {
              normalized.statePath = endpoint;
            }
          } else {
            const segment = sanitizePathSegment(trimmedState);
            if (segment) {
              normalized.statePath = segment;
            }
          }
        }
      }
      return normalized;
    }

    function resolveEndpoint(base, candidate) {
      if (!candidate) {
        return null;
      }
      if (/^https?:\/\//i.test(candidate)) {
        return sanitizeEndpointBase(candidate);
      }
      const sanitizedBase = sanitizeEndpointBase(base);
      if (!sanitizedBase) {
        return null;
      }
      const segment = sanitizePathSegment(candidate);
      if (!segment) {
        return null;
      }
      return `${sanitizedBase}/${segment}`.replace(/\/+$/, "");
    }

    function createDashboardConfig(base, overridesInput = {}) {
      const sanitizedBase = sanitizeEndpointBase(base);
      if (!sanitizedBase) {
        return null;
      }
      const overrides = normalizeOverrides(overridesInput);
      const hasAbsoluteProgress = overrides.progressPaths.some(candidate => /^https?:\/\//i.test(candidate));
      const progressCandidates = hasAbsoluteProgress
        ? overrides.progressPaths.slice()
        : [...overrides.progressPaths, ...DEFAULT_PROGRESS_PATHS];
      const progressEndpoints = [];
      for (const candidate of progressCandidates) {
        const endpoint = resolveEndpoint(sanitizedBase, candidate);
        if (endpoint && !progressEndpoints.includes(endpoint)) {
          progressEndpoints.push(endpoint);
        }
      }
      if (!progressEndpoints.length) {
        if (hasAbsoluteProgress) {
          for (const candidate of overrides.progressPaths) {
            const endpoint = sanitizeEndpointBase(candidate);
            if (endpoint && !progressEndpoints.includes(endpoint)) {
              progressEndpoints.push(endpoint);
            }
          }
        }
        if (!progressEndpoints.length) {
          const fallback = resolveEndpoint(sanitizedBase, DEFAULT_PROGRESS_PATHS[0]);
          if (fallback) {
            progressEndpoints.push(fallback);
          }
        }
      }
      const stateCandidate = overrides.statePath ?? DEFAULT_STATE_PATH;
      const stateEndpoint = resolveEndpoint(sanitizedBase, stateCandidate) ?? resolveEndpoint(sanitizedBase, DEFAULT_STATE_PATH);
      return {
        base: sanitizedBase,
        progressEndpoints,
        stateEndpoint,
        activeProgressIndex: 0
      };
    }

    function updateDashboardConfig(newBase, overrideInput) {
      if (!dashboardOverrides) {
        dashboardOverrides = { progressPaths: [], statePath: null };
      }
      if (overrideInput && typeof overrideInput === "object") {
        const normalizedInput = normalizeOverrides(overrideInput);
        dashboardOverrides = {
          progressPaths: normalizedInput.progressPaths.length ? normalizedInput.progressPaths : dashboardOverrides.progressPaths,
          statePath: normalizedInput.statePath ?? dashboardOverrides.statePath
        };
      } else {
        dashboardOverrides = resolveDashboardOverrides();
      }
      const baseCandidate = sanitizeEndpointBase(newBase) ?? dashboardConfig?.base ?? resolveDashboardBase();
      dashboardConfig = createDashboardConfig(baseCandidate, dashboardOverrides);
      configureTeamProgressButton();
      if (!dashboardConfig) {
        return null;
      }
      dashboardLastSignature = null;
      scheduleDashboardSync("config-update");
      return dashboardConfig;
    }

    function resolveDashboardOverrides() {
      if (typeof window === "undefined") {
        return { progressPaths: [], statePath: null };
      }
      const progressPaths = [
        ...extractSegments(document.querySelector('meta[name="tower-dashboard-progress"]')?.content),
        ...extractSegments(document.body?.dataset?.dashboardProgress)
      ];
      const overrides = {};
      if (progressPaths.length) {
        overrides.progressPaths = progressPaths;
      }
      const stateMeta = document.querySelector('meta[name="tower-dashboard-state"]');
      const stateAttr = document.body?.dataset?.dashboardState;
      const stateCandidate = typeof stateMeta?.content === "string" && stateMeta.content.trim()
        ? stateMeta.content.trim()
        : typeof stateAttr === "string" && stateAttr.trim()
        ? stateAttr.trim()
        : "";
      if (stateCandidate) {
        overrides.statePath = stateCandidate;
      }
      const normalized = normalizeOverrides(overrides);
      return {
        progressPaths: normalized.progressPaths,
        statePath: normalized.statePath
      };
    }

    function configureTeamProgressButton() {
      if (!showOtherProgressButton) {
        return;
      }
      const hasEndpoint = Boolean(dashboardConfig?.stateEndpoint);
      showOtherProgressButton.disabled = !hasEndpoint;
      if (hasEndpoint) {
        showOtherProgressButton.removeAttribute("aria-disabled");
        showOtherProgressButton.removeAttribute("title");
      } else {
        showOtherProgressButton.setAttribute("aria-disabled", "true");
        showOtherProgressButton.title = "Connect to the dashboard to view other teams.";
      }
    }

    function setupDashboardDebugApi() {
      if (typeof window === "undefined") {
        return;
      }

      const api = {
        getStateSnapshot: () => {
          try {
            return JSON.parse(JSON.stringify(state));
          } catch (err) {
            return sanitizeState(state);
          }
        },
        getDashboardConfig: () => (dashboardConfig ? { ...dashboardConfig } : null),
        setDashboardEndpoint: value => {
          if (!value) {
            return updateDashboardConfig();
          }
          if (typeof value === "string") {
            return updateDashboardConfig(value);
          }
          if (typeof value === "object") {
            return updateDashboardConfig(value.base ?? null, value);
          }
          return dashboardConfig;
        },
        setDashboardOverrides: overrides => updateDashboardConfig(null, overrides),
        getProgressEndpoints: () => (dashboardConfig?.progressEndpoints ?? []).slice(),
        getPayloadPreview: reason => buildDashboardPayload(reason ?? "preview"),
        syncNow: reason => sendDashboardSync(reason ?? "manual"),
        scheduleSync: reason => scheduleDashboardSync(reason ?? "manual"),
        resolveConfiguredEndpoint: () => resolveDashboardBase(),
        queueOverrideSnapshot: snapshot => queueDashboardOverride(snapshot, "manual-override")
      };

      try {
        Object.defineProperty(window, "TowerHunt", {
          value: Object.freeze(api),
          configurable: true
        });
      } catch (err) {
        window.TowerHunt = api;
      }
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

      const sanitizedPuzzleState = sanitizePuzzleState(candidate.puzzleState, sanitizedCompletions);
      const startTimestamp = sanitizeStartTimestamp(candidate.startTimestamp ?? candidate.startedAt ?? null);

      return {
        teamId,
        hasStarted,
        completions: sanitizedCompletions,
        unlocked: sanitizedUnlocked,
        revealed: sanitizedRevealed,
        hasWon,
        puzzleState: sanitizedPuzzleState,
        startTimestamp
      };
    }

    function clampNumber(value, min, max) {
      const n = Number.isFinite(value) ? Number(value) : min;
      return Math.min(Math.max(n, min), max);
    }

    function getTeamOrder(teamIdOverride = state.teamId) {
      return getOrderForTeam(teamIdOverride);
    }

    function getOrderForTeam(teamId) {
      if (!Number.isInteger(teamId)) {
        return [];
      }
      const sanitized = clampNumber(teamId, 0, TEAM_COUNT - 1);
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

    function sanitizePuzzleState(candidate, completions) {
      if (!candidate || typeof candidate !== "object") {
        return {};
      }

      const result = {};

      Object.entries(candidate).forEach(([key, value]) => {
        const index = Number(key);
        if (!Number.isInteger(index) || index < 0 || index >= PUZZLE_COUNT) {
          return;
        }
        if (completions[index]) {
          return;
        }
        if (!value || typeof value !== "object") {
          return;
        }

        const entryState = {};

        if (value.wordSearch && typeof value.wordSearch === "object") {
          const sanitizedWordSearch = sanitizeStoredWordSearch(value.wordSearch);
          if (sanitizedWordSearch) {
            entryState.wordSearch = sanitizedWordSearch;
          }
        }

        if (value.cipherChallenge && typeof value.cipherChallenge === "object") {
          const sanitizedCipher = sanitizeStoredCipherChallenge(value.cipherChallenge);
          if (sanitizedCipher) {
            entryState.cipherChallenge = sanitizedCipher;
          }
        }

        if (value.spotDifference && typeof value.spotDifference === "object") {
          const sanitizedSpotDifference = sanitizeStoredSpotDifference(value.spotDifference);
          if (sanitizedSpotDifference) {
            entryState.spotDifference = sanitizedSpotDifference;
          }
        }

        if (value.switchPuzzle && typeof value.switchPuzzle === "object") {
          const sanitizedSwitchPuzzle = sanitizeStoredSwitchPuzzle(value.switchPuzzle);
          if (sanitizedSwitchPuzzle) {
            entryState.switchPuzzle = sanitizedSwitchPuzzle;
          }
        }

        if (value.keypadPath && typeof value.keypadPath === "object") {
          const sanitizedKeypadPath = sanitizeStoredKeypadPath(value.keypadPath);
          if (sanitizedKeypadPath) {
            entryState.keypadPath = sanitizedKeypadPath;
          }
        }

        if (value.memoryGame && typeof value.memoryGame === "object") {
          const sanitizedMemoryGame = sanitizeStoredMemoryGame(value.memoryGame);
          if (sanitizedMemoryGame) {
            entryState.memoryGame = sanitizedMemoryGame;
          }
        }

        if (Object.keys(entryState).length > 0) {
          result[index] = entryState;
        }
      });

      return result;
    }

    function sanitizeStoredWordSearch(candidate) {
      const grid = sanitizeWordSearchGrid(candidate?.grid);
      if (!grid) {
        return null;
      }

      const foundKeys = Array.isArray(candidate?.foundKeys)
        ? candidate.foundKeys.map(key => String(key ?? "").trim()).filter(Boolean)
        : [];

      return { grid, foundKeys };
    }

    function sanitizeStoredCipherChallenge(candidate) {
      if (!candidate || typeof candidate !== "object") {
        return null;
      }

      const completedStepIds = Array.isArray(candidate.completedStepIds)
        ? Array.from(
            new Set(
              candidate.completedStepIds
                .map(stepId => String(stepId ?? "").trim())
                .filter(Boolean)
            )
          )
        : [];

      const inputsSource = candidate.inputs && typeof candidate.inputs === "object" ? candidate.inputs : {};
      const inputs = {};
      Object.entries(inputsSource).forEach(([key, value]) => {
        const sanitizedKey = String(key ?? "").trim();
        if (!sanitizedKey) {
          return;
        }
        inputs[sanitizedKey] = String(value ?? "").trim().slice(0, 64);
      });

      const choicesSource =
        candidate.selectedChoices && typeof candidate.selectedChoices === "object"
          ? candidate.selectedChoices
          : {};
      const selectedChoices = {};
      Object.entries(choicesSource).forEach(([key, value]) => {
        const sanitizedKey = String(key ?? "").trim();
        const sanitizedValue = String(value ?? "").trim();
        if (!sanitizedKey || !sanitizedValue) {
          return;
        }
        selectedChoices[sanitizedKey] = sanitizedValue;
      });

      return {
        completedStepIds,
        inputs,
        selectedChoices
      };
    }

    function sanitizeStoredSpotDifference(candidate) {
      if (!candidate || typeof candidate !== "object") {
        return null;
      }

      const foundDifferenceIds = Array.isArray(candidate.foundDifferenceIds)
        ? Array.from(
            new Set(
              candidate.foundDifferenceIds
                .map(id => String(id ?? "").trim())
                .filter(Boolean)
            )
          )
        : [];

      return { foundDifferenceIds };
    }

    function sanitizeStoredSwitchPuzzle(candidate) {
      if (!candidate || typeof candidate !== "object") {
        return null;
      }

      const rawGridSize = Number(candidate.gridSize);
      const inferredSize = Number.isFinite(rawGridSize) ? Math.round(rawGridSize) : 0;
      const switchesSource = Array.isArray(candidate.switches) ? candidate.switches : [];
      const fallbackSize = Math.max(
        0,
        Math.min(6, Array.isArray(switchesSource) ? switchesSource.length : 0)
      );
      const gridSize = clampNumber(inferredSize || fallbackSize || 3, 2, 6);

      const switches = [];
      for (let row = 0; row < gridSize; row += 1) {
        const rowSource = Array.isArray(switchesSource[row]) ? switchesSource[row] : [];
        const rowData = [];
        for (let col = 0; col < gridSize; col += 1) {
          const rawValue = rowSource[col];
          const isOn = rawValue === 1 || rawValue === true || rawValue === "1" || rawValue === "true";
          rowData.push(isOn ? 1 : 0);
        }
        switches.push(rowData);
      }

      const moveCount = clampNumber(Number(candidate.moveCount) || 0, 0, 9999);

      return { gridSize, switches, moveCount };
    }

    function sanitizeStoredKeypadPath(candidate) {
      if (!candidate || typeof candidate !== "object") {
        return null;
      }

      const currentPath = Array.isArray(candidate.currentPath)
        ? candidate.currentPath
            .map(value => Number(value))
            .filter(value => Number.isInteger(value) && value >= 0 && value <= 99)
            .slice(0, 32)
        : [];

      const isComplete = Boolean(candidate.isComplete);

      return { currentPath, isComplete };
    }

    function sanitizeStoredMemoryGame(candidate) {
      if (!candidate || typeof candidate !== "object") {
        return null;
      }

      const deckSource = Array.isArray(candidate.deck) ? candidate.deck : [];
      const deck = deckSource
        .map(entry => {
          if (!entry || typeof entry !== "object") {
            return null;
          }
          const cardId = String(entry.cardId ?? "").trim();
          const pairId = String(entry.pairId ?? "").trim();
          const face = String(entry.face ?? "").trim().slice(0, 32);
          if (!cardId || !pairId || !face) {
            return null;
          }
          return { cardId, pairId, face };
        })
        .filter(Boolean)
        .slice(0, 64);

      if (deck.length === 0) {
        return null;
      }

      const matchedPairIds = Array.isArray(candidate.matchedPairIds)
        ? Array.from(
            new Set(
              candidate.matchedPairIds
                .map(id => String(id ?? "").trim())
                .filter(Boolean)
            )
          )
        : [];

      return { deck, matchedPairIds };
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

      updateTeamTimer();
    }

    function updateTeamTimer() {
      if (!teamTimerLabel && !teamStartTimeLabel) {
        return;
      }

      if (!state.hasStarted) {
        if (teamTimerLabel) {
          teamTimerLabel.textContent = "Run time: –";
        }
        setTeamStartLabel(null);
        stopTeamTimerTick();
        return;
      }

      const startIso = sanitizeStartTimestamp(state.startTimestamp);
      if (!startIso) {
        if (teamTimerLabel) {
          teamTimerLabel.textContent = "Run time: –";
        }
        setTeamStartLabel(null);
        stopTeamTimerTick();
        return;
      }

      const startDate = new Date(startIso);
      if (Number.isNaN(startDate.getTime())) {
        if (teamTimerLabel) {
          teamTimerLabel.textContent = "Run time: –";
        }
        setTeamStartLabel(null);
        stopTeamTimerTick();
        return;
      }

      ensureTeamTimerTick(startDate, startIso);
      const elapsed = Date.now() - startDate.getTime();
      if (teamTimerLabel) {
        teamTimerLabel.textContent = `Run time: ${formatElapsedDuration(elapsed)}`;
      }
      setTeamStartLabel(startDate);
    }

    function ensureTeamTimerTick(startDate, startIso) {
      if (teamTimerIntervalId !== null) {
        if (teamTimerIsoString === startIso) {
          return;
        }
        stopTeamTimerTick();
      }

      teamTimerStartDate = startDate;
      teamTimerIsoString = startIso;
      setTeamStartLabel(startDate);

      teamTimerIntervalId = window.setInterval(() => {
        if (!teamTimerLabel) {
          stopTeamTimerTick();
          return;
        }

        if (!state.hasStarted) {
          stopTeamTimerTick();
          teamTimerLabel.textContent = "Run time: –";
          setTeamStartLabel(null);
          return;
        }

        const currentStartIso = sanitizeStartTimestamp(state.startTimestamp);
        if (!currentStartIso) {
          stopTeamTimerTick();
          teamTimerLabel.textContent = "Run time: –";
          setTeamStartLabel(null);
          return;
        }

        if (currentStartIso !== teamTimerIsoString) {
          stopTeamTimerTick();
          updateTeamTimer();
          return;
        }

        const elapsed = Date.now() - teamTimerStartDate.getTime();
        teamTimerLabel.textContent = `Run time: ${formatElapsedDuration(elapsed)}`;
        setTeamStartLabel(teamTimerStartDate);
      }, 1000);
    }

    function stopTeamTimerTick() {
      if (teamTimerIntervalId !== null) {
        window.clearInterval(teamTimerIntervalId);
        teamTimerIntervalId = null;
      }
      teamTimerStartDate = null;
      teamTimerIsoString = null;
    }

    function formatElapsedDuration(milliseconds) {
      if (!Number.isFinite(milliseconds) || milliseconds < 0) {
        return "0:00";
      }

      const totalSeconds = Math.floor(milliseconds / 1000);
      const seconds = totalSeconds % 60;
      const minutes = Math.floor(totalSeconds / 60) % 60;
      const hours = Math.floor(totalSeconds / 3600);

      const parts = [];
      if (hours > 0) {
        parts.push(String(hours));
        parts.push(String(minutes).padStart(2, "0"));
      } else {
        parts.push(String(minutes));
      }
      parts.push(String(seconds).padStart(2, "0"));
      return parts.join(":");
    }

    function setTeamStartLabel(date) {
      if (!teamStartTimeLabel) {
        return;
      }
      if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
        teamStartTimeLabel.textContent = "Started: –";
        return;
      }
      teamStartTimeLabel.textContent = `Started: ${formatStartTimestamp(date)}`;
    }

    function formatStartTimestamp(date) {
      if (!(date instanceof Date)) {
        return "–";
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
        const usesInteractiveAnswer = puzzleUsesInteractiveAnswer(puzzle);
        puzzleTitle.textContent = puzzleName;
        puzzleMeta.textContent = `${TEAM_NAMES[state.teamId]} • Puzzle ${stepNumber} of ${PUZZLE_COUNT}`;
        if (puzzle?.cipherChallenge) {
          renderCipherChallenge(puzzleBody, {
            puzzleIndex: currentSolving,
            cipherChallenge: puzzle.cipherChallenge,
            prompt: puzzle.prompt,
            onSolved: () => completePuzzleSolve({ puzzleIndex: currentSolving })
          });
        } else if (puzzle?.spotDifference) {
          renderSpotDifferencePuzzle(puzzleBody, {
            puzzleIndex: currentSolving,
            spotDifference: puzzle.spotDifference,
            prompt: puzzle.prompt,
            onSolved: () => completePuzzleSolve({ puzzleIndex: currentSolving })
          });
        } else if (puzzle?.switchPuzzle) {
          renderSwitchPuzzle(puzzleBody, {
            puzzleIndex: currentSolving,
            switchPuzzle: puzzle.switchPuzzle,
            prompt: puzzle.prompt,
            onSolved: () => completePuzzleSolve({ puzzleIndex: currentSolving })
          });
        } else if (puzzle?.keypadPath) {
          renderKeypadPathPuzzle(puzzleBody, {
            puzzleIndex: currentSolving,
            keypadPath: puzzle.keypadPath,
            prompt: puzzle.prompt,
            onSolved: () => completePuzzleSolve({ puzzleIndex: currentSolving })
          });
        } else if (puzzle?.memoryGame) {
          renderMemoryGamePuzzle(puzzleBody, {
            puzzleIndex: currentSolving,
            memoryGame: puzzle.memoryGame,
            prompt: puzzle.prompt,
            onSolved: () => completePuzzleSolve({ puzzleIndex: currentSolving })
          });
        } else if (puzzle?.wordSearch) {
          const handleWordSearchSolved = () => {
            const solvingIndex = getCurrentSolvingIndex();
            if (solvingIndex !== currentSolving) {
              return null;
            }

            if (usesInteractiveAnswer) {
              try {
                const completion = completePuzzleSolve({ puzzleIndex: currentSolving });
                if (completion && typeof completion.catch === "function") {
                  completion.catch(error => {
                    console.error("Puzzle completion failed", error);
                  });
                }
                return completion;
              } catch (error) {
                console.error("Puzzle completion failed", error);
                return null;
              }
            }

            if (!answerInput || answerInput.disabled) {
              return null;
            }

            const expectedAnswer = puzzle.answer ?? "";
            if (!expectedAnswer) {
              return null;
            }

            answerInput.value = expectedAnswer;

            try {
              const submission = submitPuzzleAnswer();
              if (submission && typeof submission.catch === "function") {
                submission.catch(error => {
                  console.error("Auto submission failed", error);
                });
              }
              return submission;
            } catch (error) {
              console.error("Auto submission failed", error);
              return null;
            }
          };

          renderWordSearchPuzzle(puzzleBody, {
            puzzleIndex: currentSolving,
            wordSearch: puzzle.wordSearch,
            prompt: puzzle.prompt,
            onSolved: handleWordSearchSolved
          });
        } else {
          if (usesInteractiveAnswer) {
            puzzleBody.textContent = puzzle?.prompt ?? "Complete the puzzle to continue.";
          } else {
            puzzleBody.textContent = puzzle?.prompt ?? "Puzzle intel loading.";
          }
        }
        if (usesInteractiveAnswer) {
          setPuzzleFeedback("Complete the puzzle to unlock the next destination.");
        } else {
          setPuzzleFeedback("Enter the correct answer to unlock the next destination.");
        }
        scanButton.disabled = false;
        scanButton.textContent = "Scan QR Code";
        if (pendingPuzzleUnlockIndex === currentSolving) {
          setPuzzleLockState("unlocking", { message: `Unlocked • ${puzzleName}` });
          pendingPuzzleUnlockIndex = null;
        } else {
          setPuzzleLockState("hidden");
        }
        toggleAnswerForm(!usesInteractiveAnswer);
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
      state.startTimestamp = new Date().toISOString();
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

      const puzzle = puzzles[solvingIndex];
      if (!puzzleUsesTextAnswer(puzzle)) {
        setPuzzleFeedback("Solve the interactive challenge to continue. No text answer needed here.", "error");
        return;
      }

      const guess = answerInput.value.trim();
      if (!guess) {
        setPuzzleFeedback("Enter an answer before submitting.", "error");
        answerInput.focus();
        return;
      }

      const normalizedGuess = normalizeAnswer(guess);
      const expectedAnswer = normalizeAnswer(String(puzzle?.answer ?? ""));

      if (expectedAnswer && normalizedGuess !== expectedAnswer) {
        await runAnswerOverlay({ status: "incorrect", floorName: puzzle.floor });
        setPuzzleFeedback("That answer isn't correct yet. Keep trying.", "error");
        answerInput.select();
        return;
      }

      await completePuzzleSolve({ puzzleIndex: solvingIndex });
    }

    async function completePuzzleSolve({ puzzleIndex, skipOverlay = false } = {}) {
      if (!Number.isInteger(puzzleIndex)) {
        return false;
      }

      const sanitizedIndex = clampNumber(puzzleIndex, 0, PUZZLE_COUNT - 1);

      if (state.completions[sanitizedIndex]) {
        return true;
      }

      const puzzle = puzzles[sanitizedIndex] ?? null;

      if (!skipOverlay) {
        await runAnswerOverlay({ status: "correct", floorName: puzzle?.floor });
      }

      if (answerInput) {
        answerInput.value = "";
      }

      clearPuzzleInteractiveState(sanitizedIndex, { save: false });

      state.unlocked[sanitizedIndex] = true;
      state.completions[sanitizedIndex] = true;
      const nextIndex = revealNextDestination();
      state.hasWon = nextIndex === null;
      saveState();
      render();

      if (Number.isInteger(nextIndex)) {
        triggerFloorTransition({ fromIndex: sanitizedIndex, toIndex: nextIndex });
      }

      const currentLabel = puzzle?.floor ?? `Puzzle ${sanitizedIndex + 1}`;
      const parts = [`${currentLabel} solved!`];

      if (Number.isInteger(nextIndex)) {
        const nextPuzzle = puzzles[nextIndex];
        const nextLabel = nextPuzzle?.floor ?? `Puzzle ${nextIndex + 1}`;
        parts.push(`Next mission revealed: ${nextLabel}.`);
      } else {
        parts.push("All missions complete!");
      }

      const summary = parts.join(" ");
      setPuzzleFeedback(summary, "success");
      showStatus(summary, "success");

      if (Number.isInteger(nextIndex)) {
        triggerConfetti({ theme: "solve", pieces: 130, spread: 10 });
      } else {
        triggerConfetti({ theme: "finale", pieces: 180, spread: 16 });
        window.setTimeout(() => {
          try {
            window.location.replace("/win.html");
          } catch (err) {
            // ignore navigation errors
          }
        }, 200);
      }

      return true;
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

    function getPuzzleAnswerType(puzzle) {
      if (!puzzle || puzzle.answerType === ANSWER_TYPES.TEXT) {
        return ANSWER_TYPES.TEXT;
      }
      return puzzle.answerType === ANSWER_TYPES.PUZZLE ? ANSWER_TYPES.PUZZLE : ANSWER_TYPES.TEXT;
    }

    function puzzleUsesTextAnswer(puzzle) {
      return getPuzzleAnswerType(puzzle) === ANSWER_TYPES.TEXT;
    }

    function puzzleUsesInteractiveAnswer(puzzle) {
      return getPuzzleAnswerType(puzzle) === ANSWER_TYPES.PUZZLE;
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

    setupDashboardDebugApi();
    initialize();
