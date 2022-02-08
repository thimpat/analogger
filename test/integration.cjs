const chai = require("chai");
var capcon = require('capture-console');
const {anaLogger} = require("../src/cjs/ana-logger.cjs");
const {LOG_CONTEXT, LOG_TARGETS} = require("../example/cjs/contexts-def.cjs");
const expect = chai.expect;

describe('In the Terminal', function ()
{
    const {anaLogger} = require("../src/cjs/ana-logger.cjs");

    const LOG_CONTEXT = {STANDARD: {}, TEST: {color: "#B18904", symbol: "⏰"}, C1: null, C2: null, C3: null, DEFAULT: {}}
    const LOG_TARGETS = {ALL: "ALL", DEV1: "TOM", DEV2: "TIM", DEV3: "ME", USER: "USER"}

    before(()=>
    {
        anaLogger.setContexts(LOG_CONTEXT);
        anaLogger.setTargets(LOG_TARGETS);
    })

    beforeEach(()=>
    {
        anaLogger.resetLogHistory()
        anaLogger.keepLogHistory()
        anaLogger.setOptions({silent: false, hideError: false})
        anaLogger.removeOverride()
        anaLogger.removeOverrideError()
    })

    describe('AnaLogger', function ()
    {
        it('should emulate console.log', function ()
        {
            const captured = capcon.captureStdio(function ()
            {
                anaLogger.log(`Test Log example C1`);
            })

            expect(captured.stdout).to.contain(`Test Log example C1`)
        });

        it('should display some text with colours', function ()
        {
            const captured = capcon.captureStdio(function ()
            {
                anaLogger.log(LOG_CONTEXT.C1, `Test Log example C1`);
            })

            expect(captured.stdout).to.contain(`[38;2;255;228;181m`)
        });

        it('should hide console output when the console behaviour is overridden', function ()
        {
            const captured = capcon.captureStdio(function ()
            {
                console.log(`Log Before override`);
                anaLogger.setOptions({silent: true})
                anaLogger.overrideConsole()
                console.log(`Log After override`);
            })

            expect(captured.stdout).to.contain(`Log Before override`)
            expect(captured.stdout).to.not.contain(`Log After override`)
        });

        it('should hide console output but keep console input in the log history', function ()
        {
            const captured1 = capcon.captureStdio(function ()
            {
                anaLogger.keepLogHistory()
                anaLogger.setOptions({silent: true, hideError: false})
                anaLogger.log(LOG_CONTEXT.C1, `Test Log example something again`);
            })

            const captured2 = capcon.captureStdio(function ()
            {
                console.log(anaLogger.getLogHistory())
            })

            expect(captured1.stdout).to.not.contain(`Test Log example something again`)
            expect(captured2.stdout).to.contain(`Test Log example something again`)
        });

        it('should hide console error when the console behaviour is overridden', function ()
        {
            const captured = capcon.captureStdio(function ()
            {
                console.log(`Log Before override`);
                anaLogger.setOptions({hideError: true})
                anaLogger.overrideConsole()

                console.error(`Error Before override`);
                anaLogger.overrideError()
                console.error(`Error After override`);

                console.log(`Log After override`);
            })

            expect(captured.stdout).to.contain(`Log Before override`)
            expect(captured.stdout).to.not.contain(`Error After override`)
        });

        it('should not show unrelated target logs', function ()
        {
            const captured = capcon.captureStdio(function ()
            {
                anaLogger.setActiveTarget(LOG_TARGETS.DEV3)
                anaLogger.log({context: LOG_CONTEXT.TEST, target: LOG_TARGETS.DEV3, lid: 100001}, `Test Log example with active target`);
                anaLogger.log({context: LOG_CONTEXT.TEST, target: LOG_TARGETS.DEV1, lid: 100002}, `Test Log example with DEV1 target`);
                anaLogger.log(`Test Log example with DEFAULT target`);
            })

            expect(captured.stdout).to.contain(`Test Log example with active target`)
            expect(captured.stdout).to.contain(`Test Log example with DEFAULT target`)
            expect(captured.stdout).to.not.contain(`Test Log example with DEV1 target`)
        });


    });
});