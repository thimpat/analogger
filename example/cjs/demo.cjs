const {LOG_CONTEXT, LOG_TARGETS} = require("./contexts-def.cjs")
const {anaLogger} = require("../../dist/index-cjs.min.cjs");

anaLogger.setContexts(LOG_CONTEXT);
anaLogger.setTargets(LOG_TARGETS);
anaLogger.setOptions({silent: false, hideError: false})

console.log("==========================");
anaLogger.log(LOG_CONTEXT.C1, `Test Log example C1`);
anaLogger.log(LOG_CONTEXT.C2, `Test Log example C2`);
anaLogger.log(LOG_CONTEXT.C3, `Test Log example C3`);

console.log(`Log Before override`);
anaLogger.overrideConsole()
console.log(`Log After override`);
console.error(`Error Before override`);
anaLogger.overrideError()
console.error(`Error After override`);
console.log("==========================");

anaLogger.log(LOG_CONTEXT.STANDARD, `Basic Log example 2`, "+Something 0", "+Something 1");
anaLogger.log({context: LOG_CONTEXT.TEST, lid: 100000}, `Test Log example`);
anaLogger.log(LOG_CONTEXT.TEST, `Test Log example`, "+Something 3");
anaLogger.log(LOG_CONTEXT.C1, `Test Log example C1`);
anaLogger.log(LOG_CONTEXT.C2, `Test Log example C2`);
anaLogger.log(LOG_CONTEXT.C3, `Test Log example C3`);

console.log(LOG_CONTEXT.C1, `Test Log example C4`);
console.log(LOG_CONTEXT.C1, `Test Log example C5`);
console.log(LOG_CONTEXT.C1, `Test Log example C6`);

console.error({context: LOG_CONTEXT.ERROR, lid: 200000}, `Testing Error 1`)
console.error(LOG_CONTEXT.ERROR, `Testing Error 2`)
console.error(`Testing Error 3`)
console.error(undefined, `Testing Error 4`)

console.error({context: LOG_CONTEXT.ERROR, target: LOG_TARGETS.USER, lid: 200010}, `Testing Error 4`)

anaLogger.alert(`Hello from alert`, {aaa: 1012})

anaLogger.setErrorHandlerForUserTarget(function (context/*, ...args*/)
{
    if (context.environnment === anaLogger.ENVIRONMENT_TYPE.BROWSER)
    {
        alert(`Users explicitly see this message`)
    }
})

console.error({context: LOG_CONTEXT.ERROR, target: LOG_TARGETS.USER, lid: 200020}, `Testing Error that triggers a special handler`)

anaLogger.setLogFormat(
    function({contextName, message})
    {
        return `${contextName}: ${message}`
    }
);

console.log(LOG_CONTEXT.C1, `Test Log example C4 with new format`);
console.log(LOG_CONTEXT.C1, `Test Log example C5 with new format`);
console.log(LOG_CONTEXT.C1, `Test Log example C6 with new format`);

anaLogger.log(`Basic Log example 1`);