/**
 * https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/
 */
const webdriver = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const {By, until} = require("selenium-webdriver");
const chromium = require("chromium");
const {startGenServer, stopGenServer, infoGenServer} = require("genserve");

const SERVER_NAME = "ci-test-analogger";

require("chromedriver");

const chai = require("chai");
const expect = chai.expect;

let driver;

/**
 * TEST CONFIGURATION FILE
 */
const configTest = require("./0-config.json");
const indexHtmlUrl = configTest.e2e.indexHTML;
const indexMinifiedHtmlUrl = configTest.e2e.indexMinifiedHtmlUrl;
const indexImportMapsHtmlUrl = configTest.e2e.indexHTMLImportMaps;

const {waitForDriverCaptured, sleep, getContent} = require("./lib/test-utils.cjs");
const path = require("path");

async function init()
{
    // Start the server
    // $> genserve.cmd start ci-analogger --port 9880 --dir ./
    const serverStarted = await startGenServer({
        name: SERVER_NAME, port: 9880,
        args: [
            "--dir", path.join(__dirname, "../")
        ]
    });
    if (!serverStarted)
    {
        console.error("Failed to start server");
        process.exit(1);
    }

    const info = await infoGenServer({name: SERVER_NAME});
    console.log(info);

    let options = new chrome.Options();
    options.setChromeBinaryPath(chromium.path);
    options.addArguments("--headless");
    options.addArguments("--sandbox");
    options.addArguments("--disable-gpu");
    options.addArguments("--window-size=1280,960");

    driver = await new webdriver.Builder().forBrowser("chrome").setChromeOptions(options).build();

    return driver;
}


describe("The Browser", async function ()
{
    this.timeout(120 * 1000);           // 2 minutes

    before(async function ()
    {
        driver = await waitForDriverCaptured({driver: driver = await init()});
    });

    afterEach(async () =>
    {
        await sleep(1000);
    });

    after(async function ()
    {
        driver.quit();

        await stopGenServer({name: SERVER_NAME});
    });

    describe("with the minified html", () =>
    {
        before(async function ()
        {
            await driver.get(indexMinifiedHtmlUrl);
        });

        it("should load the page", async function ()
        {
            driver.navigate().refresh();
            const url = await driver.getCurrentUrl();
            expect(url).to.equal("http://127.0.0.1:9880/example-3/index-bundle.html");
        });

        it("should have the #analogger div containing the expected text", async function ()
        {
            const element = driver.findElement(By.id("analogger"));
            const bodyText = await element.getText();
            expect(bodyText)
                .to.contain("Test Log example C1")
                .to.contain("Test Log example C4");
        });

    });

    describe("with the mapped html", () =>
    {
        before(async function ()
        {
            await driver.get(indexImportMapsHtmlUrl);
        });

        it("should load the mapped page", async function ()
        {
            driver.navigate().refresh();
            const url = await driver.getCurrentUrl();
            expect(url).to.equal("http://127.0.0.1:9880/example-2/index-with-import-maps.html");
        });

        it("should have its content having some map references", async function ()
        {
            const content = getContent("./example-2/index-with-import-maps.html");
            expect(content)
                .to.contain(`<script type="importmap">`)
                .to.contain(`"imports":`)
                .to.contain(`"to-ansi": "../../node_modules/to-ansi/index.mjs"`)
                .to.contain(`"to-ansi": "../../node_modules/to-ansi/index.mjs"`);
        });

        it("should have some .js containing the to-ansi module not resolved", async function ()
        {
            const content = getContent("./generated/demo/browser-import-maps/src/ana-logger.mjs");
            expect(content).to.contain(`import toAnsi  from "to-ansi";`);
        });

        it("should have the #analogger div containing the expected text", async function ()
        {
            const element = driver.findElement(By.id("analogger"));
            const bodyText = await element.getText();
            expect(bodyText)
                .to.contain("Test Log example C1")
                .to.contain("Test Log example C4");
        });

    });

    describe("with the standard html", () =>
    {
        before(async function ()
        {
            await driver.get(indexHtmlUrl);
        });

        it("should reach the correct url", async function ()
        {
            const url = await driver.getCurrentUrl();
            expect(url).to.equal("http://127.0.0.1:9880/example/index.html");
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
            expect(bodyText)
                .to.contain("Test Log example C1")
                .to.contain("Test Log example C4");
        });

        describe("on logging from console", ()=>
        {
            before(async ()=>
            {
                await driver.wait(until.elementLocated(By.id("analogger")));
            });

            it("should add an entry to the div", async function ()
            {
                const element = driver.findElement(By.id("analogger"));
                const button = driver.findElement(By.id("add-1"));
                await button.click();

                const bodyText = await element.getText();
                expect(bodyText)
                    .to.contain("Adding entry")
                    .to.contain(" to the log");

            });

            it("should scroll down to the bottom of the div", async function ()
            {
                const button = driver.findElement(By.id("add-10"));
                const report = driver.findElement(By.id("report"));

                await button.click();
                const content = await report.getAttribute("value");

                const [, , , scrollBottom] = content.split(",");

                expect(scrollBottom).to.equal("0");
            });

            it("should not scroll down to the bottom of the div when the scrollbar has moved", async function ()
            {
                const scrollUp = driver.findElement(By.id("scroll-up"));
                const button = driver.findElement(By.id("add-10"));
                const report = driver.findElement(By.id("report"));

                await scrollUp.click();
                await button.click();
                const content = await report.getAttribute("value");

                const [, , , scrollBottom] = content.split(",");

                expect(scrollBottom).not.to.equal("0");
            });

            it("should scroll down to the bottom of the div again", async function ()
            {
                const scrollDown = driver.findElement(By.id("scroll-down"));
                const button = driver.findElement(By.id("add-10"));
                const report = driver.findElement(By.id("report"));

                await scrollDown.click();
                await scrollDown.click();
                await scrollDown.click();
                await button.click();

                const content = await report.getAttribute("value");
                const [, , , scrollBottom] = content.split(",");

                expect(scrollBottom).to.equal("0");
            });

            it("should display a notification that older logs were removed", async function ()
            {
                const scrollTop = driver.findElement(By.id("scroll-top"));
                const element = driver.findElement(By.id("analogger"));
                const button = driver.findElement(By.id("add-1000"));

                await button.click();
                await sleep(3000);
                await button.click();
                await sleep(5000);
                await button.click();
                await sleep(8000);

                scrollTop.click();
                const bodyText = await element.getText();
                expect(bodyText)
                    .to.contain("Oldest entries removed");
            });

            it("should keep the number of logs entries under 2000", async function ()
            {
                driver.navigate().refresh();
                const button = driver.findElement(By.id("add-1000"));

                await button.click();
                await sleep(3000);
                await button.click();
                await sleep(5000);

                const lines = driver.findElements(By.className("to-esm-line"));
                const count = (await lines).length;

                expect(count)
                    .to.be.lessThan(2000 ); // MAX_CHILDREN_DOM_ANALOGGER
            });

            it("should not choke when adding 10000 entries", async function ()
            {
                driver.navigate().refresh();
                const scrollBottom = driver.findElement(By.id("scroll-bottom"));
                const element = driver.findElement(By.id("analogger"));
                const button = driver.findElement(By.id("add-10000"));

                await scrollBottom.click();
                await button.click();

                await sleep(30000);

                // await driver.wait(until.elementLocated(By.className('suggestions-results')));
                await driver.wait(until.elementTextContains(element, "Adding entry 10000 to the log"));
            });

        });


    });


});

