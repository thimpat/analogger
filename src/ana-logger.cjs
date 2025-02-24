/** to-esm-browser: remove **/
const path = require("path");
const fs = require("fs");
const os = require("os");
/** to-esm-browser: end-remove **/

// to-ansi is also used by the browser
const toAnsi = require("to-ansi");


const DEFAULT = {
    moduleName: "analogger",
    // Default values for remote-logging
    protocol: "http://",
    host    : "localhost",
    port    : 12000,
    // Path for analogger text data
    pathname: "analogger",
    // Path for analogger raw data
    binarypathname: "uploaded",
    // ---------------------------------
    loopback: "localhost",
    // ---------------------------------
    consoleDomId: "#analogger",
    logFilename : "./analogger.log"
};

const {
    COLOR_TABLE, SYSTEM, MAX_CHILDREN_DOM_ANALOGGER, CLASS_REMOVED_NOTIF, ADD_TYPE, CONSOLE_AREA_CLASSNAME,
    PREDEFINED_FORMATS, ANALOGGER_NAME, LINE_CLASSNAME
} = require("./constants.cjs");

const DEFAULT_LOG_TARGETS = {
    ALL : "ALL",
    USER: "USER"
};

const DEFAULT_LOG_LEVELS = {
    FATAL  : 5000,
    ERROR  : 4000,
    WARN   : 3000,
    INFO   : 2000,
    LOG    : 1000,
    DEBUG  : 500,
    ALL    : 200,
    OFF    : 0,
    INHERIT: -1,
};

/**
 * @typedef PLUGIN_TYPE
 * @type {{LOCAL: string, GLOBAL: string}}
 */
const PLUGIN_TYPE = {
    LOCAL : "local",
    GLOBAL: "global"
};

/**
 * @typedef PLUGIN_PROPERTIES_TYPE
 * @property {string} methodName AnaLogger's real method name that is set to the AnaLogger instance *
 * @property {function} callback AnaLogger method that will be called when invoking the plugin
 * @property {PLUGIN_TYPE} type Whether the plugin is accessible to the AnaLogger class or an instance
 */

const DEFAULT_LOG_CONTEXTS = {
    // The default context
    DEFAULT : {contextName: "DEFAULT", logLevel: DEFAULT_LOG_LEVELS.LOG, symbol: "check"},
    LOG     : {contextName: "LOG", logLevel: DEFAULT_LOG_LEVELS.LOG, symbol: "check"},
    DEBUG   : {contextName: "DEBUG", logLevel: DEFAULT_LOG_LEVELS.DEBUG},
    INFO    : {contextName: "INFO", logLevel: DEFAULT_LOG_LEVELS.INFO, color: "#B18904", symbol: "diamonds"},
    WARN    : {contextName: "WARN", logLevel: DEFAULT_LOG_LEVELS.WARN, color: COLOR_TABLE[0], symbol: "cross"},
    ERROR   : {contextName: "ERROR", logLevel: DEFAULT_LOG_LEVELS.ERROR},
    CRITICAL: {contextName: "CRITICAL", logLevel: DEFAULT_LOG_LEVELS.CRITICAL},
};

const {stringify} = require("flatted");
const {CONSOLE_HEADER_CLASSNAME, CONSOLE_FOOTER_CLASSNAME} = require("./constants.cjs");

const EOL = `
`;

const symbolNames = {
    airplane                  : "✈",
    anchor                    : "⚓",
    arrow_backward            : "◀",
    arrow_double_up           : "⏫",
    arrow_double_down         : "⏬",
    arrow_forward             : "▶",
    arrow_lower_right         : "↘",
    arrow_lower_left          : "↙",
    arrow_right_hook          : "↪",
    arrow_up_down             : "↕",
    arrow_upper_left          : "↖",
    arrow_upper_right         : "↗",
    ballot_box_with_check     : "☑",
    biohazard                 : "☣",
    black_circle              : "⏺",
    black_medium_small_square : "◾",
    black_medium_square       : "◼",
    black_nib                 : "✒",
    black_small_square        : "▪",
    black_square              : "⏹",
    chains                    : "⛓",
    check                     : "✔",
    chess_pawn                : "♟",
    cloud_and_rain            : "⛈",
    clubs                     : "♣",
    coffee                    : "☕",
    copyright                 : "©",
    cross                     : "❌",
    diamonds                  : "♦",
    divisions_ign             : "➗",
    double_triangle_right     : "⏭",
    double_triangle_left      : "⏮",
    email                     : "✉",
    eject                     : "⏏",
    exclamation_mark          : "❗",
    fast_forward              : "⏩",
    female_sign               : "♀",
    fist                      : "✊",
    fuel_pump                 : "⛽",
    gear                      : "⚙",
    hammer_and_pick           : "⚒",
    hand                      : "✋",
    hearts                    : "♥",
    infinity                  : "♾",
    information               : "ℹ",
    left_right_arrow          : "↔",
    leftwards_arrow_with_hook : "↩",
    male_sign                 : "♂",
    minus_sign                : "➖",
    no_entry                  : "⛔",
    partly_sunny              : "⛅",
    pencil                    : "✏",
    phone                     : "☎",
    plus_sign                 : "➕",
    question                  : "❔",
    radioactive               : "☢",
    raised_hand               : "✋",
    recycle                   : "♻",
    registered                : "®",
    relaxed                   : "☺",
    rewind                    : "⏪",
    scissors                  : "✂",
    snowman                   : "☃",
    spades                    : "♠",
    sparkles                  : "✨",
    star                      : "⭐",
    sunny                     : "☀",
    tent                      : "⛺",
    trademark                 : "™",
    triangle_with_vertical_bar: "⏯",
    umbrella                  : "☔",
    vertical_bars             : "⏸",
    watch                     : "⌚",
    white_frowning_face       : "☹",
    white_medium_square       : "◻",
    white_medium_small_square : "◽",
    white_small_square        : "▫",
    wheelchair                : "♿",
    white_circle              : "⚪",
    writing_hand              : "✍",
};

// --------------------------------------------------
// Helpers
// --------------------------------------------------
/**
 * https://stackoverflow.com/questions/17575790/environment-detection-node-js-or-browser
 * @returns {string}
 */
function detectEnvironment()
{
    if (typeof process === "object")
    {
        if (typeof process.versions === "object")
        {
            if (typeof process.versions.node !== "undefined")
            {
                return SYSTEM.NODE;
            }
        }
    }
    return SYSTEM.BROWSER;
}

const currentSystem = detectEnvironment();

/**
 * Tell whether we are in a Node environment
 * @returns {boolean}
 */
function isNode()
{
    return currentSystem === SYSTEM.NODE;
}

