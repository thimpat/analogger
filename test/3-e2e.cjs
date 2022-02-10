/**
 * https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/
 */
const webdriver = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const {By, until} = require('selenium-webdriver');
const chromium = require("chromium");

const fs = require("fs");
require("chromedriver");

const chai = require("chai");
const expect = chai.expect;

let driver

const webPageTest = "http://127.0.0.1:9880/example/index.html"

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
    driver = await init()
}())

describe('The Browser', async function ()
{
    this.timeout(20000);

    before(async function ()
    {
        await waitForDriverCaptured()
    })

    it('should reach the correct url', async function ()
    {
        const url = await driver.getCurrentUrl()
        expect(url).to.equal(webPageTest)
    });

    it('should load the correct js', async function ()
    {
        const pageSource = await driver.getPageSource()
        expect(pageSource).to.contain("<body>")
    });

    it('should find the #analogger div in the DOM', async function ()
    {
        await driver.wait(until.elementLocated(By.id('analogger')), 10000);
        const element = await driver.findElement(By.id("analogger"))
        expect(await element.isDisplayed()).to.be.true
    });

    it('should have the #analogger div containing some specific text', async function ()
    {
        const element = driver.findElement(By.id("analogger"))
        const bodyText = await element.getText();
        expect(bodyText).to.contain("DEFAULT: Basic Log example 1")
    });

    after(  async function()
    {
        driver.quit()
    })

});

