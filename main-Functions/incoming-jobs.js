require("dotenv").config();
const puppeteer = require("puppeteer");
const eachSeries = require("async/eachSeries");
const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const os = require("os");
const convertCSV = require("./transformData.js");
const pathCSV = `C:\\Users\\${os.userInfo().username}\\Downloads`;
const reportPage = process.env.APRIMO_REPORT;
let mappedStatsArray = [];
let tempPath;
let birthdate;
let fileObject;


const devsArray = [
  {winName: "Love", nameIn: "Love, Paul", nameOut: "Paul Love"},
  {winName: "Freelancer - McGee", nameIn: "McGee, Kayla", nameOut: "Kayla McGee"},
  {winName: "Freelancer - Nipper", nameIn: "Nipper, Riley" , nameOut: "Riley Nipper"}
];
function runChromium() {

  eachSeries(devsArray, async(dev) => {

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
    await page.goto(reportPage, {"waitUntil" : "networkidle0"});
    await page.waitForSelector("#fieldDRowsRun_txtStringFilterVal001001", {"timeout": 15000});
    await page.waitFor("input[name='fieldDRowsRun_txtStringFilterVal001001']");
    await page.focus("input[name='fieldDRowsRun_txtStringFilterVal001001']");
    await page.keyboard.type(dev.winName);
    await page.click("#Save");
    //this creates a promise to target page that is created aafter save is clicked
    const newPagePromise = new Promise(resolve => browser.on("targetcreated", target => resolve(target.page())));
    await page.waitFor("#ExportToolBarItem");
    await page.click("#ExportToolBarItem");
    const newPage = await newPagePromise;
    await newPage.waitFor("a");
    await newPage.click("a");
    await setTimeout(() => {scanDownloads(dev);}, 3500);
    await setTimeout(() => {browser.close();}, 1500);
  });
}

async function scanDownloads(dev){
  var csvArray = [];
  var x;
  fs.readdir(pathCSV, {"withFileTypes": true}, (err,data) => {
    if (err) throw err;
    for(x in data){
      tempPath = path.join(pathCSV, data[x]);
      data[x].includes(".csv") ? csvArray.push(tempPath) : null;
    }

    (() => {
      csvArray.forEach((val, index) => {
        birthdate = fs.statSync(csvArray[index]);
        fileObject = new Object({
          name: csvArray[index],
          date: birthdate.birthtime
        });
        mappedStatsArray.push(fileObject);
      });
    })();
    // console.log("devdevIndex", dev )
    findLatestFile(mappedStatsArray, dev);
  });
}
function findLatestFile(mappedStatsArray, dev ){
  var mostRecentString;
  var sortedArray;
  var mostRecent;

  sortedArray = _.sortBy(mappedStatsArray, [function(o) { return o.date;}]);
  mostRecent = _.last(sortedArray);
  mostRecentString = JSON.stringify(mostRecent);
  fs.writeFile("main-Functions\\data\\most-recent.json", mostRecentString,{ flag: "w+" }, (err) => {
    if (err) throw err;
    // console.log(`most recent ${JSON.stringify(mostRecent, null, 2)} \n most recent string ${mostRecentString}`);
    convertCSV.runAsyncFunc(mostRecent.name, dev);
    return mostRecent;
  });
}


runChromium();
