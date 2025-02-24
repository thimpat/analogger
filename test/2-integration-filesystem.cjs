const chai = require("chai");
const capcon = require("capture-console");
const {anaLogger} = require("../src/ana-logger.cjs");
const {LOG_CONTEXTS, LOG_TARGETS} = require("../models/jscode/contexts-def.cjs");
const fs = require("fs");
const {PREDEFINED_FORMATS} = require("../src/constants.cjs");
const expect = chai.expect;

describe("In the Terminal", function ()
{
    before(()=>
    {
        anaLogger.setContexts(LOG_CONTEXTS);
        anaLogger.setTargets(LOG_TARGETS);

        if (fs.existsSync("./test-log.txt"))
        {
            fs.unlinkSync("./test-log.txt");
        }
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

        it("should apply the default format", function ()
        {
            const captured = capcon.captureStdio(function ()
            {
                anaLogger.applyPredefinedFormat(PREDEFINED_FORMATS.DEFAULT_FORMAT, {override: false});
                anaLogger.log({lid: 8000}, "Test Log example C1");
            });

            expect(captured.stdout).to.contain("Test Log example C1");
        });

        it("should apply the default format and override console", function ()
        {
            const captured = capcon.captureStdio(function ()
            {
                anaLogger.applyPredefinedFormat(PREDEFINED_FORMATS.DEFAULT_FORMAT,{override: true});
                console.log({lid: 8000}, "Test Log example C1");
            });

            expect(captured.stdout).to.contain("Test Log example C1");
        });

        describe("#listSymbols", function ()
        {
            it("should display the list of supported symbols", function ()
            {
                const captured = capcon.captureStdio(function ()
                {
                    anaLogger.listSymbols();
                });

                expect(captured.stdout)
                    .to.contain("⏹   black_square")
                    .to.contain("✔   check")
                    .to.contain("❌   cross")
                    .to.contain("⚒   hammer_and_pick");
            });
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

                expect(captured.stdout)
                    .to.contain("┌─────────┐")
                    .to.contain("│ (index) │")
                    .to.contain("├─────────┤")
                    .to.contain("└─────────┘");
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
                            "protocol"        : "http://",
                            "host"            : "localhost",
                            "port"            : 10040,
                        },
                        {
                            "serverName"      : "Lavern",
                            "silent"          : false,
                            "defaultPage"     : "index.html",
                            "protocol"        : "http://",
                            "host"            : "localhost",
                            "port"            : 10040,
                        },
                        {
                            "serverName"      : "Kristal",
                            "silent"          : false,
                            "defaultPage"     : "index.html",
                            "protocol"        : "http://",
                            "host"            : "localhost",
                            "port"            : 10040,
                        }
                    ];
                    anaLogger.table(arr);
                });

                expect(captured.stdout)
                    .to.contain("serverName │ silent │ defaultPage  │ protocol  │ host        │ port")
                    .to.match(/'Kristal'[^|]*│[^|]*false[^|]*│[^|]*'index.html'[^|]*│[^|]*'http:\/\/'[^|]*│[^|]*'localhost'[^|]*│[^|]*10040/ );
            });

            it.skip("should display an array of objects in a smaller table", function ()
            {
                const captured = capcon.captureStdio(function ()
                {
                    const arr = [
                        {
                            "serverName"      : "Nubia",
                            "silent"          : false,
                            "defaultPage"     : "index.html",
                            "protocol"        : "http://",
                            "host"            : "localhost",
                            "port"            : 10040,
                        },
                    ];
                    anaLogger.table(arr, {availableLength: 80, columnMaxChars: 10});
                });

                expect(captured.stdout).to.match(/Nubia[^|]*│[^|]*false[^|]*│[^|]*index.html[^|]*│[^|]*http:\/\/[^|]*│[^|]*localhost[^|]*│[^|]*10040[^|]*│/);
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
                                "protocol"        : "http://",
                                "host"            : "localhost",
                                "port"            : 10040,
                            },
                            "Lavern" : {
                                "serverName"      : "Lavern",
                                "silent"          : false,
                                "defaultPage"     : "index.html",
                                "protocol"        : "http://",
                                "host"            : "localhost",
                                "port"            : 10040,
                            },
                            "Kristal": {
                                "serverName"      : "Kristal",
                                "silent"          : false,
                                "defaultPage"     : "index.html",
                                "protocol"        : "http://",
                                "host"            : "localhost",
                                "port"            : 10040,
                            }
                        };
                    anaLogger.table(arr);
                });

                expect(captured.stdout)
                    .to.contain("serverName │ silent │ defaultPage  │ protocol  │ host        │ port")
                    .to.match(/Nubia[^|]*│[^|]*'Nubia'[^|]*│[^|]*false[^|]*│[^|]*'index.html'[^|]*│[^|]*'http:\/\/'[^|]*│[^|]*'localhost'[^|]*│[^|]*10040/)
                    .to.match(/Lavern[^|]*│[^|]*'Lavern'[^|]*│[^|]*false[^|]*│[^|]*'index.html'[^|]*│[^|]*'http:\/\/'[^|]*│[^|]*'localhost'[^|]*│[^|]*10040/)
                    .to.match(/Kristal[^|]*│[^|]*'Kristal'[^|]*│[^|]*false[^|]*│[^|]*'index.html'[^|]*│[^|]*'http:\/\/'[^|]*│[^|]*'localhost'[^|]*│[^|]*10040/);
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

        it("should update the log id", function ()
        {
            const captured = capcon.captureStdio(function ()
            {
                anaLogger.log({context: LOG_CONTEXTS.TEST, lid: 123456, symbol: "raised_hand"}, "Test Log example with log" +
                    " identifier");
                anaLogger.log("Test Log example with DEFAULT target");
            });

            expect(captured.stdout).to.contain("TEST: (123456) ✋  Test Log example with log identifier");
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
            anaLogger.setOptions({silent: false, logToFile: "./test-log.txt"});
            anaLogger.log("Test Log example with DEFAULT target");

            const content = fs.readFileSync("./test-log.txt", "utf-8");
            expect(content).to.contain("Test Log example with DEFAULT target");
        });

        it("should disable logs to a file when logToFile is false", function ()
        {
            anaLogger.setOptions({silent: false, logToFile: false});
            anaLogger.log("This Log should be absent from the file");

            const content = fs.readFileSync("./test-log.txt", "utf-8");
            expect(content).not.to.contain("This Log should be absent from the file");
        });


    });
});