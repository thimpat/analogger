"use strict";
const Mocha = require("mocha");
const {anaLogger} = require("./src/ana-logger.cjs");

const LOG_CONTEXTS = {
    DEFAULT: {color: "#328288", symbol: "black_medium_small_square"},
    PENDING: {color: "#d5d7d7", symbol: "arrow_forward"},
    PASS   : {color: "#54863b", symbol: "black_medium_small_square"},
    FOLDER : {color: "#e59a65", symbol: "📁"},
    COFFEE : {color: "rgb(121,101,94)", symbol: "coffee"},
    FAIL   : {color: "rgb(145,52,52)", symbol: "cross"},
    RETRY  : {color: "rgb(210,137,54)", symbol: "cross"},
    TIME   : {color: "rgb(77,74,74)", symbol: "cross"},
    END    : {color: "rgb(52,81,145)", symbol: "cross", bold: true},
};

anaLogger.setOptions({hideHookMessage: true/*, silent: true*/});
anaLogger.overrideConsole();
anaLogger.overrideError();
anaLogger.setDefaultContext(LOG_CONTEXTS.DEFAULT);
anaLogger.setContexts(LOG_CONTEXTS);

let port = process.env.ANALOGGER_TEST_PORT || 8221;
port = parseInt(port);
anaLogger.log(`Reaching port for test: ${port}`);
// anaLogger.setOptions({logToRemote: true, logToRemoteUrl: "http://localhost:8221/analogger"});
anaLogger.setOptions({logToRemote: true, port});

const {
    EVENT_RUN_BEGIN,
    EVENT_RUN_END,
    EVENT_TEST_FAIL,
    EVENT_TEST_PASS,
    EVENT_TEST_PENDING,
    EVENT_TEST_RETRY,
    EVENT_TEST_BEGIN,
    EVENT_TEST_END,
    EVENT_SUITE_BEGIN,
    EVENT_SUITE_END
} = Mocha.Runner.constants;

// this reporter outputs test results, indenting two spaces per suite
class MyReporter
{
    constructor(runner)
    {
        this._indents = 0;
        const stats = runner.stats;

        runner
            .once(EVENT_RUN_BEGIN, () =>
            {
                this.timeSuite1 = new Date();

                anaLogger.log({...LOG_CONTEXTS.COFFEE, lid: 1500}, "".padEnd(60, "◼"));
                anaLogger.log({...LOG_CONTEXTS.COFFEE, lid: 1500}, `TEST STARTED: `);
                anaLogger.log({...LOG_CONTEXTS.COFFEE, lid: 1500}, "".padEnd(60, "◼"));

                const time = new Date().toJSON().split("T")[1].split(".")[0];
                anaLogger.log({lid: time}, `${Date().toString()}`);
            })
            .on(EVENT_SUITE_BEGIN, (test) =>
            {
                anaLogger.log({...LOG_CONTEXTS.FOLDER, lid: "_"}, `${this.indent()}${test.title}`);
                this.increaseIndent();
            })
            .on(EVENT_SUITE_END, () =>
            {
                this.decreaseIndent();
            })
            .on(EVENT_TEST_PENDING, test =>
            {
                anaLogger.log({...LOG_CONTEXTS.PENDING, lid: 1500}, `${this.indent()}PENDING: ${test.fullTitle()}`);
            })
            .on(EVENT_TEST_RETRY, test =>
            {
                anaLogger.log({...LOG_CONTEXTS.RETRY, lid: 1500}, `${this.indent()}RETRYING: ${test.fullTitle()}`);
            })
            .on(EVENT_TEST_BEGIN, test =>
            {
                this.time1 = new Date();
                anaLogger.log({...LOG_CONTEXTS.DEFAULT, lid: "_"}, `${this.indent()}${test.title}`);
            })
            .on(EVENT_TEST_END, () =>
            {
                this.time1 = null;
            })
            .on(EVENT_TEST_PASS, (/*test*/) =>
            {
                this.time2 = new Date();
                const diffTime = (this.time2.getTime() - this.time1.getTime()) / 1000;
                anaLogger.log({...LOG_CONTEXTS.PASS, lid: diffTime + "s"}, `${this.indent()}✔ PASS`);
            })
            .on(EVENT_TEST_FAIL, (test, err) =>
            {
                this.time2 = new Date();
                const diffTime = (this.time2.getTime() - this.time1.getTime()) / 1000;
                anaLogger.error({...LOG_CONTEXTS.FAIL, lid: diffTime + "s"}, `${this.indent()}FAIL => ${err.message}`);
            })
            .once(EVENT_RUN_END, () =>
            {
                this.timeSuite2 = new Date();
                const diffTime = (this.timeSuite2.getTime() - this.timeSuite1.getTime()) / 1000;

                const symbolTable = ["🙀", "😿", "🤔", "⭐",];

                const symbolValue = Math.floor(100 / symbolTable.length);                           // 25%
                const testPercentage = Math.floor(100 * stats.passes / (stats.passes + stats.failures));           // 90%
                const resultSymbol = Math.floor(testPercentage / symbolValue) - 1;
                const symbol = symbolTable[resultSymbol];

                if (testPercentage >= 100)
                {
                    anaLogger.log({
                        ...LOG_CONTEXTS.END,
                        lid: diffTime + "s",
                        symbol
                    }, `SUCCESS: ◼◼◼ ${stats.passes}/${stats.passes + stats.failures} ◼◼◼`);
                }
                else
                {
                    anaLogger.error({
                        ...LOG_CONTEXTS.ERROR,
                        lid  : diffTime + "s",
                        color: "red",
                        symbol
                    }, `FAILED: ◼◼◼ ${stats.passes}/${stats.passes + stats.failures} ◼◼◼`);
                }

            });
    }

    indent()
    {
        return "".padEnd(this._indents, ".");
    }

    increaseIndent()
    {
        this._indents += 8;
    }

    decreaseIndent()
    {
        this._indents -= 8;
    }
}

module.exports = MyReporter;