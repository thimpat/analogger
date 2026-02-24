const chai = require("chai");
const expect = chai.expect;
const jsDom = require("jsdom-global");

// sut
const {anaLogger} = require("../src/ana-logger.cjs");
const {SYSTEM} = require("../src/constants.cjs");
const {LOG_CONTEXTS, LOG_TARGETS} = require("../models/jscode/contexts-def.cjs");

describe("AnaLogger logUidToRemote", function () {
    let cleanupJsDom;

    before(() => {
        cleanupJsDom = jsDom(undefined, {
            url: "http://localhost"
        });
        anaLogger.setContexts(LOG_CONTEXTS);
        anaLogger.setTargets(LOG_TARGETS);
        anaLogger.setActiveTarget(LOG_TARGETS.ALL);
    });

    after(() => {
        cleanupJsDom();
    });

    afterEach(() => {
        // Reset environment
        anaLogger.forceEnvironment("");
    });

    beforeEach(() => {
        anaLogger.resetOptions();
        window.localStorage.clear();

        anaLogger.resetLogHistory();
        anaLogger.keepLogHistory();
        anaLogger.resetLogFormatter();
        // Force browser environment so localStorage is available and isBrowser() is true
        anaLogger.forceEnvironment(SYSTEM.BROWSER);
    });

    it("should include a UID in the context when logUidToRemote is enabled", function () {
        // Arrange
        anaLogger.setOptions({
            logToRemote: true,
            logToRemoteUrl: "http://localhost:12345",
            logUidToRemote: true
        });

        // Act
        anaLogger.log({lid: "AAA"}, "Test UID");

        // Assert
        const historyEntry = anaLogger.logHistory.pop();
        const {context} = historyEntry;
        expect(context).to.have.property("uid");
        expect(context.uid).to.match(/^uid-\d+-\d+$/);

        // Verify it's in localStorage
        expect(window.localStorage.getItem("analogger-uid")).to.equal(context.uid);
    });

    it("should NOT include a UID in the context when logUidToRemote is disabled", function () {
        // Arrange
        anaLogger.setOptions({
            logToRemote: true,
            logToRemoteUrl: "http://localhost:12345",
            logUidToRemote: false
        });

        // Act
        anaLogger.log({lid: "AAA"}, "Test No UID");

        // Assert
        const historyEntry = anaLogger.logHistory.pop();
        const {context} = historyEntry;
        expect(context).to.not.have.property("uid");
    });

    it("should reuse the same UID from localStorage", function () {
        const fixedUid = "fixed-uid-123";
        window.localStorage.setItem("analogger-uid", fixedUid);

        // Arrange
        anaLogger.setOptions({
            logToRemote: true,
            logToRemoteUrl: "http://localhost:12345",
            logUidToRemote: true
        });

        // Act
        anaLogger.log({lid: "AAA"}, "Test Fixed UID");

        // Assert
        const historyEntry = anaLogger.logHistory.pop();
        const {context} = historyEntry;
        expect(context.uid).to.equal(fixedUid);
    });
});
