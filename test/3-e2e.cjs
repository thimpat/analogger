/**
 * https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/
 */
const webdriver = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const {By, until} = require("selenium-webdriver");
const chromium = require("chromium");

require("chromedriver");

const chai = require("chai");
const expect = chai.expect;

let driver;

/**
 * TEST CONFIGURATION FILE
 */
const configTest = require("./0-config.json");
const webPageTest = configTest.e2e.webPageTest;

const {waitForDriverCaptured} = require("./lib/test-utils.cjs");

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

    return driver;
}


describe("The Browser", async function ()
{
    this.timeout(20000);

    before(async function ()
    {
        driver = await waitForDriverCaptured({driver: driver = await init()});
    });

    it("should reach the correct url", async function ()
    {
        const url = await driver.getCurrentUrl();
        expect(url).to.equal(webPageTest);
    });

    it("should have a reachable DOM", async function ()
    {
        const pageSource = await driver.getPageSource();
        expect(pageSource).to.contain("<body>");
    });

    it("should find the #analogger div in the DOM", async function ()
    {
        await driver.wait(until.elementLocated(By.id("analogger")), 10000);
        const element = await driver.findElement(By.id("analogger"));
        expect(await element.isDisplayed()).to.be.true;
    });

    it("should have the #analogger div containing some specific text", async function ()
    {
        const element = driver.findElement(By.id("analogger"));
        const bodyText = await element.getText();
        expect(bodyText).to.contain("Basic Log example 1");
    });

    after(  async function()
    {
        driver.quit();
    });

});

