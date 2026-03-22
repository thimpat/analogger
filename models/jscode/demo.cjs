const {LOG_CONTEXTS, LOG_TARGETS} = require("./contexts-def.cjs");
const {anaLogger} = require("../../src/ana-logger.cjs");

(async function () {

    anaLogger.keepLogHistory();

    anaLogger.setContexts(LOG_CONTEXTS);
    anaLogger.setTargets(LOG_TARGETS);
    anaLogger.setActiveTarget(LOG_TARGETS.DEV3);
    anaLogger.setOptions({logToDom: ".analogger"});
    anaLogger.setOptions({silent: true});

    console.log("==========================");
    anaLogger.log(LOG_CONTEXTS.C1, "You should not see this C1");
    anaLogger.log(LOG_CONTEXTS.C2, "You should not see this C2");
    anaLogger.log(LOG_CONTEXTS.C3, "You should not see this C3");

    anaLogger.setOptions({silent: false, hideError: false, logToFile: "./logme.log"});
    anaLogger.log(LOG_CONTEXTS.C1, "You should see this C100");
    anaLogger.log(LOG_CONTEXTS.C2, "You should see this C200");
    anaLogger.log(LOG_CONTEXTS.C3, "You should see this C300");

    console.log("============= From History ===========================");
    console.log(anaLogger.getLogHistory());
    console.log("============= From History (Closed) ==================");

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

    // ---------------------------------------------------
    // Only clears the screen, so we won't see the previous log
    // ---------------------------------------------------

    await new Promise(resolve => setTimeout(resolve, 1000));

    anaLogger.log({lid: "API_001", only: ["API", "WEB"]}, "matches API");   // clears, prints
    anaLogger.log({lid: "WEB_002"}, "matches WEB – no only needed");         // enforced, prints
    anaLogger.log({lid: "DB_003"}, "blocked");                              // suppressed

    anaLogger.log({lid: "DB_001", only: ["DB"]}, "switches filter");

    anaLogger.log({lid: "API", only: "API"}, "This matches");
    anaLogger.log({lid: "API_123"}, "This shows API_123");
    anaLogger.log({lid: "WEB_456"}, "This is blocked");


    anaLogger.log({lid: "API", only: "API"}, "This matches");
    anaLogger.log({lid: "API", only: ""}, "This matches");
    // → clears terminal/browser, then prints the log

    anaLogger.log({lid: "API_123"}, "This shows");
    // → no local only on this call, passes straight through

    anaLogger.log({lid: "WEB_456", only: "API"}, "This is blocked");
    // → "WEB_456".includes("API") is false → suppressed silently

    anaLogger.log({lid: "WEB_456", only: null}, "Cancel the functionality");

    // ---------------------------------------------------
    // Check Orders
    // ---------------------------------------------------
    anaLogger.log({lid: "API", order: 1}, "I'm first");
    anaLogger.log({lid: "WEB_456", order: 35}, "I'm last");
    anaLogger.log({lid: "API_123", order: 2}, "I'm second");


    // ---------------------------------------------------
    // Check Max Seen
    // ---------------------------------------------------
    anaLogger.log({lid: "API", maxSeen: 1}, "I'm first");   // OK — seen 1 time
    anaLogger.log({lid: "API", maxSeen: 1}, "I'm second");  // Warning — seen 2 times
    anaLogger.log({lid: "API", maxSeen: 1}, "I'm third");   // Warning — seen 3 times

}());

