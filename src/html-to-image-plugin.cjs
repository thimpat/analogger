/**
 * Add the module html-to-image to the AnaLogger plugin system
 */

/** to-esm-all: remove **/
/**
 * This code is meant to work only within a browser.
 * It is not valid as is; it needs to be converted to ESM code
 * with to-esm.
 * The code has already been generated.
 * To regenerate with to-esm
 * $> to-esm src/html-to-image-plugin.cjs  --entrypoint ./src/ana-logger.cjs --output browser/ --config .toesm.cjs
 * --target browser
 */
/** to-esm-all: end-remove **/

const {anaLogger} = require("./ana-logger.cjs");
const PLUGIN_NAME = "takeScreenshot";

/**
 * Take a screenshot then send to a remote
 * @see ____AnaLogger.checkPlugins
 * @param context
 * @param {HTMLElement} element Dom element we want to take a screenshot from
 * @param args
 * @param logCounter
 * @param message
 * @param text
 * @param methodName
 * @param type
 * @returns {boolean}
 */
const takeScreenshot = (context,
                        {
                            pluginArgs = {},
                            divSource = document.body,
                            args = null,
                            logCounter = -1,
                            message = null,
                            text = null,
                            methodName = "",
                            type = ""
                        }) =>
{
    try
    {
        htmlToImage
            .toPng(divSource)
            .then(function (imageData)
            {
                // ------------------------------------
                // Phase 1: We have the screenshot
                // ------------------------------------
                const onScreenshot = pluginArgs ? pluginArgs.onScreenshot : null;
                onScreenshot && onScreenshot({
                    imageData,
                    context,
                    methodName,
                    type,
                    message,
                    text,
                    args,
                    logCounter,
                });

                anaLogger.uploadDataToRemote(imageData, context, (serverResponse) =>
                {
                    // ------------------------------------
                    // Phase 1: We have the screenshot url from the server
                    // ------------------------------------
                    const onResponse = pluginArgs ? pluginArgs.onResponse : null;
                    // We transfer as much information as we can to the plugin
                    onResponse && onResponse({
                        imageData,
                        pluginCallResult: response,
                        serverResponse,                                           // We need the response to know where
                                                                                  // to find the generated image on the
                                                                                  // server
                        context,
                        methodName,
                        type,
                        message,
                        text,
                        args,
                        logCounter,
                    });
                });
            })
            .catch(function (error)
            {
                console.error("Something went wrong:", error);
            });
    }
    catch (e)
    {
        console.error({lid: 4321}, e.message);
    }

    response = false;
    return response;
};

anaLogger.addPlugin(PLUGIN_NAME, takeScreenshot);

module.exports.PLUGIN_NAME = PLUGIN_NAME;



