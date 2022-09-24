// Load the AnaLogger library
import {anaLogger} from "./browser/ana-logger.mjs";

// Register plugin
import {PLUGIN_NAME} from "./browser/html-to-image-plugin.mjs";

// ==================================================================
// Constants
// ==================================================================

// ==================================================================
//
// ==================================================================

const events = [];

let busy = false;

const registerEvent = (event) =>
{
    try
    {
        console.log(`Event:`, event);
        events.push(event);
        return true;
    }
    catch (e)
    {
        console.error({lid: 4321}, e.message);
    }

    return false;

};


/**
 * Create a container to draw the screenshot
 * @returns {HTMLDivElement}
 */
const buildImageContainer = () =>
{
    const item = document.createElement("div");
    document.body.appendChild(item);

    // Style
    item.style.display = "block";

    // Position
    item.style.position = "absolute";
    item.style.height = `300px`;
    item.style.left = `10px`;
    item.style.top = `10px`;

    // Class
    item.classList.add("image-container");

    return item;
};

/**
 * AnaLogger has called the plugin, and we have the image,
 * however data have not been uploaded yet
 * @param response
 * @returns {boolean}
 */
const onScreenshot = ({
                          imageData, /*args, context,  logCounter, message, methodName, pluginCallResult, text, type*/
                      }) =>
{
    try
    {
        // const container = buildImageContainer();
        // const img = new Image();
        // img.src = imageData;
        // container.appendChild(img);

        return true;
    }
    catch (e)
    {
        console.error({lid: 4321}, e.message);
    }

    return false;
};

/**
 * AnaLogger has called the plugin and we have a response from the server
 * @param response
 * @returns {boolean}
 */
const onResponse = ({
                        serverResponse, args, context, logCounter, message, methodName, pluginCallResult, text, type
                    }) =>
{
    try
    {
        const {message, success, urlPath} = serverResponse;
        return true;
    }
    catch (e)
    {
        console.error({lid: 4321}, e.message);
    }

    return false;
};

const takeScreenshot = () =>
{
    try
    {
        if (busy)
        {
            return;
        }

        busy = true;

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
                               * Tell the plugin what div to generate a screenshot from
                               */
                              divSource: box,
                              /**
                               * The client has generated data for the screenshot
                               */
                              onScreenshot: (event) =>
                              {
                                  onTakeScreenshot(event);
                              },
                              /**
                               * The server has processed the screenshot and it's
                               * now sending back information related to it
                               */
                              onResponse: onResponse,
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
 * Invokes the takeScreenshot method of AnaLogger via its plugin system
 * {@link PLUGIN_NAME}
 */
const onUserInteraction = function (event)
{
    try
    {
        registerEvent(event);
        takeScreenshot();
    }
    catch (e)
    {
        anaLogger.error({lid: 4321}, e.message);
    }
};

const onTakeScreenshot = (event) =>
{
    setTimeout(function(event)
               {
                   onUserInteraction(event);
               }.bind(null, event), 400);
};

const init = () =>
{
    try
    {
        anaLogger.validatePlugin(PLUGIN_NAME);
        anaLogger.setOptions({logToRemote: true});
        anaLogger.log({lid: 1232}, `AnaLogger set up to work with remote`);

        document.body.addEventListener("mousemove", onUserInteraction);
        document.body.addEventListener("mousedown", onUserInteraction);
        document.body.addEventListener("mouseup", onUserInteraction);
        document.body.addEventListener("dblclick", onUserInteraction);
        document.body.addEventListener("click", onUserInteraction);
        document.addEventListener("visibilitychange", onUserInteraction);
        document.addEventListener("onload", onTakeScreenshot);
    }
    catch (e)
    {
        anaLogger.error({lid: 4321}, e.message);
    }
};

init();