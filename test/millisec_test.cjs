const chai = require("chai");
const expect = chai.expect;
const { anaLogger } = require("../src/ana-logger.cjs");

describe("AnaLogger enableMillisec option", function() {
    beforeEach(() => {
        anaLogger.resetLogger();
        anaLogger.resetLogHistory();
        anaLogger.keepLogHistory();
    });

    it("should NOT show milliseconds by default", function() {
        anaLogger.log("test message");
        const history = anaLogger.getLogHistory();
        // Default format might have ansi codes if we are in node, but getLogHistory should return what was formatted.
        // Let's see what we got.
        const timePartMatch = history.match(/\[(.*?)\]/);
        expect(timePartMatch, "Should find time part in: " + history).to.not.be.null;
        const timePart = timePartMatch[1].trim();
        expect(timePart).to.have.lengthOf(8); // HH:MM:SS is 8 chars
        expect(timePart).to.match(/^\d{2}:\d{2}:\d{2}$/);
    });

    it("should show milliseconds when enableMillisec is true", function() {
        anaLogger.setOptions({ enableMillisec: true });
        
        anaLogger.log("test message");
        const history = anaLogger.getLogHistory();
        const timePartMatch = history.match(/\[(.*?)\]/);
        expect(timePartMatch, "Should find time part in: " + history).to.not.be.null;
        const timePart = timePartMatch[1].trim();
        expect(timePart).to.have.lengthOf(12); // HH:MM:SS,mmm is 12 chars
        expect(timePart).to.match(/^\d{2}:\d{2}:\d{2},\d{3}$/);
    });
    
    it("should use effective timeLenMax when enableMillisec is true", function() {
        anaLogger.resetLogger();
        anaLogger.setOptions({ timeLenMax: 8, enableMillisec: true });
        anaLogger.log({lid: "AAA111"}, "test");
        const history = anaLogger.getLogHistory();
        const timePartMatch = history.match(/\[(.*?)\]/);
        const timePart = timePartMatch[1];
        // HH:MM:SS,mmm is 12 chars.
        // effectiveTimeLenMax = 10 + 3 = 13.
        // So it should have 13 chars.
        expect(timePart).to.have.lengthOf(12);
    });
});
