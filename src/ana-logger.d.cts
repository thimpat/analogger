export = __AnaLogger;
declare const __AnaLogger: typeof ____AnaLogger;
/**
 * @module ____AnaLogger
 * @class ____AnaLogger
 */
declare class ____AnaLogger {
    static "__#2@#instances": any[];
    static Console: any;
    static ALIGN: {
        LEFT: string;
        RIGHT: string;
    };
    static ENVIRONMENT_TYPE: {
        BROWSER: string;
        NODE: string;
        OTHER: string;
    };
    static instanceCount: number;
    static pluginTable: {};
    static generateInstance(): ____AnaLogger;
    /**
     * Returns an AnaLogger instance
     * @returns {null}
     */
    static getInstance(num?: number): null;
    /**
     * Returns first existing AnaLogger instance,
     * otherwise create a new instance
     * @returns {*|____AnaLogger}
     */
    static generateMainInstance(): any | ____AnaLogger;
    /**
     * Override console.log and console.error
     */
    static startLogger(): void;
    static stopLogger(): void;
    constructor({ name }?: {
        name?: string;
    });
    system: string;
    instanceId: string;
    instanceName: string;
    logIndex: number;
    logCounter: number;
    activeTargets: any[];
    indexColor: number;
    format: string;
    keepLog: boolean;
    logHistory: any[];
    $containers: any;
    options: {
        hideHookMessage: boolean;
    };
    originalFormatFunction: string;
    errorTargetHandler: any;
    errorUserTargetHandler: any;
    rawLog: any;
    rawInfo: any;
    rawWarn: any;
    rawError: any;
    ALIGN: {
        LEFT: string;
        RIGHT: string;
    };
    ENVIRONMENT_TYPE: {
        BROWSER: string;
        NODE: string;
        OTHER: string;
    };
    getName(): string;
    getId(): string;
    keepLogHistory(): void;
    releaseLogHistory(): void;
    resetLogHistory(): void;
    addToLogHistory(obj: any): void;
    /**
     * Returns log entries
     * @note This method should return the list of objects rather than
     * the array of text
     * @param join
     * @param symbol
     * @returns {string|*[]}
     */
    getLogHistory(join?: boolean, symbol?: string): string | any[];
    getRawLogHistory(): any[];
    hasSeenLid(lid: any): boolean;
    forceEnvironment(system: any): void;
    forcedSystem: any;
    /**
     * Tell whether we are in a Node environment
     * @returns {boolean}
     */
    isNode(): boolean;
    /**
     * Tell whether the logger runs from a browser
     * @returns {boolean}
     */
    isBrowser(): boolean;
    resetLogger(): void;
    resetOptions(): void;
    setOptions({ contextLenMax, idLenMax, lidLenMax, symbolLenMax, messageLenMax, hideLog, hideError, hideHookMessage, hidePassingTests, logToDom, logToFile, logMaxSize, logMaxArchives, logIndexArchive, addArchiveTimestamp, addArchiveIndex, compressArchives, compressionLevel, logToRemote, logToRemoteUrl, logToRemoteBinaryUrl, loopback, requiredLogLevel, oneConsolePerContext, silent, enableDate, protocol, host, port, pathname, binarypathname }?: any): void;
    EOL: string;
    getOptions(): {
        hideHookMessage: boolean;
    };
    truncateMessage(input?: string, { fit, align, ellipsis }?: {
        fit?: number;
        align?: string;
        ellipsis?: string;
    }): string;
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
    onBuildLog({ contextName, message, lid, symbol }?: {
        contextName: any;
        message?: string;
        lid?: string;
        symbol?: string;
    }): string;
    onErrorForUserTarget(context: any, ...args: any[]): void;
    onError(context: any, ...args: any[]): void;
    /**
     * Forward input to real console log
     * @param args
     */
    onDisplayLog(...args: any[]): void;
    assistStask(error: any): any;
    /**
     * Forward input to real console log
     * @param args
     */
    onDisplayError(...args: any[]): void;
    /**
     * Set log template
     * @param format
     */
    setLogFormat(format: any): boolean;
    resetLogFormatter(): void;
    setErrorHandler(handler: any): void;
    setErrorHandlerForUserTarget(handler: any): void;
    isContextValid(context: any): any;
    /**
     * Set context properties for default context
     * @param context
     */
    setDefaultContext(context: any): void;
    /**
     * Generate a default context with a default color
     * @returns {*|{}}
     */
    generateDefaultContext(): any | {};
    /**
     * Generate a new context based on the default context.
     * The only difference with default is that a different color will be assigned to that context automatically
     * @returns {*|{}}
     */
    generateNewContext(): any | {};
    generateErrorContext(): any;
    /**
     * Redefine a context
     * @param contextName
     * @param context
     */
    setContext(contextName: any, context?: {}): void;
    getContext(contextName: any): any;
    /**
     * Load the context names that should be available to the environment.
     * They are defined by the user.
     * @see Context definitions {@link ./example/more/contexts-def.cjs}
     * @param contextTable
     */
    setContexts(contextTable: any): void;
    getContexts(): readonly any[];
    setTargets(targetTable?: {}): void;
    addTargets(targets: any): void;
    getTargets(): Readonly<{}>;
    /**
     * Set one or more active targets
     * @param targets
     */
    setActiveTargets(targets?: any): void;
    getActiveTarget(): any[];
    /**
     * Set only one active target
     * NOTE: Kept for backward compatibility.
     * Use setActiveTargets instead
     * @param target
     */
    setActiveTarget(target: any): void;
    setLogLevel(name: any, level: any): void;
    getLogLevel(name: any): any;
    setLogLevels(levels: any): void;
    getLogLevels(): Readonly<{}>;
    isTargetAllowed(target: any): boolean;
    /**
     * Add many sections (columns) to a given DOM line
     * @param $line
     * @param context
     * @param text
     */
    setColumns($line: any, context: any, text: any): void;
    /**
     * Check that the div has not too many entries
     * @param $view
     */
    removeDomOldEntries: ($view: any) => number;
    /**
     * Scroll to bottom if div is already at the bottom
     * @param $view
     */
    scrollDivToBottom: ($view: any) => void;
    checkOnLoggingToDom(context: any, param2: any): any;
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
    addLineToDom($view: any, $line: any, { context, addType, message, text, args }: {
        context: any;
        addType: any;
        message: any;
        text: any;
        args: any;
    }): void;
    showRemovedNotification(context: any): void;
    timerAddLineToDomID: any;
    writeLogToDom(context: any, fullText: any, { addType, message, args }?: {
        addType?: string;
        message?: string;
        args?: any;
    }): void;
    writeLogToFile(text: any): void;
    writeLogToRemote(...data: any[]): any;
    /**
     * Send data to the registered remote server
     * @param raw
     * @param context
     * @param done
     */
    uploadDataToRemote(raw: any, context?: any, done?: any): any;
    stringifyEntry(arg: any): any;
    /**
     * If a variable is too complex for the logger, stringify it
     */
    convertEntry(arg: any): any;
    convertArgumentsToText(args: any): string;
    writeToConsole(output: any, context: any): void;
    /**
     * Parse the context. If one of its keys has the same name as a registered plugin,
     * the system will invoke the plugin (the value of the key must be anything truthy).
     * @param context
     * @param extras
     * @returns {undefined|boolean}
     */
    checkPlugins(context: any, { message, text, args, logCounter }: {
        message: any;
        text: any;
        args: any;
        logCounter: any;
    }): undefined | boolean;
    /**
     * If the context contain a key onLogging that is a function,
     * execute
     * @param context
     * @param data
     * @param extras
     * @param callbackName
     * @returns {*}
     */
    checkOnLogging(context: any, data: any, extras: any, callbackName: any): any;
    /**
     * Display log following template
     * @param context
     */
    processOutput(context?: {}, ...args: any[]): void;
    /**
     * Check that a parameter uses the expected AnaLogger format.
     * For this, the first parameter should be an object that contains at least
     * a logging id (lid), a target, a contextName, etc
     * @param options
     * @returns {boolean}
     */
    isExtendedOptionsPassed(options: any): boolean;
    /**
     * Convert a string into a Context object if possible
     * TODO: To implement in next version
     * @param str
     * @returns {string}
     */
    extractContextFromInput(str: any): string;
    listSymbols(): void;
    applySymbolByName(context: any): void;
    /**
     * Convert the first parameter of a console.log to a Context object
     * @param options
     * @param defaultContext
     * @returns {*|{}}
     */
    convertToContext(options: any, defaultContext: any): any | {};
    /**
     * console.log with options set on the first parameter to dictate console log behaviours
     * @param options
     * @param args
     */
    log(options: any, ...args: any[]): void;
    error(options: any, ...args: any[]): void;
    overrideError(): void;
    attachConsole(): boolean;
    overrideConsole({ log, info, warn, error }?: {
        log?: boolean;
        info?: boolean;
        warn?: boolean;
        error?: boolean;
    }): void;
    removeOverrideError(): void;
    removeOverride({ log, info, warn, error }?: {
        log?: boolean;
        info?: boolean;
        warn?: boolean;
        error?: boolean;
    }): void;
    info(...args: any[]): void;
    warn(...args: any[]): void;
    table(...args: any[]): void;
    /** to-esm-browser: add
     **/
    takeScreenshotWithImageCapture(): Promise<any>;
    takeScreenshot(pluginOptions?: {}): void;
    alert(...args: any[]): void;
    assert(condition: any, expected?: boolean, ...args: any[]): boolean;
    /**
     * Set standard Analogger format
     * @example
     * // Output Example
     * // [14:01:06]    DEFAULT: (1060) ⚡  " ✔ My log ..."
     * @param activeTarget
     * @param override
     * @returns {boolean}
     */
    applyAnalogFormatting({ activeTarget, override }?: {
        activeTarget?: string;
        override?: boolean;
    }): boolean;
    applyPredefinedFormat(name?: string, { activeTarget, override }?: {
        activeTarget?: string;
        override?: boolean;
    }): boolean;
    convertToUrl({ protocol, host, port, pathname }?: {
        protocol?: string;
        host?: string;
        port?: number;
        pathname?: string;
    }): string;
    generateLogToRemoteUrl(logToRemoteUrl?: any, { pathname }?: {
        pathname?: string;
    }): string | String;
    /**
     * Install a plugin against the active instance
     * @param methodName
     * @param callback
     * @param pluginName
     */
    addPlugin(methodName: any, callback: any, pluginName?: string): void;
    /**
     * Install a plugin against the class (an instantiation with new is needed)
     * @param methodName
     * @param callback
     * @param pluginName
     */
    addGlobalPlugin(methodName: any, callback: any, pluginName: any): void;
    getPluginList(): string[];
    /**
     * At the moment, this method behaviour is equivalent to an eventual isPluginRegistered method
     * @param name
     * @returns {boolean}
     */
    validatePlugin(name: any): boolean;
    #private;
}
