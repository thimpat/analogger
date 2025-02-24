const AnaLogger = require("./");

const anaLogger = new AnaLogger();

anaLogger.setOptions({silent: false, lidLenMax: 8, logToRemote: true});
anaLogger.setDefaultContext({
    "contextName": "DEFAULT",
    "target": "USER",
    "symbol": "check",
    "color": "#FF7F50",
    "logLevel": 1000,
    "name": "DEFAULT",
    "id": 7
});

anaLogger.setActiveTargets("localhost, api");
anaLogger.log({lid: "WEB35382", target: "localhost", color: "yellow"}, `Log with target`);
anaLogger.log({lid: "WEB35382", target: "localhost"}, `Log with target`);
anaLogger.log({lid: "WEB35382", color: "green", target: "localhost"}, `Log without target`);