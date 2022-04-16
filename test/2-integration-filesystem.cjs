const chai = require("chai");
var capcon = require("capture-console");
const {anaLogger} = require("../src/cjs/ana-logger.cjs");
const {LOG_CONTEXTS, LOG_TARGETS} = require("../example/cjs/contexts-def.cjs");
const fs = require("fs");
const expect = chai.expect;

describe("In the Terminal", function ()
{
    before(()=>
    {
        anaLogger.setContexts(LOG_CONTEXTS);
        anaLogger.setTargets(LOG_TARGETS);
    });

    after(()=>
    {
        if (fs.existsSync("./test-log.log"))
        {
            fs.unlinkSync("./test-log.log");
        }
    });

    beforeEach(()=>
    {
        anaLogger.resetLogger();
        anaLogger.resetLogHistory();
        anaLogger.keepLogHistory();
        anaLogger.setOptions({silent: false, hideError: false});
        anaLogger.removeOverride();
        anaLogger.removeOverrideError();
    });

    describe("AnaLogger", function ()
    {
        it("should emulate console.log", function ()
        {
            const captured = capcon.captureStdio(function ()
            {
                anaLogger.log("Test Log example C1");
            });

            expect(captured.stdout).to.contain("Test Log example C1");
        });

        describe("table", function ()
        {
            it("should display nothing when invoked with an empty array", function ()
            {
                const captured = capcon.captureStdio(function ()
                {
                    const arr = {};
                    anaLogger.table(arr);
                });

                expect(captured.stdout).to.be.empty;
            });

            it("should display an array of objects in a table", function ()
            {
                const captured = capcon.captureStdio(function ()
                {
                    const arr = [
                        {
                            "serverName"      : "Nubia",
                            "silent"          : false,
                            "defaultPage"     : "index.html",
                            "apiPort"         : "8082",
                            "protocol"        : "http://",
                            "host"            : "localhost",
                            "port"            : 10040,
                            "serverUrl"       : "http://localhost:10040/",
                            "enableapi"       : true,
                            "webServerStarted": true
                        },
                        {
                            "serverName"      : "Lavern",
                            "silent"          : false,
                            "defaultPage"     : "index.html",
                            "apiPort"         : "8082",
                            "protocol"        : "http://",
                            "host"            : "localhost",
                            "port"            : 10040,
                            "serverUrl"       : "http://localhost:10040/",
                            "enableapi"       : true,
                            "webServerStarted": true
                        },
                        {
                            "serverName"      : "Kristal",
                            "silent"          : false,
                            "defaultPage"     : "index.html",
                            "apiPort"         : "8082",
                            "protocol"        : "http://",
                            "host"            : "localhost",
                            "port"            : 10040,
                            "serverUrl"       : "http://localhost:10040/",
                            "enableapi"       : true,
                            "webServerStarted": true
                        }
                    ];
                    anaLogger.table(arr);
                });

                expect(captured.stdout).to.contain("serve... │ silent │ default... │ api... │ prot... │ host");
            });

            it("should display an array of objects in a smaller table", function ()
            {
                const captured = capcon.captureStdio(function ()
                {
                    const arr = [
                        {
                            "serverName"      : "Nubia",
                            "silent"          : false,
                            "defaultPage"     : "index.html",
                            "apiPort"         : "8082",
                            "protocol"        : "http://",
                            "host"            : "localhost",
                            "port"            : 10040,
                            "serverUrl"       : "http://localhost:10040/",
                            "enableapi"       : true,
                            "webServerStarted": true
                        },
                    ];
                    anaLogger.table(arr, {availableLength: 80, columnMaxChars: 10});
                });

                expect(captured.stdout).to.contain("Nubia  │ false  │ inde... │ 8082   │ htt... │ loc... │ 10040");
            });

            it("should display a complex object in a table", function ()
            {
                const captured = capcon.captureStdio(function ()
                {
                    const arr = {
                            "Nubia"  : {
                                "serverName"      : "Nubia",
                                "silent"          : false,
                                "defaultPage"     : "index.html",
                                "apiPort"         : "8082",
                                "protocol"        : "http://",
                                "host"            : "localhost",
                                "port"            : 10040,
                                "serverUrl"       : "http://localhost:10040/",
                                "enableapi"       : true,
                                "webServerStarted": true
                            },
                            "Lavern" : {
                                "serverName"      : "Lavern",
                                "silent"          : false,
                                "defaultPage"     : "index.html",
                                "apiPort"         : "8082",
                                "protocol"        : "http://",
                                "host"            : "localhost",
                                "port"            : 10040,
                                "serverUrl"       : "http://localhost:10040/",
                                "enableapi"       : true,
                                "webServerStarted": true
                            },
                            "Kristal": {
                                "serverName"      : "Kristal",
                                "silent"          : false,
                                "defaultPage"     : "index.html",
                                "apiPort"         : "8082",
                                "protocol"        : "http://",
                                "host"            : "localhost",
                                "port"            : 10040,
                                "serverUrl"       : "http://localhost:10040/",
                                "enableapi"       : true,
                                "webServerStarted": true
                            }
                        };
                    anaLogger.table(arr);
                });

                expect(captured.stdout).to.contain("Nubia    │ false  │ index.html │ 8082   │ http:// │ localhost │ 10040  │ http://localhost:10040/");
            });

        });

        it("should hide console output when the console behaviour is overridden", function (done)
        {
            const captured = capcon.captureStdio(function ()
            {
                console.log("Log Before override");
                anaLogger.setOptions({silent: true});
                anaLogger.overrideConsole();
                console.log("Log After override");
                done();
            });

            expect(captured.stdout).to.contain("Log Before override");
            expect(captured.stdout).to.not.contain("Log After override");
        });

        it("should hide console output but keep console input in the log history", function ()
        {
            const captured1 = capcon.captureStdio(function ()
            {
                anaLogger.keepLogHistory();
                anaLogger.setOptions({silent: true, hideError: false});
                anaLogger.log(LOG_CONTEXTS.C1, "Test Log example something again");
            });

            const captured2 = capcon.captureStdio(function ()
            {
                console.log(anaLogger.getLogHistory());
            });

            expect(captured1.stdout).to.not.contain("Test Log example something again");
            expect(captured2.stdout).to.contain("Test Log example something again");
        });

        it("should hide console error when the console behaviour is overridden", function ()
        {
            const captured = capcon.captureStdio(function ()
            {
                console.log("Log Before override");
                anaLogger.setOptions({hideError: true});
                anaLogger.overrideConsole();

                console.error("Error Before override");
                anaLogger.overrideError();
                console.error("Error After override");

                console.log("Log After override");
            });

            expect(captured.stdout).to.contain("Log Before override");
            expect(captured.stdout).to.not.contain("Error After override");
        });

        it("should not show target logs that are unrelated to DEV3", function ()
        {
            const captured = capcon.captureStdio(function ()
            {
                anaLogger.setActiveTarget(LOG_TARGETS.DEV3);
                anaLogger.log({context: LOG_CONTEXTS.TEST, target: LOG_TARGETS.DEV3, lid: 100001}, "Test Log example with active target");
                anaLogger.log({context: LOG_CONTEXTS.TEST, target: LOG_TARGETS.DEV1, lid: 100002}, "Test Log example with DEV1 target");
                anaLogger.log("Test Log example with DEFAULT target");
            });

            expect(captured.stdout).to.contain("Test Log example with active target");
            expect(captured.stdout).to.contain("Test Log example with DEFAULT target");
            expect(captured.stdout).to.not.contain("Test Log example with DEV1 target");
        });

        it("should not do anything when silent mode is enabled", function ()
        {
            const captured = capcon.captureStdio(function ()
            {
                anaLogger.setOptions({silent: true});
                anaLogger.log("Test Log example with DEFAULT target");
            });

            expect(captured.stdout).to.not.contain("Test Log example with DEFAULT target");
        });

        it("should write logs to a file when logToFile is on", function ()
        {
            anaLogger.setOptions({silent: true, logToFile: "./test-log.txt"});
            anaLogger.log("Test Log example with DEFAULT target");

            const content = fs.readFileSync("./test-log.txt", "utf-8");
            expect(content).to.contain("Test Log example with DEFAULT target");
        });


    });
});