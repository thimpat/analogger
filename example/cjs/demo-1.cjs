const {LOG_CONTEXT, LOG_TARGETS} = require("./contexts-def.cjs")
const QuickLog = require("../../src/cjs/quick-log.cjs");
const {addSomething} = require("my-project");

QuickLog.setContexts(LOG_CONTEXT);
QuickLog.setTargets(LOG_TARGETS);

QuickLog.setOptions({silent: false, hideError: false})

QuickLog.overrideConsole()
QuickLog.overrideError()

const result = addSomething(4, 5)
console.log(result)

QuickLog.log(LOG_CONTEXT.STANDARD012345678, `Basic Log example 2`, "+Something 0", "+Something 1");
QuickLog.log({context: LOG_CONTEXT.TEST, lid: 100000}, `Test Log example`);
QuickLog.log(LOG_CONTEXT.TEST, `Test Log example`, "+Something 3");
QuickLog.log(LOG_CONTEXT.C1, `Test Log example C1`);
QuickLog.log(LOG_CONTEXT.C2, `Test Log example C2`);
QuickLog.log(LOG_CONTEXT.C3, `Test Log example C3`);

console.log(LOG_CONTEXT.C1, `Test Log example C4`);
console.log(LOG_CONTEXT.C1, `Test Log example C5`);
console.log(LOG_CONTEXT.C1, `Test Log example C6`);

console.error({context: LOG_CONTEXT.ERROR, lid: 200000}, `Testing Error 1`)
console.error(LOG_CONTEXT.ERROR, `Testing Error 2`)
console.error(`Testing Error 3`)
console.error(undefined, `Testing Error 4`)

QuickLog.setLogFormat(
    function({contextName, message})
    {
        return `${contextName}: ${message}`
    }
);

console.log(LOG_CONTEXT.C1, `Test Log example C4 with new format`);
console.log(LOG_CONTEXT.C1, `Test Log example C5 with new format`);
console.log(LOG_CONTEXT.C1, `Test Log example C6 with new format`);

QuickLog.log(`Basic Log example 1`);
// alert(result)
