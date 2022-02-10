const fs = require("fs");
const webdriver = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const chromium = require("chromium");
require("chromedriver");

async function init()
 {
     let options = new chrome.Options();
     options.setChromeBinaryPath(chromium.path);
     options.addArguments("--headless");
     options.addArguments("--sandbox");
     options.addArguments("--disable-gpu");
     options.addArguments("--window-size=1280,960");

     const driver = await new webdriver.Builder()
         .forBrowser("chrome")
         .setChromeOptions(options)
        .build();

    await driver.get("http://127.0.0.1:9876/index.html");
    await takeScreenshot(driver, "test");

    return driver
}

async function takeScreenshot(driver, name)
{
    await driver.takeScreenshot().then((data) =>
    {
        fs.writeFileSync(name + ".png", data, "base64");
    });
}

(async function ()
{
    const driver = await init();

    await driver.quit();
}())

