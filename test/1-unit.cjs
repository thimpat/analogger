const chai = require("chai");

const expect = chai.expect;
const sinon = require("sinon");

const spies = require("chai-spies");
const assertArrays = require("chai-arrays");

const jsDom = require("jsdom-global");

// Arrange
const myStub = {
    myMethod: () =>
    {
        process.stdout.write("");
    },
};

let alert = null;

chai.use(spies);
chai.use(assertArrays);

const {sleep} = require("@thimpat/testutils");
const {LOG_CONTEXTS, LOG_TARGETS} = require("../models/jscode/contexts-def.cjs");

// sut
/** to-esm-all: remove **/
const {SYSTEM} = require("../src/constants.cjs");
const {anaLogger} = require("../src/ana-logger.cjs");
/** to-esm-all: end-remove **/

/** to-esm-esm: add
 import {SYSTEM} from "../esm/constants.mjs";
 import {anaLogger} from "../esm/ana-logger.mjs";
 **/

describe("AnaLogger for CommonJs", function ()
{

    before(() =>
    {
        anaLogger.setContexts(LOG_CONTEXTS);
        anaLogger.setDefaultContext({color: "#564"});
        anaLogger.setTargets(LOG_TARGETS);
        anaLogger.setActiveTarget(LOG_TARGETS.DEV3);
        anaLogger.removeOverride({error: true});
    });

    after(() =>
    {
    });

    beforeEach(() =>
    {
        alert = sinon.spy();
        chai.spy.on(myStub, "myMethod");

        anaLogger.resetLogHistory();
        anaLogger.keepLogHistory();
        anaLogger.resetLogFormatter();
    });

    afterEach(() =>
    {
        chai.spy.restore(myStub.myMethod);
    });

    describe("#isContextValid()", function ()
    {
        it("should be true when a valid context object is passed", function ()
        {
            // Arrange
            const context = LOG_CONTEXTS.TEST;
            // Act
            const result = anaLogger.isContextValid(context);
            // Assert
            expect(result).to.be.true;
        });

        it("should be false when an invalid context object is passed", function ()
        {
            // Arrange
            const context = {};
            // Act
            const result = anaLogger.isContextValid(context);
            // Assert
            expect(result).to.be.false;
        });

        it("should be false when a null context is passed", function ()
        {
            // Act
            const result = anaLogger.isContextValid(null);
            // Assert
            expect(result).to.be.false;
        });
    });

    describe("#setOptions()", function ()
    {
        it("should have an option to silent the log", function ()
        {
            anaLogger.setOptions({silent: true});
            const options = anaLogger.getOptions();
            expect(options.hideLog).to.be.true;
        });

        it("should throw an exception when called with no parameter", function ()
        {
            chai.expect(() => anaLogger.setOptions()).to.throw("Cannot read properties of null (reading 'contextLenMax')");
        });
    });

    describe("#log()", function ()
    {
        it("should emulate console.log", function ()
        {
            // Arrange
            anaLogger.setOptions({silent: false, hideError: false});

            // Act
            anaLogger.log("Test Log example C1");
            const output = anaLogger.getLogHistory();

            // Assert
            expect(output).to.contain("Test Log example C1");
        });

        it("should display objects with circular references without raising exceptions", function ()
        {
            const circularReference = {otherData: 123};
            circularReference.myself = circularReference;

            // Act
            anaLogger.log(LOG_CONTEXTS.DEFAULT, circularReference);

            // Assert
            expect(anaLogger.getLogHistory()).to.contain("[{\"otherData\":123,\"myself\":\"0\"}]");
        });

        it("should understand values passed with context", function ()
        {
            // Act
            anaLogger.log(LOG_CONTEXTS.C1, "Test Log example C1");

            // Assert
            expect(anaLogger.getLogHistory()).to.contain("Test Log example C1");
        });

        it("should understand values passed with context as value of object", function ()
        {
            // Act
            anaLogger.log({context: LOG_CONTEXTS.C1}, "Test Log example C1");

            // Assert
            expect(anaLogger.getLogHistory()).to.contain("Test Log example C1");
        });

        it("should understand values passed with context defined as null", function ()
        {
            // Act
            anaLogger.log({context: null}, "Test Log example C1");

            // Assert
            expect(anaLogger.getLogHistory()).to.contain("Test Log example C1");
        });

        it("should populate history even though the hidelog option is on", function ()
        {
            anaLogger.setOptions({hideLog: true});

            // Act
            anaLogger.log({context: LOG_CONTEXTS.C1, lid: 123456789233}, "The hidden log");

            // Assert
            expect(anaLogger.getLogHistory()).to.contain("The hidden log");
        });

        it("should not capture or display log from another defined target", function ()
        {
            anaLogger.setActiveTarget(LOG_TARGETS.DEV3);
            anaLogger.log({target: LOG_TARGETS.DEV1}, "I am for DEV1");

            // Assert
            expect(anaLogger.getLogHistory()).to.not.contain("I am for DEV1");
        });

        it("should capture logs when no active target is set", function ()
        {
            anaLogger.setActiveTarget(null);
            anaLogger.log({target: LOG_TARGETS.DEV3}, "I am for DEV3");

            // Assert
            expect(anaLogger.getLogHistory()).to.contain("I am for DEV3");
        });

        it("should capture logs from the same target", function ()
        {
            anaLogger.setActiveTarget(LOG_TARGETS.DEV3);
            anaLogger.log({target: LOG_TARGETS.DEV3}, "I am for DEV3");

            // Assert
            expect(anaLogger.getLogHistory()).to.contain("I am for DEV3");
        });

        it("should capture logs from the same target", function ()
        {
            anaLogger.log(LOG_CONTEXTS.TEST2, "I am for DEV3");

            // Assert
            expect(anaLogger.getLogHistory()).to.contain("I am for DEV3");
        });

        it("should truncate some text when too long", function ()
        {
            anaLogger.setOptions({
                messageLenMax: 80
            });

            // Act
            anaLogger.log({
                context: LOG_CONTEXTS.C1,
                lid    : 123456789233
            }, "The super long Log ID (lid) will be truncated");

            // Assert
            expect(anaLogger.getLogHistory()).to.contain("C1: (123...)");
        });


    });

    describe("#error()", function ()
    {
        it("should not show up when hideError mode is on", function ()
        {
            // Arrange
            anaLogger.setOptions({hideError: true});

            // Act
            anaLogger.error("Test Log example C1");

            // Assert
            expect(anaLogger.getLogHistory()).to.not.contain("Test Log example C1");
        });

        it("should not show up when hideError mode is off", function ()
        {
            // Arrange
            anaLogger.setOptions({hideError: false});

            // Act
            anaLogger.error("Test Log example C1");

            // Assert
            expect(anaLogger.getLogHistory()).to.contain("Test Log example C1");
        });
    });

    describe("#info()", function ()
    {
        it("should display some log", function ()
        {
            anaLogger.info("Hello from info");
            expect(anaLogger.getLogHistory()).to.contain("Hello from info");
        });
    });

    describe("#warn()", function ()
    {
        it("should display some warn", function ()
        {
            anaLogger.warn("Hello from warn");
            expect(anaLogger.getLogHistory()).to.contain("Hello from warn");
        });
    });

    describe("#table()", function ()
    {
        let data;
        before(() =>
        {
            data = {
                "Nubia"  : {
                    "serverName" : "Nubia",
                    "defaultPage": "index.html",
                },
                "Lavern" : {
                    "serverName" : "Lavern",
                    "defaultPage": "index.html",
                },
                "Kristal": {
                    "serverName" : "Kristal",
                    "defaultPage": "index.html",
                }
            };

        });

        it.skip("should invoke the callback onCompleteHeaders", function ()
        {
            anaLogger.table(data, {onCompleteHeaders: myStub.myMethod});
            expect(myStub.myMethod).to.have.been.called.with(
                "serverName │ defaultPage  │ ",
                ["serverName", "defaultPage"]
            );
        });

        it.skip("should invoke the callback onCompleteSeparators", function ()
        {

            anaLogger.table(data, {onCompleteSeparators: myStub.myMethod});
            expect(myStub.myMethod).to.have.been.called();
        });

        it.skip("should invoke the callback onCompleteLines three times", function ()
        {
            anaLogger.table(data, {onCompleteLines: myStub.myMethod});
            expect(myStub.myMethod).to.have.been.called.exactly(3);
        });

        it.skip("should invoke onCompleteLines with the correct arguments", function ()
        {
            anaLogger.table(data, {onCompleteLines: myStub.myMethod});
            expect(myStub.myMethod).to.have.been.third.called.with(
                "Kristal    │ index.html   │ ",
                {
                    "defaultPage": "index.html",
                    "serverName" : "Kristal"
                }
            );
        });

    });

    describe("#alert()", function ()
    {
        it("should not fail on alert", function ()
        {
            anaLogger.alert("Hello from alert", {aaa: 1012});
            expect(anaLogger.getLogHistory()).to.contain("Hello from alert");
        });

        describe("in a non-Node environment", function ()
        {
            let sandbox;

            beforeEach(function ()
            {
                sandbox = sinon.createSandbox();
            });


            it("should be called", function ()
            {
                sandbox
                    .stub(anaLogger, "isNode")
                    .withArgs("Hello from alert")
                    .returns(
                        true
                    );

                chai.expect(() => anaLogger.alert("Hello from alert")).to.throw("alert is not defined");
            });

            afterEach(function ()
            {
                sandbox.restore();
            });
        });

    });

    describe("#assert()", function ()
    {
        before(function ()
        {
            anaLogger.setOptions({hidePassingTests: false, oneConsolePerContext: false});
        });

        it("should evaluate condition expressions", function ()
        {
            const result = anaLogger.assert(1 === 1);
            expect(result).to.be.true;
        });

        it("should detect failing condition expressions", function ()
        {
            const result = anaLogger.assert(1 === 2);
            expect(result).to.be.false;
        });

        it("should evaluate function expressions", function ()
        {
            const result = anaLogger.assert(() => true, true);
            expect(result).to.be.true;
        });

        it("should fail when function expressions fail", function ()
        {
            const result = anaLogger.assert(() => false, true);
            expect(result).to.be.false;
        });

        it("should evaluate more complex function expressions", function ()
        {
            const result = anaLogger.assert((a, b) => a === b, true, 2, 2);
            expect(result).to.be.true;
        });

        it("should not break the code when an invalid function is passed", function ()
        {
            expect(anaLogger.assert(() => nonExistentFunctionThatIsCalledAnyway(), true, 2, 2)
            ).to.be.false;
        });
    });

    describe("#overrideConsole()", function ()
    {
        it("should override the console behaviour", function ()
        {
            anaLogger.overrideConsole({error: true});
            console.log("Test 1");
            expect(anaLogger.getLogHistory()).to.contain("Test 1");
        });
    });

    describe("#setLogFormat()", function ()
    {
        beforeEach(function ()
        {
        });

        afterEach(function ()
        {
            chai.spy.restore(myStub.myMethod);
        });

        /**
         * We use a spy here, but things would have been straightforward with a simple "done" + async on the "it"
         */
        it("should replace the default formatter function with the given callback when invoking console.log", function ()
        {
            anaLogger.setLogFormat(
                myStub.myMethod
            );

            console.log(LOG_CONTEXTS.C1, "Test Log example C4 with new format");
            expect(myStub.myMethod).to.have.been.called();
        });

        it("should reset the formatter to its first value", () =>
        {
            anaLogger.setLogFormat(
                () => "If you see this the test has failed"
            );
            anaLogger.resetLogFormatter();
            anaLogger.log(LOG_CONTEXTS.C1, "Test Log example C4 with new format");
            expect(anaLogger.getLogHistory()).to.contain("C1: (      )    Test Log example C4 with new format");
        });

        it("should reject invalid formatters", () =>
        {
            const res = anaLogger.setLogFormat(null);
            expect(res).to.be.false;
        });
    });

    describe("#releaseLogHistory()", function ()
    {
        it("should not keep log history", function ()
        {
            anaLogger.releaseLogHistory();
            anaLogger.log("Hello you");
            expect(anaLogger.getLogHistory().length).to.equal(0);
        });
    });

    describe("#getLogHistory()", function ()
    {
        it("should return history as a string", function ()
        {
            anaLogger.log("Hello you");
            const arr = anaLogger.getLogHistory();
            expect(arr).to.be.string;
        });

        it("should return history as an array", function ()
        {
            anaLogger.log("Hello you");
            const arr = anaLogger.getLogHistory(false);
            expect(arr).to.be.array();
        });

        it("should return history as an array", function ()
        {
            anaLogger.log("Hello you");
            const arr = anaLogger.getLogHistory(false);
            expect(arr).to.be.array();
        });
    });

    describe("#setErrorHandlerForUserTarget()", function ()
    {
        before(() =>
        {
            anaLogger.resetOptions();
        });

        it("should replace the error manager targeting the user", function ()
        {
            anaLogger.setActiveTarget(LOG_TARGETS.USER);
            anaLogger.setErrorHandlerForUserTarget(
                myStub.myMethod
            );

            anaLogger.error({
                context: LOG_CONTEXTS.ERROR,
                target : LOG_TARGETS.USER,
                lid    : 200020
            }, "Test Error Log");
            expect(myStub.myMethod).to.have.been.called();
        });

        it("should replace the error manager targeting the user", function ()
        {
            anaLogger.setActiveTarget(LOG_TARGETS.USER);
            anaLogger.setErrorHandlerForUserTarget(
                myStub.myMethod
            );

            anaLogger.error({
                target: LOG_TARGETS.USER,
                lid   : 203420
            }, "Test Error Log");
            expect(myStub.myMethod).to.have.been.called.with(["Test Error Log"]);
        });

    });

    describe("#setErrorHandler()", function ()
    {
        it("should replace the error manager", function ()
        {
            anaLogger.setActiveTarget(LOG_TARGETS.USER);
            anaLogger.error({target: LOG_TARGETS.USER}, "Test Error Log");
        });

        it("should replace the error manager", function ()
        {
            anaLogger.setErrorHandler(
                myStub.myMethod
            );

            console.error("Test Error Log");
            expect(myStub.myMethod).to.have.been.called();
        });

        it("should replace the error manager targeting the user", function ()
        {
            anaLogger.setActiveTarget(LOG_TARGETS.USER);
            anaLogger.setErrorHandler(
                myStub.myMethod
            );

            anaLogger.error("Test Error Log");
            expect(myStub.myMethod).to.have.been.called();
        });

    });

    describe("#writeLogToDom", function ()
    {
        it("should fail when there is no DOM", function ()
        {
            anaLogger.setOptions({logToDom: "body"});
            chai.expect(() => anaLogger.writeLogToDom("Hello you - How is it?")).to.throw("document is not defined");
        });
    });

    describe("on the simulated DOM", function ()
    {
        let sandbox;

        before(function ()
        {
            this.jsdom = jsDom();

            sandbox = sinon.createSandbox();
            sandbox
                .stub(anaLogger, "isBrowser")
                .withArgs()
                .returns(
                    true
                );
        });

        after(function ()
        {
            sandbox.restore();

            this.jsdom();
        });

        describe("#log", function ()
        {
            it("should add log to the DOM when the logToDom option is on", async function ()
            {
                anaLogger.forceEnvironment(SYSTEM.BROWSER);
                anaLogger.setOptions({logToDom: "body"});
                anaLogger.log("Hello you - How is it?");
                anaLogger.forceEnvironment("");
                await sleep(100);

                expect(document.body.textContent).to.contain("Hello you - How is it?");
            });
        });

        describe("#writeLogToDom", function ()
        {
            it("should not fail when there is no DOM", function ()
            {
                anaLogger.setOptions({logToDom: "body"});


                chai.expect(() => anaLogger.writeLogToDom({className: "some-class"}, "Message - Example", {
                    message: "Hello you - How is" +
                        " it?"
                })).to.not.throw("document is not" +
                    " defined");
            });
        });
    });
});