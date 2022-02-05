const {LOG_CONTEXT, LOG_TARGETS} = require("./contexts-def.cjs")
const QuickLog = require("../../src/cjs/quick-log.cjs");
const {addSomething} = require("my-project");

QuickLog.setContexts(LOG_CONTEXT);
QuickLog.setTargets(LOG_TARGETS);

// QuickLog.setFormat(
//     function({contextName, id, message})
//     {
//         return `${contextName}: (${id}) ${message}`
//     }
// );

const result = addSomething(4, 5)

QuickLog.log(LOG_CONTEXT.STANDARD012345678, `Basic Log example 2`, "+Something 0", "+Something 1");
QuickLog.log({context: LOG_CONTEXT.TEST, lid: 100000}, `Test Log example`);
QuickLog.log(LOG_CONTEXT.TEST, `Test Log example`, "+Something 3");
QuickLog.log(LOG_CONTEXT.C1, `Test Log example C1`);
QuickLog.log(LOG_CONTEXT.C2, `Test Log example C2`);
QuickLog.log(LOG_CONTEXT.C3, `Test Log example C3`);
QuickLog.log(`Basic Log example 1`);
// alert(result)
