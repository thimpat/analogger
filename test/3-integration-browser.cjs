/**
 * Selenium
 */
const webdriver = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const {By, until} = require('selenium-webdriver');
const chromium = require("chromium");

/**
 * TEST CONFIGURATION FILE
 */
const configTest = require("./0-config.json");
const webPageTest = configTest.e2e.webPageTest;

/**
 * Analogger code
 */
const {anaLogger} = require("../src/cjs/ana-logger.cjs");
const {LOG_CONTEXTS, LOG_TARGETS} = require("../example/cjs/contexts-def.cjs");


require("chromedriver");

const chai = require("chai");
const {waitForDriverCaptured} = require("./lib/test-utils.cjs");
const expect = chai.expect;

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

describe('In the browser', async function ()
{
    let driver;
    this.timeout(20000);

    before(async function ()
    {
        driver = await waitForDriverCaptured({driver: driver = await init()})
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
        anaLogger.keepLogHistory()

        anaLogger.setContexts(LOG_CONTEXTS);
        anaLogger.setTargets(LOG_TARGETS);
        anaLogger.setActiveTarget(LOG_TARGETS.DEV3)
        anaLogger.setOptions({logToDom: ".analogger"})
        anaLogger.setOptions({silent: true})

        console.log("==========================");
        anaLogger.log(LOG_CONTEXTS.C1, `Test Log example C1`);

    });

    after(  async function()
    {
        driver.quit()
    })

});

