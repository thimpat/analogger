const fs = require("fs");

module.exports.takeScreenshot = async function takeScreenshot(driver, name)
{
    await driver.takeScreenshot().then((data) =>
    {
        fs.writeFileSync(name + ".png", data, "base64");
    });
}

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

