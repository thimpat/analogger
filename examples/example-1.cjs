
const {anaLogger, DEFAULT_LOG_LEVELS, DEFAULT_LOG_TARGETS} = require("../src/ana-logger.cjs");

/**
 * Who can see logs
 * @type {string[]}
 */
const LOG_TARGETS = ["DEVS", "TESTERS", "ME"];
anaLogger.setTargets(LOG_TARGETS);


/**
 * How to display and who can see them logs
 * Every context has a target by default (target = "ALL")
 */
const LOG_CONTEXTS = {
    STANDARD: {},

    /**
     * This context has a "TESTERS" as target. Only the TESTERS target will be able to see it.
     *
     * For instance, here, only a TESTERS target can see it.
     * anaLogger.log(TEST, "You should not see this C1");
     */
    TEST: {color: "#B18904", symbol: "⏰", target: "TESTERS"},

    /**
     * Every context has a target by default. If you don't set one, "ALL" will be the default
     */
    TEST2: {color: "rgb(127, 127, 127)", symbol: "⏰"},
    TEST3: {color: "blue", symbol: "⏰"},
    C1: {color: "#B18904", symbol: "⏰", target: "DEV2"},
    C2: {color: "#B18904", symbol: "⏰", target: DEFAULT_LOG_TARGETS.USER},
    C3: {color: "#B18904", symbol: "⏰", target: "USER"},
    C4: {color: "#B18904", symbol: "⏰", target: "ME"},
    C5: {color: "#B18904", symbol: "⏰", target: LOG_TARGETS.ME},
    C6: {color: "#B18904", symbol: "⏰", target: DEFAULT_LOG_TARGETS.ALL},
    C7: {color: "#B18904", symbol: "⏰"},
    INFO: {},
    DEFAULT: {},
};
anaLogger.setContexts(LOG_CONTEXTS);
anaLogger.setActiveTarget("ME");

anaLogger.setOptions({requiredLogLevel: DEFAULT_LOG_LEVELS.LOG, logToRemote: true});

anaLogger.keepLogHistory();

// anaLogger.setOptions({logToDom: ".analogger"});
// anaLogger.setOptions({silent: true});

console.log("==========================");
anaLogger.log(LOG_CONTEXTS.C1, "You should not see this C1");   // Because the target is "DEV2"
anaLogger.log(LOG_CONTEXTS.C2, "You should not see this C2");   // Because the target is DEFAULT_LOG_TARGETS.USER ("USER")
anaLogger.log(LOG_CONTEXTS.C3, "You should not see this C3");   // Because the target is "USER"

// anaLogger.setOptions({silent: false, hideError: false, logToFile: "./logme.log"});
anaLogger.log(LOG_CONTEXTS.C4, "You should see this C100");     // Because the target is "ME"
anaLogger.log(LOG_CONTEXTS.C5, "You should see this C200");     // Because the target is "ME"
anaLogger.log(LOG_CONTEXTS.C6, "You should see this C300");     // Because the target is "ALL"
anaLogger.log(LOG_CONTEXTS.C7, "You should see this C300");     // Because there is no target

// console.log("============= From History ===========================");
// console.log(anaLogger.getLogHistory());
// console.log("============= From History (Closed) ==================");

anaLogger.assert(LOG_CONTEXTS.TEST, 1 === 1);
anaLogger.assert(LOG_CONTEXTS.TEST, 1 === 2);
anaLogger.assert(() => true, true);

anaLogger.assert((a, b) => a === b, true, 2, 2);

console.log("-------------------------- console.log is about to be overridden");
anaLogger.overrideConsole();
console.log("Log After override <= Console.log is overridden");
console.error("-------------------------- console.error is about to be overridden");
anaLogger.overrideError();
console.error("Hook on Error placed after override <= Console.error is also overridden");
console.log("==========================");



anaLogger.setDefaultContext({color: "gray", symbol: "check", contextName: "SOME"});

anaLogger.log({lid: 100000}, "Test Log example C1");
anaLogger.log({lid: 100010}, "Test Log example C2");
anaLogger.log({lid: 100020}, "Test Log example C3");

anaLogger.log({contextName: "LOG", lid: 100020, symbol: "cross"}, "Test Log example C4");
anaLogger.log({contextName: "INFO", lid: 100020, symbol: "no_entry"}, "Test Log example C4");
anaLogger.log({contextName: "WARN", lid: 100020, symbol: "raised_hand"}, "Test Log example C4");

anaLogger.log({contextName: "TEST2", lid: 100020, symbol: "raised_hand", color: "yellow"}, "Test Log example C4");
anaLogger.log({contextName: "LOG"}, "Test Log example C4");


anaLogger.setTargets({DEV1: "192.168.12.45", DEV: "192.168.12.46"});
anaLogger.setActiveTarget("192.168.12.45");
anaLogger.log({target: "192.168.12.45"}, "Nice IP");
anaLogger.log({target: "192.168.12.46"}, "Not Nice");