const COMMON_METHODS = [
    "alert",
    "assert",
    "keepLogHistory",
    "getLogHistory",
    "truncateMessage",
    "truncateMessage",
    "rawLog",
    "removeOverride",
    "removeOverrideError",
    "overrideConsole",
    "overrideError",
    "table",
    "rawInfo",
    "rawWarn",
    "rawError",
    "hasSeenLid",
    "addToLogHistory",
    "releaseLogHistory",
    "resetLogHistory",
    "setLogFormat",
    "resetLogFormatter",
    "getRawLogHistory",
];


/**
 * @module ____AnaLogger
 * @class ____AnaLogger
 */
class ____AnaLogger
{
    system = "";

    instanceId = "";
    instanceName = "";

    static #instances = [];

    logIndex = 0;
    logCounter = 0;

    #contexts = [];
    #targets = {};
    #levels = {};

    activeTargets = [];

    indexColor = 0;

    format = "";

    keepLog = false;
    logHistory = [];

    $containers = null;

    options = {
        hideHookMessage: false
    };

    #realConsoleLog = console.log;
    #realConsoleInfo = console.info;
    #realConsoleWarn = console.warn;
    #realConsoleError = console.error;
    #realConsoleDebug = console.debug;
    #realConsoleTable = console.table;

    #overridenMap = {
        log  : false,
        info : false,
        warn : false,
        error: false,
        debug: false,
        table: false,
    };

    static ALIGN = {
        LEFT : "LEFT",
        RIGHT: "RIGHT"
    };

    static ENVIRONMENT_TYPE = {
        BROWSER: "BROWSER",
        NODE   : "NODE",
        OTHER  : "OTHER"
    };

    static instanceCount = 0;

    static pluginTable = {};

    originalFormatFunction;


    constructor({name = "default"} = {})
    {
        this.system = detectEnvironment();

        this.format = this.onBuildLog.bind(this);
        this.originalFormatFunction = this.format;

        this.instanceName = name;

        this.instanceId = ____AnaLogger.instanceCount + "-" + Date.now();
        ____AnaLogger.#instances[____AnaLogger.instanceCount] = this;
        ++____AnaLogger.instanceCount;

        this.errorTargetHandler = this.onError.bind(this);
        this.errorUserTargetHandler = this.onErrorForUserTarget.bind(this);

        this.setOptions(this.options);

        this.rawLog = this.#realConsoleLog;
        this.rawInfo = this.#realConsoleInfo;
        this.rawWarn = this.#realConsoleWarn;
        this.rawError = this.#realConsoleError;

        this.ALIGN = ____AnaLogger.ALIGN;
        this.ENVIRONMENT_TYPE = ____AnaLogger.ENVIRONMENT_TYPE;

        this.#initialiseDefault();

        this.resetLogHistory();
    }

    getName()
    {
        return this.instanceName;
    }

    getId()
    {
        return this.instanceId;
    }

    keepLogHistory()
    {
        this.keepLog = true;
    }

    releaseLogHistory()
    {
        this.keepLog = false;
    }

    resetLogHistory()
    {
        this.logHistory = [];
    }

    addToLogHistory(obj)
    {
        obj = obj || {};
        this.logHistory.push(Object.assign({}, obj));
    }

    /**
     * Returns log entries
     * @note This method should return the list of objects rather than
     * the array of text
     * @param join
     * @param symbol
     * @returns {string|*[]}
     */
    getLogHistory(join = true, symbol = EOL)
    {
        const historyLog = this.logHistory || [];
        const history = [];
        historyLog.forEach((logEntry) =>
        {
            const {text} = logEntry;
            history.push(text);
        });

        if (!join)
        {
            return history;
        }

        return history.join(symbol);
    }

    getRawLogHistory()
    {
        return this.logHistory || [];
    }

    hasSeenLid(lid)
    {
        this.logHistory = this.logHistory || [];
        for (let i = 0; i < this.logHistory.length; ++i)
        {
            const log = this.logHistory[i] || {};
            const context = log.context || {};
            if (lid === context.lid)
            {
                return true;
            }
        }

        return false;
    }

    forceEnvironment(system)
    {
        this.forcedSystem = system;
    }

    /**
     * Tell whether we are in a Node environment
     * @returns {boolean}
     */
    isNode()
    {
        if (this && this.forcedSystem)
        {
            return this.forcedSystem === SYSTEM.NODE;
        }

        return isNode();
    }

    /**
     * Tell whether the logger runs from a browser
     * @returns {boolean}
     */
    isBrowser()
    {
        return !this.isNode();
    }

    resetLogger()
    {
        this.options = {};
        this.options.timeLenMax = 12;
        this.options.contextLenMax = 10;
        this.options.idLenMax = 5;
        this.options.lidLenMax = 6;
        this.options.messageLenMax = undefined;
        this.options.symbolLenMax = 60;
        this.options.hideHookMessage = undefined;
        this.options.hidePassingTests = undefined;
        this.options.hideLog = undefined;
        this.options.hideError = undefined;
        this.options.oneConsolePerContext = true;
        this.options.logToDom = undefined;
        this.options.logToFile = undefined;
        this.options.logToRemote = undefined;
        this.options.logToRemoteUrl = undefined;
        this.options.logToRemoteBinaryUrl = undefined;
        this.options.logToDomlogToFile = undefined;
        this.options.protocol = undefined;
        this.options.host = undefined;
        this.options.port = undefined;
        this.options.pathname = undefined;
        this.options.binarypathname = undefined;
        this.options.enableDate = undefined;
    }

    resetOptions()
    {
        this.resetLogger();
    }

    setOptions({
                   contextLenMax = 10,
                   idLenMax = 5,
                   lidLenMax = 6,
                   symbolLenMax = 2,
                   messageLenMax = undefined,
                   hideLog = undefined,
                   hideError = undefined,
                   hideHookMessage = undefined,
                   hidePassingTests = undefined,
                   logToDom = undefined,
                   logToFile = undefined,
                   logToRemote = undefined,
                   logToRemoteUrl = undefined,
                   logToRemoteBinaryUrl = undefined,
                   loopback = DEFAULT.loopback,
                   requiredLogLevel = DEFAULT_LOG_LEVELS.LOG,
                   oneConsolePerContext = undefined,
                   silent = undefined,
                   enableDate = undefined,
                   /** Remote - all optional **/
                   protocol = undefined,
                   host = undefined,
                   port = undefined,
                   pathname = undefined,
                   binarypathname = undefined
               } = null)
    {
        this.options.contextLenMax = contextLenMax;
        this.options.idLenMax = idLenMax;
        this.options.lidLenMax = lidLenMax;
        this.options.messageLenMax = messageLenMax;
        this.options.symbolLenMax = symbolLenMax;

        this.options.requiredLogLevel = requiredLogLevel;

        // TODO: Make one of silent or hideToLog options obsolete
        let solveSilent = undefined;
        if (silent !== undefined)
        {
            solveSilent = !!silent;
        }
        else if (hideLog !== undefined)
        {
            solveSilent = !!hideLog;
        }

        // Force boolean type
        [
            {hideLog: solveSilent},
            {oneConsolePerContext},
            {hideError},
            {enableDate},
            {hideHookMessage},
            {hidePassingTests},
            {logToRemote},
        ].forEach((feature) =>
        {
            const key = Object.keys(feature)[0];
            const val = feature[key];
            if (val !== undefined)
            {
                this.options[key] = !!val;
            }
        });

        // Any type
        [
            {logToRemoteBinaryUrl},
            {logToRemoteUrl},
            {loopback},
            {protocol},
            {host},
            {port},
            {pathname},
            {binarypathname},
        ].forEach((feature) =>
        {
            const key = Object.keys(feature)[0];
            const val = feature[key];
            if (val !== undefined)
            {
                this.options[key] = val;
            }
        });

        if (this.options.logToRemote && !this.options.logToRemoteUrl)
        {
            this.options.logToRemoteUrl = this.convertToUrl({
                protocol: this.options.protocol,
                host    : this.options.host,
                port    : this.options.port,
                pathname: this.options.pathname
            });
        }

        if (this.options.logToRemote && !this.options.logToRemoteBinaryUrl)
        {
            this.options.logToRemoteBinaryUrl = this.convertToUrl({
                protocol: this.options.protocol,
                host    : this.options.host,
                port    : this.options.port,
                pathname: this.options.binarypathname || DEFAULT.binarypathname
            });
        }

        // Special cases
        if (logToDom === false)
        {
            this.options.logToDom = false;
        }
        else if (logToDom !== undefined)
        {
            this.options.logToDom = (logToDom === true) ? DEFAULT.consoleDomId : logToDom;
        }

        if (logToFile === false)
        {
            this.options.logToFile = false;
        }
        else if (logToFile !== undefined)
        {
            if (!this.isBrowser())
            {
                this.options.logToFile = logToFile || DEFAULT.logFilename;

                /** to-esm-browser: remove **/
                // these require won't get compiled by to-esm
                this.options.logToFilePath = path.resolve(this.options.logToFile);
                this.EOL = os.EOL;
                /** to-esm-browser: end-remove **/
            }

            /** to-esm-browser: add
             this.#realConsoleLog("LogToFile is not supported in this environment. ")
             **/
        }

    }

    getOptions()
    {
        return this.options;
    }

    truncateMessage(input = "", {fit = 0, align = ____AnaLogger.ALIGN.LEFT, ellipsis = "..."} = {})
    {
        input = "" + input;
        if (fit && input.length > fit)
        {
            input = input.substring(0, fit - ellipsis.length) + ellipsis;
        }

        input = align === ____AnaLogger.ALIGN.LEFT ? input.padEnd(fit, " ") : input.padStart(fit, " ");
        return input;
    }

    /**
     * Format inputs
     * @see Override {@link setLogFormat}
     * @param contextName
     * @param id
     * @param message
     * @param lid
     * @param symbol
     * @returns {string}
     */
    onBuildLog({contextName, message = "", lid = "", symbol = ""} = {})
    {
        try
        {
            let strResult = "";

            const strs = message.split(/\n/g);

            for (let i = 0; i < strs.length; ++i)
            {
                let message0 = strs[i];

                // Time
                const now = new Date();
                let time = ("0" + now.getHours()).slice(-2) + ":" + ("0" + now.getMinutes()).slice(-2) + ":" + ("0" + now.getSeconds()).slice(-2);

                if (this.options.enableDate)
                {
                    let date = now.getFullYear().toString().slice(-2) + "-" + (now.getMonth() + 1).toString().padStart(2, "0") + "-" + now.getDate().toString().padStart(2, "0");
                    time = date + " " + time;
                }

                // Display content in columns
                time = this.truncateMessage(time, {fit: this.options.timeLenMax});

                if (i > 0)
                {
                    contextName = "";
                    lid = "";
                }
                contextName = this.truncateMessage(contextName, {
                    fit  : this.options.contextLenMax,
                    align: ____AnaLogger.ALIGN.RIGHT
                });
                lid = this.truncateMessage(lid, {fit: this.options.lidLenMax});

                if (this.options.messageLenMax !== undefined)
                {
                    message0 = this.truncateMessage(message0, {fit: this.options.messageLenMax});
                }

                symbol = this.truncateMessage(symbol, {fit: this.options.symbolLenMax});

                if (i <= 0)
                {
                    strResult += `[${time}] ${contextName}: (${lid}) ${symbol} ${message0}`;
                }
                else
                {
                    // If last line empty, don't display it
                    if (i < strs.length - 1)
                    {
                        strResult += "\n";
                        strResult += `[${time}] ${contextName}   ${lid}     ${message0}`;
                    }
                    else
                    {
                        if (message0)
                        {
                            strResult += "\n";
                            strResult += `[${time}] ${contextName}   ${lid}     ${message0}`;
                        }
                    }
                }
            }

            return strResult;
        }
        catch (e)
        {
            console.rawError(e.message);
        }

        return "";
    }

    onErrorForUserTarget(context, ...args)
    {
        this.errorUserTargetHandler(context, ...args);
    }

    onError(context, ...args)
    {
        if (context.target === this.#targets.USER)
        {
            this.onErrorForUserTarget(context, ...args);
        }
    }

    /**
     * Forward input to real console log
     * @param args
     */
    onDisplayLog(...args)
    {
        this.log(...args);
    }

    assistStask(error)
    {
        try
        {
            const lines = error.stack.split("\n");
            const stack = [];

            for (let i = 0; i < lines.length; ++i)
            {
                const line = lines[i];
                stack.push(line);
            }

            return stack;
        }
        catch (e)
        {
            console.rawError(e.message);
        }

        return error.message;
    }

    /**
     * Forward input to real console log
     * @param args
     */
    onDisplayError(...args)
    {
        try
        {
            let mainIndex = -1;
            let extracted = null;
            for (let i = 0; i < args.length; ++i)
            {
                const arg = args[i];
                if (arg instanceof Error)
                {
                    if (arg.stack)
                    {
                        mainIndex = i;
                        extracted = this.assistStask(arg) || [];
                        break;
                    }
                }
            }

            if (!extracted)
            {
                this.error(...args);
                return;
            }

            for (let i = 0; i < extracted.length; ++i)
            {
                args[mainIndex] = extracted[i];
                this.error(...args);
            }

        }
        catch (e)
        {
            console.rawError(e);
        }

    }

    /**
     * Set log template
     * @param format
     */
    setLogFormat(format)
    {
        if (typeof format !== "function")
        {
            console.error("Invalid parameter for setFormat. It is expecting a function or method.");
            return false;
        }
        this.format = format.bind(this);
    }

    resetLogFormatter()
    {
        this.format = this.originalFormatFunction;
    }

    setErrorHandler(handler)
    {
        this.errorTargetHandler = handler.bind(this);
    }

    setErrorHandlerForUserTarget(handler)
    {
        this.errorUserTargetHandler = handler.bind(this);
    }

    // ------------------------------------------------
    // Color
    // ------------------------------------------------

    // ------------------------------------------------
    // Log Contexts
    // ------------------------------------------------
    isContextValid(context)
    {
        if (
            !(typeof context === "object" &&
                !Array.isArray(context) &&
                context !== null)
        )
        {
            return false;
        }
        return (context.hasOwnProperty("contextName") && context.hasOwnProperty("target"));
    }

    /**
     * Set context properties for default context
     * @param context
     */
    setDefaultContext(context)
    {
        this.setContext(DEFAULT_LOG_CONTEXTS.DEFAULT.contextName, context);
    }

    /**
     * Generate a default context with a default color
     * @returns {*|{}}
     */
    generateDefaultContext()
    {
        let defaultContext = this.#contexts[DEFAULT_LOG_CONTEXTS.DEFAULT.contextName] || {};
        defaultContext = Object.assign({},
            {
                lid        : "",
                contextName: DEFAULT_LOG_CONTEXTS.DEFAULT.contextName,
                target     : DEFAULT_LOG_TARGETS.ALL,
                symbol     : "⚡",
                color      : COLOR_TABLE[1],
                logLevel   : DEFAULT_LOG_LEVELS.LOG
            }, defaultContext);

        defaultContext.name = defaultContext.contextName;

        defaultContext.id = this.logIndex++;
        return defaultContext;
    }

    /**
     * Generate a new context based on the default context.
     * The only difference with default is that a different color will be assigned to that context automatically
     * @returns {*|{}}
     */
    generateNewContext()
    {
        const newContext = this.generateDefaultContext();
        newContext.color = COLOR_TABLE[(this.indexColor++) % (COLOR_TABLE.length - 3) + 2];
        newContext.symbol = "";
        return newContext;
    }

    generateErrorContext()
    {
        const errorContext = this.generateDefaultContext();
        errorContext.contextName = DEFAULT_LOG_CONTEXTS.ERROR.contextName;
        errorContext.name = errorContext.contextName;
        errorContext.color = COLOR_TABLE[0];
        errorContext.symbol = "❌";
        errorContext.error = true;
        errorContext.logLevel = DEFAULT_LOG_LEVELS.ERROR;
        return errorContext;
    }

    /**
     * Use given context to generate new context
     * @param entry
     * @returns {any}
     */
    #defineContextProperties(entry)
    {
        const defaultContext = this.generateNewContext();
        const converted = Object.assign({}, defaultContext, entry);
        if (converted.color.toLowerCase().indexOf("rgb") > -1)
        {
            converted.color = toAnsi.rgbStringToHex(converted.color);
        }
        else if (converted.color.indexOf("#") === -1)
        {
            converted.color = toAnsi.colorNameToHex(converted.color);
        }

        return converted;
    }

    /**
     * Redefine a context
     * @param contextName
     * @param context
     */
    setContext(contextName, context = {})
    {
        context.contextName = contextName;
        context.name = contextName;
        context = this.#defineContextProperties(context);
        this.#contexts[contextName] = context;
    }

    getContext(contextName)
    {
        return this.#contexts[contextName];
    }

    /**
     * Load the context names that should be available to the environment.
     * They are defined by the user.
     * @see Context definitions {@link ./example/more/contexts-def.cjs}
     * @param contextTable
     */
    setContexts(contextTable)
    {
        const arr = Object.keys(contextTable);
        arr.forEach((contextName) =>
        {
            const contextPassed = contextTable[contextName] || {};
            this.setContext(contextName, contextPassed);
            contextTable[contextName] = this.#contexts[contextName];
        });
    }

    getContexts()
    {
        return Object.freeze(this.#contexts);
    }

    setTargets(targetTable = {})
    {
        let targetObjects = {};
        if (Array.isArray(targetTable))
        {
            try
            {
                for (let i = 0; i < targetTable.length; ++i)
                {
                    const entry = targetTable[i];
                    if (typeof entry === "string" || entry instanceof String)
                    {
                        targetObjects[entry] = entry;
                    }
                    else if (typeof entry === "object")
                    {
                        let found = null;
                        for (let prop in entry)
                        {
                            let valueProp = entry[prop];
                            prop = prop.trim();
                            if (!prop)
                            {
                                console.error(`Invalid target`);
                                break;
                            }

                            if (typeof valueProp === "string" || valueProp instanceof String)
                            {
                                valueProp = valueProp.trim();
                                found = [prop, valueProp];
                                break;
                            }

                            if (typeof valueProp === "number")
                            {
                                break;
                            }

                        }

                        if (found)
                        {
                            targetObjects[found[0]] = found[1];
                        }

                    }

                }
            }
            catch (e)
            {
                console.error({lid: 4321}, e.message);
            }
        }
        else
        {
            targetObjects = targetTable;
        }

        this.#targets = Object.assign({}, targetObjects, {...DEFAULT_LOG_TARGETS});
    }

    addTargets(targets)
    {
        const currentTargets = this.#targets;
        const merged = Object.assign({}, currentTargets, targets);
        this.setTargets(merged);
    }

    getTargets()
    {
        return Object.freeze(this.#targets);
    }

    /**
     * Set one or more active targets
     * @param targets
     */
    setActiveTargets(targets = null)
    {
        if (targets === null)
        {
            this.activeTargets = [DEFAULT_LOG_TARGETS.ALL];
            return;
        }
        else if (typeof targets === "string" || targets instanceof String)
        {
            targets = targets.split(",");
        }
        else if (typeof targets === "object" || typeof targets === "function")
        {
            return;
        }

        for (let i = 0; i < targets.length; ++i)
        {
            targets[i] = targets[i].trim();
        }

        this.activeTargets = targets;
    }

    getActiveTarget()
    {
        return this.activeTargets;
    }

    /**
     * Set only one active target
     * NOTE: Kept for backward compatibility.
     * Use setActiveTargets instead
     * @param target
     */
    setActiveTarget(target)
    {
        this.activeTargets = [];
        this.setActiveTargets(target);
        // In case of strings
        this.activeTargets = [this.activeTargets[0]];
    }

    setLogLevel(name, level)
    {
        this.#levels[name] = level;
    }

    getLogLevel(name)
    {
        return this.#levels[name];
    }

    setLogLevels(levels)
    {
        this.#levels = levels;
    }

    getLogLevels()
    {
        return Object.freeze(this.#levels);
    }

    isTargetAllowed(target)
    {
        // If target or activeTargets undefined, allow everything
        if (!target || !this.activeTargets || !this.activeTargets.length)
        {
            return true;
        }

        if (target === DEFAULT_LOG_TARGETS.ALL)
        {
            return true;
        }

        if (this.activeTargets.includes(DEFAULT_LOG_TARGETS.ALL))
        {
            return true;
        }

        return this.activeTargets.includes(target);
    }


    // ------------------------------------------------
    // Logging methods
    // ------------------------------------------------
    /**
     * Add many sections (columns) to a given DOM line
     * @param $line
     * @param context
     * @param text
     */
    setColumns($line, context, text)
    {
        let index = 0;
        for (let columnName in context)
        {
            if (!["contextName", "symbol", "lid", "text"].includes(columnName))
            {
                continue;
            }

            const colContent = context[columnName];
            const $col = document.createElement("span");
            $col.classList.add("analogger-col", `analogger-col-${columnName}`, `analogger-col-${index}`);
            ++index;
            $col.textContent = colContent;
            $line.append($col);
        }

        let $col = document.createElement("span");
        $col.classList.add("analogger-col", "analogger-col-text", `analogger-col-${index}`);
        $col.textContent = text;
        $line.append($col);

        // Add 3 more columns
        for (let i = 1; i <= 3; ++i)
        {
            $col = document.createElement("span");
            $col.classList.add("analogger-col", "analogger-col-extra", `analogger-extra-${i}`);
            $line.append($col);
        }
    }

    /**
     * Check that the div has not too many entries
     * @param $view
     */
    removeDomOldEntries = ($view) =>
    {
        const nbChildren = $view.childElementCount;
        if (nbChildren > MAX_CHILDREN_DOM_ANALOGGER)
        {
            const n = Math.ceil(MAX_CHILDREN_DOM_ANALOGGER / 10);
            for (let i = 0; i < n; ++i)
            {
                $view.removeChild($view.firstChild);
            }
            return n;
        }

        return 0;
    };

    /**
     * Scroll to bottom if div is already at the bottom
     * @param $view
     */
    scrollDivToBottom = ($view) =>
    {
        const scrollBottom = $view.scrollHeight - ($view.clientHeight + $view.scrollTop);
        const divHeight = $view.clientHeight || $view.offsetHeight;
        if (scrollBottom > divHeight / 2)
        {
            /* istanbul ignore next */
            return;
        }

        $view.scrollTop = $view.scrollHeight;
    };

    checkOnLoggingToDom(context, param2)
    {
        try
        {
            let callback = context.onLoggingToDom;
            if (typeof callback !== "function")
            {
                return;
            }

            return callback.call(this, context, param2);
        }
        catch (e)
        {
        }
    }

    /**
     * Add a line to the Analogger div.
     * Remove older lines if exceeding limit.
     * @param $view
     * @param $line
     * @param context
     * @param addType
     * @param message
     * @param text
     * @param args
     */
    addLineToDom($view, $line, {context, addType, message, text, args})
    {
        let proceedFurther = this.checkOnLoggingToDom(context, {
            message,
            text,
            args,
            logCounter: this.logCounter,
            $view,
            $line,
            addType
        });

        // If one of the plugins returns false, no further operation will follow
        if (proceedFurther === false)
        {
            return;
        }

        if (addType === ADD_TYPE.BOTTOM)
        {
            $view.append($line);
        }
        else
        {
            $view.insertBefore($line, $view.firstChild);
        }

        let nbRemoved = this.removeDomOldEntries($view);
        if (nbRemoved)
        {
            if ($view.getElementsByClassName(CLASS_REMOVED_NOTIF).length)
            {
                return;
            }

            this.showRemovedNotification(context);
            return;
        }

        this.scrollDivToBottom($view);

    }

    showRemovedNotification(context)
    {
        context.contextName = ANALOGGER_NAME;
        context.symbol = "🗑";
        context.color = "orange";
        context.className = CLASS_REMOVED_NOTIF;

        clearTimeout(this.timerAddLineToDomID);
        this.timerAddLineToDomID = setTimeout(() =>
        {
            this.timerAddLineToDomID = null;
            /* istanbul ignore next */
            this.writeLogToDom(context, "", {addType: ADD_TYPE.TOP, message: `Oldest entries removed`});
        }, 500);
    }

    writeLogToDom(context, fullText, {addType = ADD_TYPE.BOTTOM, message = "", args = null} = {})
    {
        this.$containers = this.$containers || document.querySelectorAll(this.options.logToDom);
        fullText = message || fullText;

        for (let i = 0; i < this.$containers.length; ++i)
        {
            const $container = this.$containers[i];

            let $header = $container.querySelector("." + CONSOLE_HEADER_CLASSNAME);
            if (!$header)
            {
                $header = document.createElement("div");
                $header.classList.add(CONSOLE_HEADER_CLASSNAME);

                $header.append(document.createElement("span"));
                $header.append(document.createElement("span"));
                $header.append(document.createElement("span"));

                $container.append($header);
            }

            let $view = $container.querySelector("." + CONSOLE_AREA_CLASSNAME);
            if (!$view)
            {
                $view = document.createElement("div");
                $view.classList.add(CONSOLE_AREA_CLASSNAME);
                $container.append($view);
            }

            let $footer = $container.querySelector("." + CONSOLE_FOOTER_CLASSNAME);
            if (!$footer)
            {
                $footer = document.createElement("div");
                $footer.classList.add(CONSOLE_FOOTER_CLASSNAME);

                $footer.append(document.createElement("span"));
                $footer.append(document.createElement("span"));
                $footer.append(document.createElement("span"));

                $container.append($footer);
            }

            const $line = document.createElement("div");
            $line.classList.add(LINE_CLASSNAME);
            if (context.className)
            {
                $line.classList.add(context.className);
            }
            $line.style.color = context.color;

            this.setColumns($line, context, fullText, args);

            // Prevent the application to be stuck when many logs are entered at once
            /* istanbul ignore next */
            setTimeout(/* istanbul ignore next */function ($view, $line, {addType, context, message, text, args})
            {
                /* istanbul ignore next */
                this.addLineToDom($view, $line, {addType, context, message, text, args});
            }.bind(this, $view, $line, {addType, context, message, text: fullText, args}), 0);

        }
    }

    writeLogToFile(text)
    {
        try
        {
            fs.appendFileSync(this.options.logToFilePath, text + this.EOL);
        }
        catch (e)
        {
            /* istanbul ignore next */
            console.rawError("LOG_TO_FILE_FAILURE: ", e.message);
        }
    }

    writeLogToRemote(...data)
    {
        try
        {
            const urlDest = this.generateLogToRemoteUrl(this.options.logToRemoteUrl);
            if (!urlDest)
            {
                return null;
            }

            const entry = [...data];
            const stringified = JSON.stringify(entry);
            fetch(urlDest, {
                method : "post",
                body   : stringified,
                headers: {"Content-Type": "application/json"},
            })
                .then(res => res.json())
                .catch(() => null);
        }
        catch (e)
        {
            /* istanbul ignore next */
            console.rawError("LOG_TO_REMOTE_FAILURE: ", e.message);
        }
    }

    /**
     * Send data to the registered remote server
     * @param raw
     * @param context
     * @param done
     */
    uploadDataToRemote(raw, context = null, done = null)
    {
        try
        {
            if (!this.options.logToRemote)
            {
                return;
            }

            const urlDest = this.generateLogToRemoteUrl(this.options.logToRemoteBinaryUrl, {pathname: DEFAULT.binarypathname});
            if (!urlDest)
            {
                return null;
            }

            let data = raw;
            if (context)
            {
                data = JSON.stringify({raw, context});
            }

            fetch(urlDest, {
                method: "post",
                body  : data,
            })
                .then((response) => response.json())
                .then((data) => done && done(data))
                .catch(e => e);
        }
        catch (e)
        {
            /* istanbul ignore next */
            console.rawError("BINARY_TO_REMOTE_FAILURE: ", e.message);
        }
    }

    stringifyEntry(arg)
    {
        let str;

        try
        {
            str = JSON.stringify(arg);
        }
        catch (e)
        {

        }

        if (!str)
        {
            try
            {
                str = stringify(arg);
            }
            catch (e)
            {

            }
        }

        return str;
    }

    /**
     * If a variable is too complex for the logger, stringify it
     */
    convertEntry(arg)
    {
        try
        {
            if (arg === null || arg === undefined || arg === "")
            {
                return arg;
            }
            else if (typeof arg === "boolean")
            {
                return arg;
            }
            else if (typeof arg === "symbol")
            {
                return arg;
            }
            if (typeof arg === "number")
            {
                return arg;
            }
            else if (typeof arg === "string" || myVar instanceof arg)
            {
                return arg;
            }
            else if (arg instanceof Date)
            {
                return arg;
            }
        }
        catch (e)
        {
        }

        return this.stringifyEntry(arg);
    }

    convertArgumentsToText(args)
    {
        const strs = [];
        let text;
        const n = args.length;
        for (let i = 0; i < n; ++i)
        {
            let str;
            let arg = args[i];

            str = this.convertEntry(arg);

            strs.push(str);
        }

        text = strs.join("•");
        return text;
    }

    writeToConsole(output, context)
    {
        const res = [output];
        if (this.isBrowser())
        {
            res.push(`color: ${context.color}`);
        }

        const contextLevel = context.contextLevel || DEFAULT_LOG_LEVELS.LOG;
        if (contextLevel >= DEFAULT_LOG_LEVELS.ERROR)
        {
            this.#realConsoleError(...res);
        }
        else if (contextLevel >= DEFAULT_LOG_LEVELS.WARN)
        {
            this.#realConsoleWarn(...res);
        }
        else if (contextLevel >= DEFAULT_LOG_LEVELS.INFO)
        {
            this.#realConsoleInfo(...res);
        }
        else if (contextLevel >= DEFAULT_LOG_LEVELS.LOG)
        {
            this.#realConsoleLog(...res);
        }
        else if (contextLevel >= DEFAULT_LOG_LEVELS.DEBUG)
        {
            this.#realConsoleDebug(...res);
        }

    }

    /**
     * Parse the context. If one of its keys has the same name as a registered plugin,
     * the system will invoke the plugin (the value of the key must be anything truthy).
     * @param context
     * @param extras
     * @returns {undefined|boolean}
     */
    checkPlugins(context, {message, text, args, logCounter})
    {
        try
        {
            if (!Object.keys(____AnaLogger.pluginTable).length)
            {
                return;
            }

            let proceedFurther = true;
            for (let keyName in context)
            {
                const pluginOptions = context[keyName];

                /**
                 * The key has been passed in the context, but has a falsy value,
                 * so let's ignore it
                 */
                if (!pluginOptions)
                {
                    continue;
                }

                /**
                 * Extract plugin properties
                 * @type PLUGIN_TYPE
                 */
                const pluginProperties = ____AnaLogger.pluginTable[keyName];

                /**
                 * Check plugin properties exists
                 * @see addPlugin
                 * @see addGlobalPlugin
                 */
                if (!pluginProperties)
                {
                    continue;
                }

                // Should be an object
                if (typeof pluginProperties !== "object")
                {
                    continue;
                }

                /**
                 * Extract plugin properties
                 */
                const {callback, methodName, type} = pluginProperties;
                if (typeof callback !== "function")
                {
                    continue;
                }

                /**
                 * Invoke the plugin
                 */
                let res = callback.call(this, context, {
                    message,
                    text,
                    args,
                    logCounter,
                    methodName,
                    type,
                    pluginOptions
                });

                // If the plugin returns exactly false, the log entry will be ignored by anaLogger
                if (res === false)
                {
                    proceedFurther = false;
                }
            }
            return proceedFurther;
        }
        catch (e)
        {
        }
    }

    /**
     * If the context contain a key onLogging that is a function,
     * execute
     * @param context
     * @param extras
     * @returns {*}
     */
    checkOnLogging(context, extras)
    {
        try
        {
            let callback = context.onLogging;
            if (typeof callback !== "function")
            {
                return;
            }

            return callback.call(this, context, extras);
        }
        catch (e)
        {
        }
    }

    /**
     * Display log following template
     * @param context
     */
    processOutput(context = {})
    {
        try
        {
            let message = "";
            this.applySymbolByName(context);

            if (!this.isTargetAllowed(context.target))
            {
                return;
            }

            if (context.logLevel === DEFAULT_LOG_LEVELS.OFF)
            {
                return;
            }

            if (this.options.requiredLogLevel > context.logLevel)
            {
                return;
            }

            // Clone arguments without the context (= the first argument passed) to generate the message
            let args = Array.prototype.slice.call(arguments, 1 /* => Ignore arguments[0] = context */);

            message = this.convertArgumentsToText(args);

            let output = "";
            let text = this.format({...context, message});

            if (this.keepLog)
            {
                this.addToLogHistory({context, message, text});
            }

            ++this.logCounter;

            let proceedFurther;

            proceedFurther = this.checkOnLogging(context, {message, text, args, logCounter: this.logCounter});
            // If one of the plugins returns false, no further operation will follow
            if (proceedFurther === false)
            {
                return;
            }

            proceedFurther = this.checkPlugins(context, {message, text, args, logCounter: this.logCounter});

            // If one of the plugins returns false, no further operation will follow
            if (proceedFurther === false)
            {
                return;
            }

            if (this.options.logToRemote)
            {
                this.writeLogToRemote(context, ...args);
            }

            /* istanbul ignore next */
            if (this.isBrowser())
            {
                context.environnment = ____AnaLogger.ENVIRONMENT_TYPE.BROWSER;
                /* istanbul ignore next */
                if (this.options.logToDom)
                {
                    /* istanbul ignore next */
                    this.writeLogToDom(context, text, {message, args,});
                }

                output = `%c${text}`;
            }
            else
            {
                context.environnment = ____AnaLogger.ENVIRONMENT_TYPE.NODE;
                output = toAnsi.getTextFromColor(text, {
                    fg         : context.color,
                    bg         : context.bgColor,
                    isBold     : context.bold,
                    isUnderline: context.underline,
                    isReversed : context.reversed
                });

                if (this.options.logToFile)
                {
                    this.writeLogToFile(text);
                }
            }

            if (this.options.hideLog || context.hideLog || context.silent)
            {
                return;
            }

            this.writeToConsole(output, context);

            this.errorTargetHandler(context, args);
        }
        catch (e)
        {
            /* istanbul ignore next */
            console.rawError("AnaLogger:", e.message);
        }
    }

    /**
     * Check that a parameter uses the expected AnaLogger format.
     * For this, the first parameter should be an object that contains at least
     * a logging id (lid), a target, a contextName, etc
     * @param options
     * @returns {boolean}
     */
    isExtendedOptionsPassed(options)
    {
        if (typeof options !== "object")
        {
            return false;
        }

        return options.hasOwnProperty("context") ||
            options.hasOwnProperty("target") ||
            options.hasOwnProperty("color") ||
            options.hasOwnProperty("contextName") ||
            options.hasOwnProperty("raw") ||
            options.hasOwnProperty("lid");
    }

    /**
     * Convert a string into a Context object if possible
     * TODO: To implement in next version
     * @param str
     * @returns {string}
     */
    extractContextFromInput(str)
    {
        if (typeof str === "string" || str instanceof String)
        {
            if (str.toLowerCase().indexOf("lid:") !== 0)
            {
                return str;
            }
        }

        return str;
    }

    listSymbols()
    {
        for (let key in symbolNames)
        {
            console.rawLog(symbolNames[key] + `   ${key} `);
        }
    }

    applySymbolByName(context)
    {
        try
        {
            if (context.symbol && symbolNames[context.symbol])
            {
                context.symbol = symbolNames[context.symbol];
            }
        }
        catch (e)
        {

        }
    }

    /**
     * Convert the first parameter of a console.log to a Context object
     * @param options
     * @param defaultContext
     * @returns {*|{}}
     */
    convertToContext(options, defaultContext)
    {
        options = options || defaultContext;

        let context = options;

        // Flatten option object. For instance,
        // {something: "some1", something2: "some2", context: {lid: 3000, color: "purple"}}
        // Will become {something: "some1", something2: "some2", lid: 3000, color: "purple"}
        if (options.context && typeof options.context === "object")
        {
            const moreOptions = Object.assign({}, options);
            delete moreOptions.context;
            context = Object.assign({}, options.context, moreOptions);
        }

        context = Object.assign({}, defaultContext, context);
        delete context.context;

        return context;
    }

    /**
     * console.log with options set on the first parameter to dictate console log behaviours
     * @param options
     * @param args
     */
    log(options, ...args)
    {
        options = this.extractContextFromInput(options);
        // If the first parameter is not of context format,
        // We use the default context and display
        if (!this.isExtendedOptionsPassed(options))
        {
            const defaultContext = this.generateDefaultContext();
            this.processOutput.apply(this, [defaultContext, options, ...args]);
            return;
        }

        const someContext = this.generateDefaultContext();
        let context = this.convertToContext(options, someContext);

        if (context.raw)
        {
            this.#realConsoleLog(...args);
            return;
        }

        this.processOutput.apply(this, [context, ...args]);
    }

    error(options, ...args)
    {
        if (this.options.hideError)
        {
            return;
        }

        options = this.extractContextFromInput(options);

        // If the first parameter is not of context format,
        // We use the error context and display
        if (!this.isExtendedOptionsPassed(options))
        {
            const defaultContext = this.generateErrorContext();
            this.processOutput.apply(this, [defaultContext, options, ...args]);
            return;
        }

        const errorContext = this.generateErrorContext();
        let context = this.convertToContext(options, errorContext);

        let args0 = Array.prototype.slice.call(arguments, 1);
        this.log(context, ...args0);
    }

    overrideError()
    {
        if (!this.options.hideHookMessage)
        {
            this.#realConsoleLog("AnaLogger: Hook placed on console.error");
        }
        this.#overridenMap.error = true;
        console.error = this.onDisplayError.bind(this);
    }

    attachConsole()
    {
        try
        {
            console.rawLog = this.#realConsoleLog;
            console.raw = this.#realConsoleLog;

            console.rawInfo = this.#realConsoleInfo;
            console.rawWarn = this.#realConsoleWarn;
            console.rawError = this.#realConsoleError;

            console.logHistory = this.logHistory;

            console.logHistory = this.logHistory;
            COMMON_METHODS.forEach((name) =>
            {
                console[name] = function (...args)
                {
                    this[name](...args);
                }.bind(this);
            });

            return true;
        }
        catch (e)
        {
            console.error({lid: 4321}, e.message);
        }

        return false;
    }

    overrideConsole({log = true, info = true, warn = true, error = false} = {})
    {
        if (!this.options.hideHookMessage)
        {
            this.#realConsoleLog("AnaLogger: Hook placed on console.log");
        }

        [{log}, {info}, {warn},].forEach(function (methodObj)
        {
            const methodName = Object.keys(methodObj)[0];
            if (methodObj[methodName])
            {
                this.#overridenMap[methodName] = true;
                console[methodName] = this.onDisplayLog.bind(this);
            }
        }.bind(this));

        if (error)
        {
            this.overrideError();
        }

        this.attachConsole();
    }

    removeOverrideError()
    {
        console.error = this.#realConsoleError;
        this.#overridenMap.error = false;
    }

    removeOverride({log = true, info = true, warn = true, error = false} = {})
    {
        if (log)
        {
            console.log = this.#realConsoleLog;
            this.#overridenMap.log = false;
        }

        if (info)
        {
            console.info = this.#realConsoleInfo;
            this.#overridenMap.info = false;
        }

        if (warn)
        {
            console.warn = this.#realConsoleWarn;
            this.#overridenMap.warn = false;
        }

        if (error)
        {
            this.removeOverrideError();
        }

    }

    info(...args)
    {
        return this.log(...args);
    }

    warn(...args)
    {
        return this.log(...args);
    }

    table(...args)
    {
        if (!this.#overridenMap.log)
        {
            this.#realConsoleTable(...args);
            return;
        }

        const currentLog = console.log;
        console.log = this.#realConsoleLog;
        this.#realConsoleTable(...args);
        console.log = currentLog;
    }

    alert(...args)
    {
        if (!this.isBrowser())
        {
            return this.log(...args);
        }

        let message;
        if (args && ((args[0] && args[0].hasOwnProperty("lid")) || this.isContextValid(args[0])))
        {
            const someContext = this.generateDefaultContext();
            let context = this.convertToContext(args[0], someContext);

            message = context.lid + ": " + args.slice(1).join(" | ");
        }
        else
        {
            message = args.join(" | ");
        }

        alert(message);
    }

    assert(condition, expected = true, ...args)
    {
        let result;

        try
        {
            if (typeof condition === "function")
            {
                result = condition(...args);
                if (result !== expected)
                {
                    this.error("Asset failed");
                    return false;
                }

                if (!this.options.hidePassingTests)
                {
                    this.log("SUCCESS: Assert passed");
                }
                return true;
            }

            if (condition !== expected)
            {
                this.error("Assert failed");
                return false;
            }

            if (!this.options.hidePassingTests)
            {
                this.log("SUCCESS: Assert passed");
            }
            return true;
        }
        catch (e)
        {
            this.error("Unexpected error in assert");
        }

        return false;
    }

    /**
     * Set default targets, contexts and log levels
     * @returns {boolean}
     */
    #initialiseDefault()
    {
        try
        {
            // Register default targets: ALL and USER
            this.setTargets(DEFAULT_LOG_TARGETS);

            // Register default log levels
            this.setLogLevels(DEFAULT_LOG_LEVELS);

            // Register default context
            this.setContexts(DEFAULT_LOG_CONTEXTS);
        }
        catch (e)
        {
            console.error({lid: 4321}, e.message);
        }

        return false;
    }

    /**
     * Set standard Analogger format
     * @example
     * // Output Example
     * // [14:01:06]    DEFAULT: (1060) ⚡  " ✔ My log ..."
     * @param activeTarget
     * @param override
     * @returns {boolean}
     */
    applyAnalogFormatting({activeTarget = "", override = false} = {})
    {
        try
        {
            const lidLenMax = 6;

            const LOG_CONTEXTS = {
                STANDARD: null,
                TEST    : {color: "#B18904", symbol: "diamonds"},
            };

            this.setDefaultContext(LOG_CONTEXTS.DEFAULT);

            activeTarget && this.setActiveTarget(activeTarget);

            this.setOptions({silent: false, hideError: false, hideHookMessage: true, lidLenMax});
            if (override)
            {
                this.overrideConsole();
                this.overrideError();
            }

            return true;
        }
        catch (e)
        {
            /* istanbul ignore next */
            console.error({lid: 3249}, e.message);
        }

        /* istanbul ignore next */
        return false;
    }

    applyPredefinedFormat(name = PREDEFINED_FORMATS.DEFAULT_FORMAT, {activeTarget = "", override = false} = {})
    {
        if (name === PREDEFINED_FORMATS.DEFAULT_FORMAT)
        {
            return this.applyAnalogFormatting({activeTarget, override});
        }
    }

    static generateInstance()
    {
        const analogger = new ____AnaLogger();
        return analogger;
    }

    /**
     * Returns an AnaLogger instance
     * @returns {null}
     */
    static getInstance(num = 0)
    {
        if (!____AnaLogger.instanceCount)
        {
            return null;
        }
        return ____AnaLogger.#instances[num];
    }

    /**
     * Returns first existing AnaLogger instance,
     * otherwise create a new instance
     * @returns {*|____AnaLogger}
     */
    static generateMainInstance()
    {
        const mainInstance = ____AnaLogger.getInstance();
        if (!mainInstance)
        {
            return new ____AnaLogger();
        }

        return mainInstance;
    }

    /**
     * Override console.log and console.error
     */
    static startLogger()
    {
        const active = ____AnaLogger.generateMainInstance();
        active.applyPredefinedFormat(PREDEFINED_FORMATS.DEFAULT_FORMAT, {override: true});
    }

    static stopLogger()
    {
        const active = ____AnaLogger.generateMainInstance();
        active.removeOverride();
        active.removeOverrideError();
    }

    convertToUrl({
                     protocol = DEFAULT.protocol,
                     host = DEFAULT.host,
                     port = DEFAULT.port,
                     pathname = DEFAULT.pathname
                 } = {})
    {
        const url = new URL("http://localhost");
        url.protocol = protocol;
        url.host = host;
        url.port = port;
        if (pathname)
        {
            url.pathname = pathname;
        }

        return url.toString();
    }

    generateLogToRemoteUrl(logToRemoteUrl = null, {pathname = DEFAULT.pathname} = {})
    {
        if (typeof logToRemoteUrl === "string" || logToRemoteUrl instanceof String)
        {
            return logToRemoteUrl;
        }

        if (!this.isBrowser())
        {
            return null;
        }

        const protocol = this.options.protocol || window.location.protocol + "//";
        const host = this.options.host || window.location.host || DEFAULT.host;
        const port = this.options.port || DEFAULT.port;
        pathname = this.options.pathname || pathname;

        return this.convertToUrl({protocol, host, port, pathname});
    }

    /**
     * Install a plugin against the active instance
     * @param methodName
     * @param callback
     * @param pluginName
     */
    addPlugin(methodName, callback, pluginName = "")
    {
        pluginName = pluginName || methodName;
        this[methodName] = callback;

        ____AnaLogger.pluginTable[pluginName] = {
            type: PLUGIN_TYPE.LOCAL,
            methodName,
            callback
        };
    }

    /**
     * Install a plugin against the class (an instantiation with new is needed)
     * @param methodName
     * @param callback
     * @param pluginName
     */
    addGlobalPlugin(methodName, callback, pluginName)
    {
        ____AnaLogger[methodName] = callback;

        ____AnaLogger.pluginTable[pluginName] = {
            type: PLUGIN_TYPE.GLOBAL,
            methodName,
            callback
        };

    }

    getPluginList()
    {
        return Object.keys(____AnaLogger.pluginTable);
    }

    /**
     * At the moment, this method behaviour is equivalent to an eventual isPluginRegistered method
     * @param name
     * @returns {boolean}
     */
    validatePlugin(name)
    {
        if (____AnaLogger.pluginTable[name])
        {
            return true;
        }

        console.warn(`The plugin ${name} is not registered`);
        return false;
    }

}

// Export the class as default export
const __AnaLogger = ____AnaLogger;
module.exports = __AnaLogger;

// Export an instance
const ___anaLogger = ____AnaLogger.generateMainInstance();
module.exports.anaLogger = ___anaLogger;

// Export the class as named export
const _AnaLogger = ____AnaLogger;
module.exports.AnaLogger = _AnaLogger;

module.exports.DEFAULT_LOG_LEVELS = DEFAULT_LOG_LEVELS;
module.exports.DEFAULT_LOG_CONTEXTS = DEFAULT_LOG_CONTEXTS;
module.exports.DEFAULT_LOG_TARGETS = DEFAULT_LOG_TARGETS;

