const AnaLogger = require("./");

const anaLogger = new AnaLogger();

anaLogger.setOptions({
    silent: false, lidLenMax: 8, logToRemote: true,
    logMaxSize: 1000,
    logMaxArchives: 5,
    compressionLevel: 9,
    logToFile: "./logs/demo.log",
    compressArchives: true,
});

anaLogger.setDefaultContext({
    "contextName": "DEFAULT",
    "target": "USER",
    "symbol": "check",
    "color": "#FF7F50",
    "logLevel": 1000,
    "name": "DEFAULT",
    "id": 7,
    onContext: function (context) {
        context.lid = "MOD12345";
    },
    onMessage: function (rawMessage, extras) {
        return rawMessage + " ↘";
    },
    onOutput: function (formattedMessage, {logCounter}) {

        return `${logCounter}: ${formattedMessage}`;
    }
});

anaLogger.setActiveTargets("localhost, api");
anaLogger.log({lid: "WEB35382", target: "localhost", color: "yellow"}, `Log with target`);
anaLogger.log({lid: "WEB35382", target: "localhost"}, `Log with target`);
anaLogger.log({lid: "WEB35382", color: "green", target: "localhost"}, `Log without target`);

// Check archive
for (let i = 1; i < 100; ++i) {
    anaLogger.log({
        lid: "WEB35382",
        target: "localhost"
    }, `${i}: Lorem Ipsum is simply dummy text.`);
}