const {LOG_CONTEXTS, LOG_TARGETS} = require("./contexts-def.cjs");
const {anaLogger} = require("../../src/cjs/ana-logger.cjs");

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

anaLogger.log(LOG_CONTEXTS.STANDARD, "Basic Log example 2", "+Something 0", "+Something 1");

anaLogger.log({context: LOG_CONTEXTS.TEST, lid: 100000}, "Test Log example");
anaLogger.log({
    context: LOG_CONTEXTS.TEST,
    target : LOG_TARGETS.DEV3,
    lid    : 100001
}, "Test Log example with active target");
anaLogger.log({context: LOG_CONTEXTS.TEST, target: LOG_TARGETS.DEV1, lid: 100002}, "Test Log example with DEV1 target");
anaLogger.log({context: LOG_CONTEXTS.TEST, target: LOG_TARGETS.DEV2, lid: 100003}, "Test Log example with DEV2 target");
anaLogger.log("Test Log example with DEFAULT target");

anaLogger.log(LOG_CONTEXTS.TEST, "Test Log example", "+Something 3");
anaLogger.log(LOG_CONTEXTS.C1, "Test Log example C1");
anaLogger.log(LOG_CONTEXTS.C2, "Test Log example C2");
anaLogger.log(LOG_CONTEXTS.C3, "Test Log example C3");

console.log(LOG_CONTEXTS.C1, "Test Log example C4");
console.log(LOG_CONTEXTS.C1, "Test Log example C5");
console.log(LOG_CONTEXTS.C1, "Test Log example C6");

console.error({context: LOG_CONTEXTS.ERROR, lid: 200000}, "Testing Error 1");
console.error(LOG_CONTEXTS.ERROR, "Testing Error 2");
console.error("Testing Error 3");
console.error(undefined, "Testing Error 4");

console.error({context: LOG_CONTEXTS.ERROR, target: LOG_TARGETS.USER, lid: 200010}, "Testing Error 4");


anaLogger.info("Hello from alert", {aaa: 1012});

anaLogger.setActiveTarget(LOG_TARGETS.USER);
anaLogger.setErrorHandlerForUserTarget(function (context/*, ...args*/)
{
    anaLogger.log("User explicitly see this message");
    anaLogger.info("User explicitly see this message", context);
});

console.error({
    context: LOG_CONTEXTS.ERROR,
    target : LOG_TARGETS.USER,
    lid    : 200020
}, "Testing Error that triggers a special handler");

anaLogger.setLogFormat(
    function({contextName, message})
    {
        return `${contextName}: ${message}`;
    }
);

console.log(LOG_CONTEXTS.C1, "Test Log example C4 with new format");
console.log(LOG_CONTEXTS.C1, "Test Log example C5 with new format");
console.log(LOG_CONTEXTS.C1, "Test Log example C6 with new format");

anaLogger.log("Basic Log example 1");
