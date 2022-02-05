const chalk = require("chalk-cjs");
const colorConvert = require('color-convert-cjs');
const rgbHex = require('rgb-hex-cjs');

const {COLOR_TABLE, SYSTEM} = require("./constants.cjs");


class QuickLog
{
    system = ""

    logIndex = 0;
    contexts = [];
    targets = [];

    indexColor = 0;

    format = ""
    colors = {};

    options = {}

    static ALIGN = {
        LEFT : "LEFT",
        RIGHT: "RIGHT"
    }

    constructor()
    {
        this.system = (typeof process === "object") ? SYSTEM.NODE : SYSTEM.BROWSER
        this.format = this.onDisplay.bind(this)
        this.setOptions(this.options)
    }

    /**
     * Tell whether we are in a Node environment
     * @returns {boolean}
     */
    isNode()
    {
        return this.system === SYSTEM.NODE
    }

    /**
     * Tell whether the logger runs from a browser
     * @returns {boolean}
     */
    isBrowser()
    {
        return !this.isNode()
    }

    setOptions({
                   contextLenMax = 10,
                   idLenMax = 5,
                   lidLenMax = 5,
                   symbolLenMax = 2,
                   messageLenMax = 60
               } = {})
    {
        this.options.contextLenMax = contextLenMax
        this.options.idLenMax = idLenMax
        this.options.lidLenMax = lidLenMax
        this.options.messageLenMax = messageLenMax
        this.options.symbolLenMax = symbolLenMax
    }

    truncateMessage(input = "", {fit = 0, align = QuickLog.ALIGN.LEFT})
    {
        try
        {
            input = "" + input
            if (fit && input.length >= fit + 2)
            {
                input = input.substring(0, fit - 3) + "...";
            }

            input = align === QuickLog.ALIGN.LEFT ? input.padEnd(fit + 1, " ") : input.padStart(fit + 1, " ")
            return input
        }
        catch (e)
        {
            console.error(`QuickLog:`, e)
        }
    }

    /**
     * Log by default
     * @see Override {@link setFormat}
     * @param contextName
     * @param id
     * @param message
     * @param lid
     * @param symbol
     * @returns {string}
     */
    onDisplay({contextName, id, message = "", lid = "", symbol = ""} = {})
    {
        // Time
        const date = new Date()
        let time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

        // Display content in columns
        time = this.truncateMessage(time, {fit: 7})
        contextName = this.truncateMessage(contextName, {fit: this.options.contextLenMax, align: QuickLog.ALIGN.RIGHT})
        // id = this.truncateMessage(id, {fit: this.options.idLenMax})
        lid = this.truncateMessage(lid, {fit: this.options.lidLenMax})
        message = this.truncateMessage(message, {fit: this.options.messageLenMax})
        symbol = this.truncateMessage(symbol, {fit: this.options.symbolLenMax})

        return `[${time}] ${contextName}: (${lid}) ${symbol} ${message}`
    }

    /**
     * Set log template
     * @param format
     */
    setFormat(format)
    {
        if (typeof format === 'function')
        {
            console.error(`Invalid parameter for setFormat. It is expecting a function or method.`)
            return false
        }
        this.format = format.bind(this)
    }

    // ------------------------------------------------
    // Color
    // ------------------------------------------------

    // ------------------------------------------------
    // Log Contexts
    // ------------------------------------------------
    generateDefaultContext()
    {
        const defaultContext = {
            name       : "DEFAULT",
            contextName: "DEFAULT",
            target     : "DEV",
            symbol     : "⚡"
        }

        defaultContext.id = this.logIndex++;
        defaultContext.color = COLOR_TABLE[0]
        return defaultContext
    }

    generateNewContext()
    {
        const newContext = this.generateDefaultContext()
        newContext.color = COLOR_TABLE[(this.indexColor++) % (COLOR_TABLE.length - 1) + 1];
        newContext.symbol = ""
        return newContext
    }

