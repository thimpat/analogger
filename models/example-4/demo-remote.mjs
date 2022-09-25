// Load the AnaLogger library
import {anaLogger} from "./browser/ana-logger.mjs";

// Register plugin
import {PLUGIN_NAME} from "./browser/html-to-image-plugin.mjs";

let $container, timerId;

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
const takeScreenshot = () =>
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
            lid                                : 1234,
            [PLUGIN_NAME] /** takeScreenshot */: {
                /**
                 * Tell the plugin from what div to generate the screenshot
                 */
                divSource: box,
                /**
                 * AnaLogger has called the plugin, and we have the image,
                 * however data have not been uploaded yet
                 * @returns {boolean}
                 * @param event
                 */
                onScreenshot: function displayScreenshotInDom(event /* args, context,  logCounter, message,
                 methodName, pluginCallResult, text, type*/)
                {
                    document.getElementById("image-container").style.display = "block";
                    const img = new Image();
                    img.src = event.imageData;
                    $container.append(img);
                },
                /**
                 * The server has saved the screenshot
                 * @param response
                 * @returns {boolean}
                 */
                onResponse: function({
                                 serverResponse, args, context, logCounter, message, methodName, pluginCallResult, text, type
                             })
                {
                    try
                    {
                        const {message, success, urlPath} = serverResponse;

                        if (!success)
                        {
                            anaLogger.error({lid: 3007,}, "Something went wrong server-side", message, urlPath)
                            return false;
                        }
                        anaLogger.log({lid: 3008,}, message, urlPath)
                        return true;
                    }
                    catch (e)
                    {
                        console.error({lid: 4321}, e.message);
                    }

                    return false;
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

/**
 * The user has clicked the "Take a screenshot" button
 */
const onTakeScreenshot = () =>
{
    if (timerId)
    {
        return;
    }

    timerId = setTimeout(function ()
    {
        takeScreenshot()
        timerId = null;
    }, 400);
};

const init = () =>
{
    try
    {
        // $container = document.getElementById("screenshot-container");
        $container = buildImageContainer();

        anaLogger.validatePlugin(PLUGIN_NAME);
        anaLogger.setOptions({logToRemote: true, logToDom: true});
        anaLogger.log({lid: 1232}, `AnaLogger set up to work with remote`);

        document.getElementById("send-to-remote").addEventListener("click", () =>
        {
            anaLogger.log({lid: 1232}, `Sending a random number to the remote: ${Math.random()}`);
        });

        document.getElementById("take-screenshot").addEventListener("click", onTakeScreenshot);
    }
    catch (e)
    {
        anaLogger.error({lid: 4321}, e.message);
    }
};

init();