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

anaLogger.log({lid: "WEB35380", color: "yellow"}, {MY: "TEST"}, `Log with target`);
anaLogger.log({lid: "WEB35380", color: "yellow"}, {MY: "TEST"}, {MY: "TEST2"}, `Log with target`);
anaLogger.log({MY: "TEST"}, {MY: "TEST2"}, `Log with target`);

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

anaLogger.setTargets({DEV1: "Me", DEV2: "You"});
anaLogger.setActiveTarget("Me");
anaLogger.log({lid: "WEB35382", color: "yellow"}, `You should see this`);

anaLogger.log({lid: "WEB35384", color: "yellow", target: "DEFAULT"}, `You should not see this`);
anaLogger.log({lid: "WEB35386", color: "yellow", target: "USER"}, `You should not see this`);
anaLogger.log({lid: "WEB35388", color: "yellow", target: undefined}, `You should see this`);
anaLogger.log({lid: "WEB35390", color: "yellow"}, `You should see this`);
anaLogger.log({lid: "WEB35392", color: "yellow", target: "You"}, `You should not see this`);
anaLogger.log({lid: "WEB35394", color: "yellow", target: "Me"}, `You should see this`);

// To work, we should have called `anaLogger.setTargets(["NonDefinedTarget"])`
anaLogger.setActiveTarget("NonDefinedTarget");
anaLogger.log({lid: "WEB35396"}, `You cannot see this`);
anaLogger.log({lid: "WEB35398", target: "NonDefinedTarget"}, `You cannot see this`);

anaLogger.setTargets({DEV1: "NonDefinedTarget"});
anaLogger.setActiveTarget("NonDefinedTarget");
anaLogger.log({lid: "WEB35400", target: "NonDefinedTarget"}, `You should see this`);

// Here we set the allowed targets
anaLogger.setTargets({TOM: "TOM", GROUP1: "GROUP1", GROUP2: "GROUP2"});
anaLogger.setActiveTargets(["TOM", "GROUP1"]);
anaLogger.log({target: "TOM"}, `TOM can see this`);
anaLogger.log({target: "TIM"}, `TIM shouldn't see this`);
anaLogger.log({target: "GROUP1"}, `GROUP1 can see this`);

// setActiveTargets here will work even if we set the targets before
anaLogger.setActiveTargets("localhost, api");
anaLogger.log({lid: "WEB35382", color: "yellow"}, `Log without target`);
anaLogger.log({lid: "WEB35382", target: "localhost", color: "yellow"}, `Log with target`);
anaLogger.log({lid: "WEB35382", target: "api"}, `Log with target`);
anaLogger.log({lid: "WEB35382", color: "green", target: "localhost"}, `Log without target`);

anaLogger.setTargets(["localhost", "api"]);
anaLogger.setActiveTargets("localhost, api");
anaLogger.log({contextName: "TEST", target: "localhost"}, `Test Log example TEST`);
anaLogger.log({contextName: "TEST", target: "api"}, `Test Log example TEST 2`);

// Check archive
for (let i = 1; i < 10; ++i) {
    anaLogger.log({
        lid: "WEB35382",
        target: "localhost"
    }, `${i}: Lorem Ipsum is simply dummy text.`);
}