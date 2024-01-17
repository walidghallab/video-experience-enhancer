import { Options } from "selenium-webdriver/chrome.js";
import { Builder } from "selenium-webdriver/index.js";
import { By, Key } from "selenium-webdriver";
import { expect } from "chai";
import * as fs from "fs";
import logging, { Logger, getLogger } from "selenium-webdriver/lib/logging.js";

const EXTENSION_PATH = "../src";
const EXTENSION_ID = "gpgijjcmnjpbdpaijihbchgdeencehng";
const SECOND = 1000;
const RUN_IN_HEADLESS_MODE = true;
const LOGGING_LEVEL = logging.Level.INFO;

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
  const logger = getLogger("webdriver");
  logger.setLevel(LOGGING_LEVEL);
  logging.installConsoleHandler();

  function logInfo(message) {
    logger.log(logging.Level.INFO, message);
  }

  beforeEach(async function () {
    const options = new Options();
    options.addArguments(`load-extension=${EXTENSION_PATH}`);
    if (RUN_IN_HEADLESS_MODE) {
      options.addArguments("headless=new");
    }

    logInfo("Starting the browser.");
    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
  });

  it("popup renders correctly", async function () {
    logInfo("Opening the extension popup");
    await driver.get(`chrome-extension://${EXTENSION_ID}/popup/index.html`);
    const headerText = await driver.findElement(By.css("h1")).getText();
    expect(headerText).to.equal("Welcome to video experience enhancer");
  });

  it("edits keyboard shortcuts correctly", async function () {
    logInfo("Opening the extension popup");
    await driver.get(`chrome-extension://${EXTENSION_ID}/popup/index.html`);

    logInfo('Clicking on "Edit keyboard shortcuts"');
    await driver.findElement(By.css("#edit-shortcuts")).click();

    logInfo('Change the shortcut for "Toggle English subtitles" to Ctrl + E/e');
    await driver.findElement(By.css("#toggle-english-subtitles")).click();
    await driver
      .actions()
      .keyDown(Key.CONTROL)
      .sendKeys("e")
      .keyUp(Key.CONTROL)
      .perform();
    const actualKeyValue = await driver
      .findElement(By.css("#toggle-english-subtitles"))
      .getAttribute("value");
    const expectedKeyValue = "Ctrl + E/e";
    expect(actualKeyValue).to.equal(expectedKeyValue);

    logInfo("Saving the shortcut changes");
    await driver.findElement(By.css("#save-shortcuts")).click();

    logInfo("Opening Coursera page with a video.");
    await driver.get(
      `https://www.coursera.org/lecture/generative-ai-for-everyone/welcome-chD5R`
    );

    if (!RUN_IN_HEADLESS_MODE) {
      logInfo("Accepting cookies.");
      // Waiting for the cookies bar to finish loading.
      // This is needed because in the cookies bar is moving in the beginning so attempting to click after it is being in the DOM it will fail.
      await sleep(1 * SECOND);
      const cookiesButton = await driver
        .findElement(By.css("#onetrust-accept-btn-handler"))
        .click();
    }

    logInfo("Loading and playing the video.");
    await driver
      .findElement(
        By.css('button[data-track-component="click_play_video_button"]')
      )
      .click();

    logInfo("Pressing 'Ctrl + e' to show the English subtitles.");
    const video = await driver.findElement(By.css("video"));
    await video.click(); // Focus the element.
    await driver
      .actions()
      .keyDown(Key.CONTROL)
      .sendKeys("e")
      .keyUp(Key.CONTROL)
      .perform();

    logInfo("Testing that the English subtitles are shown.");
    const englishTrack = await video
      .getProperty("textTracks")
      .then((tracks) => tracks.find((track) => track.language === "en"));
    expect(await englishTrack.mode).to.equal("showing");
  });

  it("video keyboard shortcuts works correctly on Coursera", async function () {
    logInfo("Opening Coursera page with a video.");
    await driver.get(
      `https://www.coursera.org/lecture/generative-ai-for-everyone/welcome-chD5R`
    );

    if (!RUN_IN_HEADLESS_MODE) {
      logInfo("Accepting cookies.");
      // Waiting for the cookies bar to finish loading.
      // This is needed because in the cookies bar is moving in the beginning so attempting to click after it is being in the DOM it will fail.
      await sleep(1 * SECOND);
      const cookiesButton = await driver
        .findElement(By.css("#onetrust-accept-btn-handler"))
        .click();
    }

    logInfo("Loading and playing the video.");
    await driver
      .findElement(
        By.css('button[data-track-component="click_play_video_button"]')
      )
      .click();

    logInfo("Seeking forward.");
    const video = await driver.findElement(By.css("video"));
    let currentTime = Number(await video.getAttribute("currentTime"));
    await driver.actions().sendKeys(Key.ARROW_RIGHT).perform();

    logInfo("Testing that the video is seeked forward.");
    let newCurrentTime = Number(await video.getAttribute("currentTime"));
    expect(newCurrentTime).to.be.closeTo(currentTime + 5, 5);
    currentTime = newCurrentTime;

    logInfo("Entering fullscreen mode.");
    const fullscreenButton = await driver
      .findElement(By.css('button[title="Fullscreen"]'))
      .click();

    logInfo("Testing that the video is playing.");
    expect(await video.getProperty("paused")).to.equal(false);

    logInfo("Pausing the video.");
    await driver.actions().sendKeys(" ").perform();

    logInfo("Testing that the video is paused.");
    await video.click(); // Focus the element.
    expect(await video.getProperty("paused")).to.equal(true);

    currentTime = Number(await video.getAttribute("currentTime"));

    logInfo("Seeking forward.");
    await driver.actions().sendKeys(Key.ARROW_RIGHT).perform();

    logInfo("Testing that the video is seeked forward.");
    newCurrentTime = Number(await video.getAttribute("currentTime"));
    expect(newCurrentTime).to.be.closeTo(currentTime + 5, 5);
    currentTime = newCurrentTime;

    logInfo("Seeking backward.");
    await driver.actions().sendKeys(Key.ARROW_LEFT).perform();

    logInfo("Testing that the video is seeked backward.");
    newCurrentTime = Number(await video.getAttribute("currentTime"));
    expect(newCurrentTime).to.be.closeTo(currentTime - 5, 5);
    currentTime = newCurrentTime;

    logInfo("Playing the video.");
    await driver.actions().sendKeys(" ").perform();

    logInfo("Testing that the video is playing.");
    expect(await video.getProperty("paused")).to.equal(false);

    logInfo("Pressing 'c' to show the English subtitles.");
    await driver.actions().sendKeys("c").perform();

    logInfo("Testing that the English subtitles are shown.");
    const englishTrack = await video
      .getProperty("textTracks")
      .then((tracks) => tracks.find((track) => track.language === "en"));
    expect(await englishTrack.mode).to.equal("showing");

    logInfo("Increasing playback rate (3 times).");
    await driver
      .actions()
      .keyDown(Key.CONTROL)
      .sendKeys(Key.ARROW_UP)
      .keyUp(Key.CONTROL)
      .perform();
    await driver
      .actions()
      .keyDown(Key.CONTROL)
      .sendKeys(Key.ARROW_UP)
      .keyUp(Key.CONTROL)
      .perform();
    await driver
      .actions()
      .keyDown(Key.CONTROL)
      .sendKeys(Key.ARROW_UP)
      .keyUp(Key.CONTROL)
      .perform();

    logInfo("Testing playback increased by 1.5.");
    expect(await video.getProperty("playbackRate")).to.equal(2.5);

    logInfo("Decreasing playback rate (2 times).");
    await driver
      .actions()
      .keyDown(Key.CONTROL)
      .sendKeys(Key.ARROW_DOWN)
      .keyUp(Key.CONTROL)
      .perform();
    await driver
      .actions()
      .keyDown(Key.CONTROL)
      .sendKeys(Key.ARROW_DOWN)
      .keyUp(Key.CONTROL)
      .perform();

    logInfo("Testing playback decreased by 1.");
    expect(await video.getProperty("playbackRate")).to.equal(1.5);
  });

  it("video keyboard shortcuts works correctly on Youtube", async function () {
    logInfo("Opening Youtube page with a video.");
    await driver.get(`https://www.youtube.com/watch?v=byauTRO4t30`);

    try {
      logInfo("Accepting cookies.");
      // Waiting for the cookies bar to load.
      await sleep(1 * SECOND);
      await driver.findElement(By.css("button[aria-label*='Accept']")).click();
    } catch (e) {
      logInfo(`Cookies were not accepted, error (${e}), resuming the test.`);
    }

    await sleep(1 * SECOND);
    const video = await driver.findElement(By.css("video"));

    logInfo("Increasing playback rate (3 times).");
    await driver
      .actions()
      .keyDown(Key.CONTROL)
      .sendKeys(Key.ARROW_UP)
      .keyUp(Key.CONTROL)
      .perform();
    await driver
      .actions()
      .keyDown(Key.CONTROL)
      .sendKeys(Key.ARROW_UP)
      .keyUp(Key.CONTROL)
      .perform();
    await driver
      .actions()
      .keyDown(Key.CONTROL)
      .sendKeys(Key.ARROW_UP)
      .keyUp(Key.CONTROL)
      .perform();

    logInfo("Testing playback increased by 1.5.");
    expect(await video.getProperty("playbackRate")).to.equal(2.5);

    logInfo("Decreasing playback rate (2 times).");
    await driver
      .actions()
      .keyDown(Key.CONTROL)
      .sendKeys(Key.ARROW_DOWN)
      .keyUp(Key.CONTROL)
      .perform();
    await driver
      .actions()
      .keyDown(Key.CONTROL)
      .sendKeys(Key.ARROW_DOWN)
      .keyUp(Key.CONTROL)
      .perform();

    logInfo("Testing playback decreased by 1.");
    expect(await video.getProperty("playbackRate")).to.equal(1.5);
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
