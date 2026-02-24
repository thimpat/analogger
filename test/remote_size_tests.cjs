const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const { AnaLogger } = require("../src/ana-logger.cjs");

describe("AnaLogger Remote Size Options", function () {
    let logger;
    let postStub;
    let clock;

    beforeEach(() => {
        logger = new AnaLogger();
        logger.setOptions({
            silent: true // Avoid console output
        });
        // Mock fetch or performRemotePost
        postStub = sinon.stub(logger, "performRemotePost");
        clock = sinon.useFakeTimers();
    });

    afterEach(() => {
        postStub.restore();
        clock.restore();
    });

    describe("logToRemoteMaxSize", function () {
        it("should flush immediately when size is reached, bypassing debounce", function () {
            logger.setOptions({
                logToRemote: true,
                logToRemoteDebounce: 1000,
                logToRemoteMaxSize: 200 // small size for testing
            });

            // This should not trigger immediate post, but start a timer
            logger.log({lid: "AAAAAAA"}, "small");

            // This log above send the context which increase the size significantly ( >= 155 )
            // {
            //     "lid": "AAAAAAA",
            //     "contextName": "DEFAULT",
            //     "target": [
            //     "ALL",
            //     "USER",
            //     "NONE"
            // ],
            //     "symbol": "✔",
            //     "color": "#FF7F50",
            //     "logLevel": 1000,
            //     "name": "DEFAULT",
            //     "id": 7
            // }
            // Use this to check if buffering is working
            expect(logger.remoteBuffer.length).to.equal(1);
            expect(postStub.called).to.be.false;

            // This should push it over 50 bytes
            logger.log({lid: "BBBBBBB"}, "a very long message that should definitely exceed fifty bytes when stringified in a buffer");
            
            expect(postStub.calledOnce).to.be.true;
        });

        it("should still work with debounce if size is not reached", function () {
            logger.setOptions({
                logToRemote: true,
                logToRemoteDebounce: 1000,
                logToRemoteMaxSize: 1000
            });

            logger.log("small");
            expect(postStub.called).to.be.false;

            clock.tick(1000);
            expect(postStub.calledOnce).to.be.true;
        });
    });

    describe("logToRemoteMinSize", function () {
        it("should NOT flush on debounce if min size is not reached", function () {
            logger.setOptions({
                logToRemote: true,
                logToRemoteDebounce: 1000,
                logToRemoteMinSize: 200
            });

            logger.log({lid: "AAAAAAA"}, "small");
            clock.tick(1000);
            
            // Should NOT have called post because "small" is less than 100 bytes in JSON
            expect(postStub.called).to.be.false;
        });

        it("should flush on debounce if min size is reached", function () {
            logger.setOptions({
                logToRemote: true,
                logToRemoteDebounce: 1000,
                logToRemoteMinSize: 50
            });

            logger.log({lid: "AAAAAAA"}, "a message that is long enough to be over fifty bytes when wrapped in a buffer");
            clock.tick(1000);
            
            expect(postStub.calledOnce).to.be.true;
        });

        it("should eventually flush once min size is reached after multiple logs", function () {
            logger.setOptions({
                logToRemote: true,
                logToRemoteDebounce: 1000,
                logToRemoteMinSize: 300
            });

            logger.log({lid: "AAAAAAA"}, "msg 1");
            clock.tick(1000);
            expect(postStub.called).to.be.false;

            logger.log({lid: "AAAAAAA"}, "msg 2 which is quite a bit longer than the first one to help reach the minimum size faster");
            clock.tick(1000);
            
            expect(postStub.calledOnce).to.be.true;
        });

        it("should prioritize MaxSize over MinSize", function () {
             logger.setOptions({
                logToRemote: true,
                logToRemoteDebounce: 1000,
                logToRemoteMinSize: 1000,
                logToRemoteMaxSize: 100
            });

            // This exceeds MaxSize (100) but not MinSize (1000)
            logger.log({lid: "AAAAAAA"}, "this message is longer than 100 bytes but shorter than 1000 bytes. It should trigger MaxSize flush.");
            
            expect(postStub.calledOnce).to.be.true;
        });
    });
});
