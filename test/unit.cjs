const chai = require("chai");
const expect = chai.expect;
const spies = require('chai-spies');

chai.use(spies);
// sut
const {anaLogger} = require("../src/cjs/ana-logger.cjs");
const {LOG_CONTEXT} = require("../example/cjs/contexts-def.cjs");

describe('AnaLogger', function ()
{
    const LOG_CONTEXT = {STANDARD: {}, TEST: {color: "#B18904", symbol: "⏰"}, C1: null, C2: null, C3: null, DEFAULT: {}}
    const LOG_TARGETS = {ALL: "ALL", DEV1: "TOM", DEV2: "TIM", DEV3: "ME", USER: "USER"}

    before(() =>
    {
        anaLogger.setContexts(LOG_CONTEXT);
        anaLogger.setTargets(LOG_TARGETS);
        anaLogger.setActiveTarget(LOG_TARGETS.DEV3)
    })

    beforeEach(() =>
    {
        anaLogger.resetLogHistory()
        anaLogger.keepLogHistory()
    })

    describe('#log()', function ()
    {
        it('should emulate console.log', function ()
        {
            // Arrange
            anaLogger.setOptions({silent: false, hideError: false})

            // Act
            anaLogger.log(`Test Log example C1`);
            const output = anaLogger.getLogHistory()

            // Assert
            expect(output).to.contain(`Test Log example C1`)
        });
    });

    describe('#assert()', function ()
    {
        it('should evaluate condition expressions', function ()
        {
            const result = anaLogger.assert(1 === 1)
            expect(result).to.be.true
        });

        it('should detect failing condition expressions', function ()
        {
            const result = anaLogger.assert(1 === 2)
            expect(result).to.be.false
        });

        it('should evaluate function expressions', function ()
        {
            const result = anaLogger.assert(() => true, true)
            expect(result).to.be.true
        });

        it('should evaluate more complex function expressions', function ()
        {
            const result = anaLogger.assert((a, b) => a === b, true, 2, 2)
            expect(result).to.be.true
        });
    });

    describe('#alert()', function ()
    {
        it('should not fail on alert', function ()
        {
            anaLogger.alert(`Hello from alert`, {aaa: 1012})
            expect(anaLogger.getLogHistory()).to.contain(`Hello from alert`)
        });
    });

    describe('#setLogFormat()', function ()
    {
        /**
         * We use a spy here, but things would have been straightforward with a simple "done" + async on the "it"
         */
        it('should replace the default formatter function with the given callback when invoking console.log', function ()
        {
            // Arrange
            const methodToCall = {
                myMethod: () => { }
            }

            // Spy on methodToCall.myMethod to check it has been called
            chai.spy.on(methodToCall, 'myMethod');

            anaLogger.setLogFormat(
                methodToCall.myMethod
            );

            console.log(LOG_CONTEXT.C1, `Test Log example C4 with new format`);
            expect(methodToCall.myMethod).to.have.been.called;
        });
    });


});