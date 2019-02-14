const os = require("os");
require("dotenv").config({ path: `C:/Users/${os.userInfo().username}/Intouch/.env` });
const puppeteer = require("puppeteer");
const trafficPage = process.env.APRIMO_TRAFFIC;
const jobNumber = process.argv[2];

const runChromium = async function() {
  const browser = await puppeteer.launch({
    executablePath: "chrome.exe",
    headless: false,
    slowMo: 25,
    args: ["--window-size=1920,1200"]
    // devtools: true
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1200
  });
  await page.goto(trafficPage, {"waitUntil" : "networkidle0"});
  await page.waitForSelector("#fieldDRowsRun_txtNumericFilterVal001001", {"timeout": 25000});
  await page.waitFor("input[name='fieldDRowsRun_txtNumericFilterVal001001']");
  await page.focus("input[name='fieldDRowsRun_txtNumericFilterVal001001']");
  await page.keyboard.type(jobNumber);
  await page.click("#Save");
};

runChromium();
