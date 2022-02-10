const fs = require("fs");
const webdriver = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const chromium = require("chromium");
require("chromedriver");

const chai = require("chai");
const expect = chai.expect;

let driver

const webPageTest = "http://127.0.0.1:9876/index.html"

async function init()
{
    let options = new chrome.Options();
    options.setChromeBinaryPath(chromium.path);
    options.addArguments("--headless");
    options.addArguments("--sandbox");
    options.addArguments("--disable-gpu");
    options.addArguments("--window-size=1280,960");

    driver = await new webdriver.Builder().forBrowser("chrome").setChromeOptions(options).build();

    await driver.get(webPageTest);

    return driver
}

async function takeScreenshot(driver, name)
{
    await driver.takeScreenshot().then((data) =>
    {
        fs.writeFileSync(name + ".png", data, "base64");
    });
}

const waitForDriverCaptured = () =>
{
    return new Promise((resolve) =>
    {
        setInterval(() =>
        {
            if (!driver)
            {
                return
            }

            resolve(true)
        }, 500)
    })
}

(async function ()
{
    const driver = await init()
}())

describe('In the Browser', async function ()
{
    this.timeout(30000);

    before(async function ()
    {
        await waitForDriverCaptured()
    })

    after(function()
    {
        driver.quit()
    })

    it('should see the correct url', async function ()
    {
        const url = await driver.getCurrentUrl()
        expect(url).to.equal(webPageTest)
    });

    it('should show some logs', async function ()
    {
        const pageSource = await driver.getPageSource()
        await takeScreenshot(driver, "test");
        expect(pageSource).to.contain("<body>")
    });
});