    allegeProperties(entry)
    {
        let converted = entry;

        const defaultContext = this.generateNewContext()

        if (!converted)
        {
            converted = {
                contextName: "DEFAULT",
            };
        }

        if (Array.isArray(converted))
        {
            throw new Error(`QuickLog: Cannot convert Array [${JSON.stringify(converted)}] to context`);
        }

        if (typeof converted === "string" || converted instanceof String)
        {
            converted = {
                contextName: converted
            };
        }

        if (
            typeof converted !== "object"
        )
        {
            throw new Error(`QuickLog: Cannot convert Unknown [${JSON.stringify(converted)}] to context`);
        }

        converted = Object.assign({}, defaultContext, converted);

        if (converted.color.toLowerCase().indexOf("rgb") > -1)
        {
            converted.color = "#" + rgbHex(converted.color)
        }
        else if (converted.color.indexOf("#") === -1)
        {
            if (colorConvert)
            {
                converted.color = "#" + colorConvert.keyword.hex(converted.color)
            }
        }

        return converted;
    }

    /**
     * Load the contexts that will be available.
     * They are defined by the user.
     * @see Context definitions {@link ./example/cjs/contexts-def.cjs}
     * @param contextTable
     */
    setContexts(contextTable)
    {
        const arr = Object.keys(contextTable);
        arr.forEach((key) =>
        {
            const contextPassed = contextTable[key] || {};
            contextPassed.contextName = key
            contextPassed.name = key
            this.contexts[key] = this.allegeProperties(contextPassed);
            contextTable[key] = this.contexts[key]
        });
    }

    setTargets(targetTable)
    {
        const arr = Object.keys(targetTable);
        arr.forEach((key) =>
        {
            const targetPassed = targetTable[key] || {};
            const target = this.allegeProperties(targetPassed, {
                user: false
            });

            this.targets[key] = target;
        });
    }

    enableContexts(contextNames)
    {
        this.contexts.forEach((context) =>
        {
        });
    }

    /**
     *
     * @returns {{}}
     */
    getActiveLogContexts()
    {
    }


    // ------------------------------------------------
    // Logging methods
    // ------------------------------------------------
    process(context = {})
    {
        try
        {
            let args = Array.prototype.slice.call(arguments);
            args.shift();

            const message = args.join(" | ")

            const text = this.format({...context, message})
            if (this.isBrowser())
            {
                console.log(`%c${text}`, `color: ${context.color}`)
            }
            else
            {
                console.log(chalk.hex(context.color)(text));
            }
            //
            // args[0] = `${context.padEnd(12, " ")}: ${args[0]}`;
            //
            // const css = this.colors[context];
            // if (css)
            // {
            //     args[0] = `%c${args[0]}`;
            //     args.splice(1, 0, css);
            // }
            //
            // window.console.log.apply(this, args);
        }
        catch (e)
        {
            debugger
            console.error(`QuickLog:`, e)
        }
    }

    isExtendedOptionsPassed(options)
    {
        if (typeof options !== "object")
        {
            return false;
        }

        return options.hasOwnProperty("context") || options.hasOwnProperty("target");
    }

    log(options, ...args)
    {
        if (!this.isExtendedOptionsPassed(options))
        {
            const defaultContext = this.generateDefaultContext()
            this.process.apply(this, [defaultContext, options, ...args]);
            return;
        }

        let context = options
        if (typeof options.context === "object")
        {
            const moreOptions = Object.assign({}, options)
            delete moreOptions.context
            context = Object.assign({}, options.context, moreOptions)
        }

        if (context.hasOwnProperty("context"))
        {
            context = Object.assign({}, this.generateDefaultContext(), context)
            delete context.context
        }

        // let args0 = Array.prototype.slice.call(arguments);
        // args0.unshift(options)
        this.process.apply(this, [context, ...args]);
    }

    info()
    {

    }

    warn()
    {

    }

    error()
    {

    }

}

module.exports = new QuickLog();
