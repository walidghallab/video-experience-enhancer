const puppeteer = require("puppeteer");
const EXTENSION_PATH = "../src";
const EXTENSION_ID = "mpfjhdjnkhbcpanciplfndahccpopkdk";

let browser;

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false,
    args: [
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`,
    ],
  });
});

test("popup renders correctly", async () => {
  const page = await browser.newPage();
  await page.goto(`chrome-extension://${EXTENSION_ID}/popup.html`);
  const header = await page.waitForSelector("h1");
  const headerText = await page.evaluate(
    (header) => header.textContent,
    header
  );
  expect(headerText).toBe("Welcome to Coursera video experience enhancer");
});

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

test(
  "video controls works correctly on coursera",
  async () => {
    console.log("Opening Coursera page with a video.");
    const page = await browser.newPage();
    await page.goto(
      `https://www.coursera.org/lecture/generative-ai-for-everyone/welcome-chD5R`
    );

    console.log("Accepting cookies.");
    const cookiesButton = await page.waitForSelector("text/Accept All");
    await page.evaluate(
      (cookiesButton) => cookiesButton.click(),
      cookiesButton
    );

    console.log("Loading the video.");
    const videoPlaceholder = await page.waitForSelector(
      'button[data-track-component="click_play_video_button"]'
    );
    await page.evaluate(
      (videoPlaceholder) => videoPlaceholder.click(),
      videoPlaceholder
    );
    
    console.log("Entering fullscreen mode.");
    const fullscreenButton = await page.waitForSelector(
      'button[title="Fullscreen"]'
    );
    await page.evaluate(
      (fullscreenButton) => fullscreenButton.click(),
      fullscreenButton
    );

    const video = await page.waitForSelector("video");

    console.log("Testing that the video is playing.");
    let currentTime = await page.evaluate((video) => video.currentTime, video);
    await sleep(100);
    let newCurrentTime = await page.evaluate(
      (video) => video.currentTime,
      video
    );
    expect(newCurrentTime).toBeGreaterThan(currentTime);

    console.log("Pausing the video.");
    await page.keyboard.press(" ");

    console.log("Testing that the video is paused.");
    currentTime = await page.evaluate((video) => video.currentTime, video);
    await sleep(100);
    newCurrentTime = await page.evaluate((video) => video.currentTime, video);
    expect(currentTime).toBe(newCurrentTime);

    console.log("Seeking forward.");
    currentTime = await page.evaluate((video) => video.currentTime, video);
    await page.keyboard.press("ArrowRight");

    console.log("Testing that the video is seeked forward.");
    newCurrentTime = await page.evaluate((video) => video.currentTime, video);
    expect(newCurrentTime).toBeCloseTo(currentTime + 5, 5);

    console.log("Seeking backward.");
    currentTime = await page.evaluate((video) => video.currentTime, video);
    await page.keyboard.press("ArrowLeft");

    console.log("Testing that the video is seeked backward.");
    newCurrentTime = await page.evaluate((video) => video.currentTime, video);
    expect(newCurrentTime).toBeCloseTo(currentTime - 5, 5);

    console.log("Playing the video.");
    await page.keyboard.press(" ");

    console.log("Testing that the video is playing.");
    currentTime = await page.evaluate((video) => video.currentTime, video);
    await sleep(100);
    newCurrentTime = await page.evaluate((video) => video.currentTime, video);
    expect(newCurrentTime).toBeGreaterThan(currentTime);
  },
  10 * 1000 // 10 seconds
);

afterEach(async () => {
  await browser.close();
  browser = undefined;
});
