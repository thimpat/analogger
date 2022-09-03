import {anaLogger}  from "../browser/src/ana-logger.mjs";

const LOG_TARGETS = {ALL: "ALL", DEV1: "TOM", DEV2: "TIM", DEV3: "ME", USER: "USER"};

const LOG_CONTEXTS = {
    STANDARD: {},
    TEST: {color: "#B18904", symbol: "⏰"},
    TEST2: {color: "rgb(127, 127, 127)", symbol: "⏰"},
    TEST3: {color: "blue", symbol: "⏰"},
    C1: {target: LOG_TARGETS.DEV1},
    C2: null,
    C3: {},
    INFO: {},
    DEFAULT: {}
};

anaLogger.keepLogHistory();

anaLogger.setTargets(LOG_TARGETS);
anaLogger.setContexts(LOG_CONTEXTS);

anaLogger.setActiveTarget("TIM");
anaLogger.setOptions({logToDom: ".analogger"});
// anaLogger.setOptions({silent: true});

console.log("==========================");

anaLogger.log(LOG_CONTEXTS.C1, "You should not see this C1");   // Because the target here is LOG_TARGETS.DEV1 => "TOM"
anaLogger.log(LOG_CONTEXTS.C2, "You should not see this C2");   // By default, context with no target is "ALL"
anaLogger.log(LOG_CONTEXTS.C3, "You should not see this C3");

anaLogger.setOptions({silent: false, hideError: false, logToFile: "./logme.log"});
anaLogger.log(LOG_CONTEXTS.C1, "You should not see this C100");
anaLogger.log(LOG_CONTEXTS.C2, "You should see this C200");
anaLogger.log({...LOG_CONTEXTS.C3, ...{color: "white"}}, "You should see this C300");

// console.log("============= From History ===========================");
// console.log(anaLogger.getLogHistory());
// console.log("============= From History (Closed) ==================");

anaLogger.assert(1 === 1);
anaLogger.assert(1 === 2);
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
