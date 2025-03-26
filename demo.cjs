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

anaLogger.setContext("TEST", { color: "#5d8a6b", symbol: "email", name: "TEST", lid: "12222" });
anaLogger.log({lid: "WEB35382", color: "yellow"}, `Log with target`);
anaLogger.log({contextName: "TEST"}, `Test Log example TEST`);
anaLogger.log({contextName: "TEST"}, `Test Log example TEST 2`);

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
    onMessage: function (rawMessage/**, extras **/) {
        return rawMessage + " ↘";
    },
    onOutput: function (formattedMessage, {logCounter}) {

        return `${logCounter}: ${formattedMessage}`;
    }
});
anaLogger.log({lid: "WEB35382", color: "yellow", target: "DEFAULT"}, `Log with target 1`);
anaLogger.log({lid: "WEB35384", color: "yellow", target: "USER"}, `Log with non-existent target 2`);
anaLogger.log({lid: "WEB35386", color: "yellow", target: undefined}, `Log with undefined target 3`);
anaLogger.log({lid: "WEB35388", color: "yellow"}, `Log without target 3`);

anaLogger.setActiveTargets("localhost, api");
anaLogger.log({lid: "WEB35382", target: "localhost", color: "yellow"}, `Log with target`);
anaLogger.log({lid: "WEB35382", target: "localhost"}, `Log with target`);
anaLogger.log({lid: "WEB35382", color: "green", target: "localhost"}, `Log without target`);

anaLogger.log({contextName: "TEST", target: "localhost"}, `Test Log example TEST`);
anaLogger.log({contextName: "TEST", target: "localhost"}, `Test Log example TEST 2`);

// Check archive
for (let i = 1; i < 10; ++i) {
    anaLogger.log({
        lid: "WEB35382",
        target: "localhost"
    }, `${i}: Lorem Ipsum is simply dummy text.`);
}