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
const PLUGIN_NAME = "HTML_TO_IMAGE";

/**
 * Take a screenshot
 * @param element
 * @param container
 * @returns {boolean}
 */
const takeScreenshot = ({element = document.body, callback = null} = {}) =>
{
    try
    {
        htmlToImage
            .toPng(element)
            .then(function (data)
            {
                anaLogger.uploadDataToRemote(data);
                callback && callback(data);
            })
            .catch(function (error)
            {
                console.error("Something went wrong:", error);
            });

        return true;
    }
    catch (e)
    {
        console.error({lid: 4321}, e.message);
    }

    return false;
};

/**
 * {@link takeScreenshot}
 */
anaLogger.addPlugin("takeScreenshot", takeScreenshot, PLUGIN_NAME);

module.exports.PLUGIN_NAME = PLUGIN_NAME;



