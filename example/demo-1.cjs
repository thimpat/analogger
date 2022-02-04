const {LOG_CONTEXT, LOG_TARGETS} = require("./contexts-def.cjs")
const QuickLog = require("../src/cjs/quick-log");


QuickLog.setContexts(LOG_CONTEXT);
QuickLog.setTargets(LOG_TARGETS);

QuickLog.log(`Basic Log example`);
QuickLog.log({context: LOG_CONTEXT.STANDARD, target: LOG_TARGETS.DEV}, `Basic Log example`);
QuickLog.log({context: LOG_CONTEXT.TEST, target: LOG_TARGETS.DEV}, `Test Log example`);