const fs = require("fs");
const webdriver = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const chromium = require("chromium");
require("chromedriver");

async function start() {
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

    await driver.get("http://google.com");
    console.log("Hello Google!");
    await takeScreenshot(driver, "google-start-page");

    await driver.quit();
}

async function takeScreenshot(driver, name) {
    await driver.takeScreenshot().then((data) => {
        fs.writeFileSync(name + ".png", data, "base64");
        console.log("Screenshot is saved");
    });
}

start();