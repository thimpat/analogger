const fs = require("fs");

module.exports.takeScreenshot = async function takeScreenshot(driver, name)
{
    await driver.takeScreenshot().then((data) =>
    {
        fs.writeFileSync(name + ".png", data, "base64");
    });
};

/**
 * E2E Utility function
 * @type {function(): Promise<unknown>}
 */
module.exports.waitForDriverCaptured = (monitor) =>
{
    return new Promise((resolve) =>
    {
        setInterval(() =>
        {
            if (!monitor.driver)
            {
                return;
            }

            resolve(monitor.driver);
        }, 500);
    });
};

/**
 * Returns file content
 * @param filepath
 * @returns {string|any}
 */
module.exports.getContent = (filepath) =>
{
    try
    {
        const str = fs.readFileSync(filepath, "utf-8");
        try
        {
            return JSON.parse(str);
        }
        catch (e)
        {

        }
        return str;
    }
    catch (e)
    {
        console.error("E56446556231131: ", e);
    }
};

/**
 * Delay code execution for a number of milliseconds
 * @param {number} ms Number of milliseconds to delay the code
 * @returns {Promise<unknown>}
 */
module.exports.sleep =
function sleep(ms)
{
    return new Promise((resolve) =>
    {
        setTimeout(resolve, ms);
    });
};

