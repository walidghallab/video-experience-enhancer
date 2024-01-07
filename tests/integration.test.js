import { Options } from "selenium-webdriver/chrome.js";
import { Builder } from "selenium-webdriver/index.js";
import { By, Key } from "selenium-webdriver";
import { expect } from "chai";
import * as fs from "fs";

const EXTENSION_PATH = "../src";
const EXTENSION_ID = "gpgijjcmnjpbdpaijihbchgdeencehng";
const SECOND = 1000;
const RUN_IN_HEADLESS_MODE = true;

/*
  Tips for debugging:
  - To see the browser, set RUN_IN_HEADLESS_MODE to false.
  - To take a screenshot, use the following code (this works also in headless mode):
    await takeScreenshot("screenshot.png", driver);
  - To increase timeout of individual steps, use the following code:
    await driver.manage().setTimeouts({ implicit: <time in ms> })
    More information here: https://www.selenium.dev/documentation/webdriver/waits/
*/

describe("Video experience enhancer", function () {
  let driver;

  beforeEach(async function () {
    const options = new Options();
    options.addArguments(`load-extension=${EXTENSION_PATH}`);
    if (RUN_IN_HEADLESS_MODE) {
      options.addArguments("headless=new");
    }

    console.log("Starting the browser.");
    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
  });

  it("popup renders correctly", async function () {
    await driver.get(`chrome-extension://${EXTENSION_ID}/popup/index.html`);
    const headerText = await driver.findElement(By.css("h1")).getText();
    console.log(headerText);
    expect(headerText).to.equal("Welcome to video experience enhancer");
  });

  it("video controls works correctly on coursera", async function () {
    console.log("Opening Coursera page with a video.");
    await driver.get(
      `https://www.coursera.org/lecture/generative-ai-for-everyone/welcome-chD5R`
    );

    if (!RUN_IN_HEADLESS_MODE) {
      console.log("Accepting cookies.");
      // Waiting for the cookies bar to load.
      await sleep(1 * SECOND);
      const cookiesButton = await driver
        .findElement(By.css("#onetrust-accept-btn-handler"))
        .click();
    }

    console.log("Loading and playing the video.");
    await driver
      .findElement(
        By.css('button[data-track-component="click_play_video_button"]')
      )
      .click();

    console.log("Entering fullscreen mode.");
    const fullscreenButton = await driver
      .findElement(By.css('button[title="Fullscreen"]'))
      .click();

    console.log("Testing that the video is playing.");
    const video = await driver.findElement(By.css("video"));
    expect(await video.getProperty("paused")).to.equal(false);

    console.log("Pausing the video.");
    await driver.actions().sendKeys(" ").perform();

    console.log("Testing that the video is paused.");
    expect(await video.getProperty("paused")).to.equal(true);
    
    let currentTime = Number(await video.getAttribute("currentTime"));
    
    console.log("Seeking forward.");
    await driver.actions().sendKeys(Key.ARROW_RIGHT).perform();
    
    console.log("Testing that the video is seeked forward.");
    let newCurrentTime = Number(await video.getAttribute("currentTime"));
    expect(newCurrentTime).to.be.closeTo(currentTime + 5, 5);
    currentTime = newCurrentTime;

    console.log("Seeking backward.");
    await driver.actions().sendKeys(Key.ARROW_LEFT).perform();

    console.log("Testing that the video is seeked backward.");
    newCurrentTime = Number(await video.getAttribute("currentTime"));
    expect(newCurrentTime).to.be.closeTo(currentTime - 5, 5);
    currentTime = newCurrentTime;

    console.log("Playing the video.");
    await driver.actions().sendKeys(" ").perform();

    console.log("Testing that the video is playing.");
    expect(await video.getProperty("paused")).to.equal(false);

    console.log("Pressing 'c' to show the English subtitles.");
    await video.click(); // Focus the element.
    await driver.actions().sendKeys("c").perform();

    console.log("Testing that the English subtitles are shown.");
    const englishTrack = await video.getProperty("textTracks").then((tracks) =>
      tracks.find((track) => track.language === "en")
    );
    expect(await englishTrack.mode).to.equal("showing");
  });

  afterEach(async function () {
    await driver.quit();
  });
});

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function writeFile(filename, base64Data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, base64Data, "base64", function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

async function takeScreenshot(filename, driver) {
  const data = await driver.takeScreenshot();
  const base64Data = data.replace(/^data:image\/png;base64,/, "");
  await writeFile(filename, base64Data);
}
