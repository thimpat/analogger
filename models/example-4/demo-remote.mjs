// Load the AnaLogger library ( Available in ./node_modules/analogger/browser/ )
import {anaLogger} from "./browser/ana-logger.mjs";

// Register plugin
import {PLUGIN_NAME} from "./browser/html-to-image-plugin.mjs";

/**
 * Create a container to draw the screenshot
 * @returns {HTMLDivElement}
 */
const buildImageContainer = () =>
{
    const item = document.createElement("div");
    document.body.appendChild(item);
    item.classList.add("image-container");
    item.id = "image-container";
    return item;
};

/**
 * AnaLogger is about to trigger a screenshot using the html-to-image module
 * https://www.npmjs.com/package/html-to-image
 * @returns {boolean}
 */
const takeScreenshot = ($container) =>
{
    try
    {
        document.getElementById("image-container").style.display = "none";
        const box = document.body;

        let canvasWidth = box.offsetWidth;
        let canvasHeight = box.offsetHeight;

        const desiredHeight = 380;
        if (canvasHeight > desiredHeight)
        {
            canvasWidth = Math.floor(desiredHeight / canvasHeight * canvasWidth);
            canvasHeight = desiredHeight;
        }

        // Trigger the plugin has its name is passed to the context
        anaLogger.log({
            lid                                : 1234,          // <= Random number
            [PLUGIN_NAME] /** takeScreenshot */: {
                /**
                 * Tell the plugin from which div to generate the screenshot
                 */
                divSource: box,
                /**
                 * AnaLogger has called the plugin, and we have the data image,
                 * however data have not been uploaded yet
                 * @returns {boolean}
                 * @param event
                 */
                onScreenshot: function displayScreenshotInDom(event)
                {
                    // Add image to DOM
                    document.getElementById("image-container").style.display = "block";
                    const img = new Image();
                    img.src = event.imageData;
                    $container.append(img);
                },
                /**
                 * The server has saved the screenshot on the machine host.
                 * @param response
                 * @returns {boolean}
                 */
                onResponse: function ({serverResponse})
                {
                    const {message, success, urlPath} = serverResponse;

                    if (!success)
                    {
                        console.error({lid: 3007}, "Something went wrong server-side", message, urlPath)
                        return false;
                    }
                    console.log({lid: 3008}, message, urlPath)
                    return true;
                },
                options   : {
                    canvasHeight,
                    canvasWidth,
                }
            }
        }, `Taking screenshot...`);

        return true;
    }
    catch (e)
    {
        console.error({lid: 4321}, e.message);
    }

    return false;
};

const init = () =>
{
    try
    {
        let $container = buildImageContainer();

        anaLogger.validatePlugin(PLUGIN_NAME);
        anaLogger.setOptions({logToRemote: true, logToDom: true});
        anaLogger.log({lid: 1232}, `AnaLogger set up to work with remote`);

        document.getElementById("send-to-remote").addEventListener("click", () =>
        {
            anaLogger.log({lid: 1232}, `Sending a random number to the remote: ${Math.random()}`);
        });

        document.getElementById("take-screenshot").addEventListener("click", () =>
        {
            takeScreenshot($container)
        });
    }
    catch (e)
    {
        anaLogger.error({lid: 4321}, e.message);
    }
};

init();