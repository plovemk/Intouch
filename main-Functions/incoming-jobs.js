const puppeteer = require("puppeteer");
const eachSeries = require("async/eachSeries");
const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const os = require("os");
require("dotenv").config({ path: `C:/Users/${os.userInfo().username}/Intouch/.env` });
const convertCSV = require("./transformData.js");
const pathCSV = `C:\\Users\\${os.userInfo().username}\\Downloads`;
const reportPage = process.env.APRIMO_REPORT;
const devName = process.argv[2];
let mappedStatsArray = [];
let tempPath;
let birthdate;
let fileObject;

const devs = [
  {winName: "Love", nameIn: "Love, Paul", nameOut: "Paul Love"},
  {winName: "McGee", nameIn: "McGee, Kayla", nameOut: "Kayla McGee"},
  {winName: "Freelancer - Peters", nameIn: "Peters, Bryan" , nameOut: "Bryan Peters"},
  {winName: "Freelancer - Nipper", nameIn: "Nipper, Riley" , nameOut: "Riley Nipper"}
];

function searchFilter() {
  var nameUpperCased ;
  //if the search Param is all then it will execute runChromium and if not then execut loopDevs
  nameUpperCased = _.upperFirst(devName);
  ((devName == "all") || (devName == undefined) ) ? runChromium(devs) : loopDevs();
  // devName == "all" ? runChromium(devs) : loopDevs();
  //loopdevs will match search with a value in devs array. if there is a match then it will execute the runChromium function
  function loopDevs() {
    _.each(devs, (value, index) => {
      var checkSearchValue = _.includes(value.nameOut, nameUpperCased);
      // console.log(`checkSearchValue ${checkSearchValue} value name out ${value.nameOut}`);
      checkSearchValue ? runChromium([devs[index]]) : null;
    });
  }
}

function runChromium(input) {
  var i = 1;
  (async function(){
    const browser = await puppeteer.launch({
      executablePath: "chrome.exe",
      headless: false,
      slowMo: 35,
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
    // DRowsRun_FilterValStringTextBox001Row_004
    // await page.focus("input[name='fieldDRowsRun_txtStringFilterVal001001']");
    await page.click("#DRowsRun_FilterValStringTextBox001AddLinkText");
    await page.click("#DRowsRun_FilterValStringTextBox001AddLinkText");
    await page.click("#DRowsRun_FilterValStringTextBox001AddLinkText");

    await page.focus(`input[name='fieldDRowsRun_txtStringFilterVal001001']`);
    await page.keyboard.type(devs[0].winName);

    await page.focus(`input[name='fieldDRowsRun_txtStringFilterVal001002']`);
    await page.keyboard.type(devs[1].winName);

    await page.focus(`input[name='fieldDRowsRun_txtStringFilterVal001003']`);
    await page.keyboard.type(devs[2].winName);

    await page.focus(`input[name='fieldDRowsRun_txtStringFilterVal001004']`);
    await page.keyboard.type(devs[3].winName);

    await page.click("#Save");
    //   //this creates a promise to target page that is created aafter save is clicked
    const newPagePromise = new Promise(resolve => browser.on("targetcreated", target => resolve(target.page())));
    /*
    ---------------------THIS IS THE PART THAT DOWNLOADS INTO A SPREADSHEET - DON'T DELETE

    await page.waitFor("#ExportToolBarItem");
    await page.click("#ExportToolBarItem");
    const newPage = await newPagePromise;
    await newPage.waitFor("a");
    await newPage.click("a");
    
    ---------------------THIS IS THE PART THAT DOWNLOADS INTO A SPREADSHEET - DON'T DELETE
    */


    // await setTimeout(() => {scanDownloads(dev);}, 3500);
    // await setTimeout(() => {browser.close();}, 1500);

    // await devs.forEach(async function(dev){
    //   await console.log(`this is the i ${dev.winName}`);
    //   await page.focus(`input[name='fieldDRowsRun_txtStringFilterVal00100${i}']`);
    //   await page.keyboard.type(dev.winName);
    //   await i++;
    //   // await page.focus(`input[name='fieldDRowsRun_txtStringFilterVal00100${i}']`);
    // });
    // };
  })();
  // eachSeries(input, async(dev, page) => {
  //
  //   // await page.keyboard.type(dev.winName);
  //   await page.focus("input[name='fieldDRowsRun_txtStringFilterVal001001']");
  //   await page.keyboard.type(dev.winName);
  //
  //   // await page.click("#Save");
  //   //this creates a promise to target page that is created aafter save is clicked
  //
  //
  //   // const newPagePromise = new Promise(resolve => browser.on("targetcreated", target => resolve(target.page())));
  //   // await page.waitFor("#ExportToolBarItem");
  //   // await page.click("#ExportToolBarItem");
  //   // const newPage = await newPagePromise;
  //   // await newPage.waitFor("a");
  //   // await newPage.click("a");
  //   // await setTimeout(() => {scanDownloads(dev);}, 3500);
  //   // await setTimeout(() => {browser.close();}, 1500);
  // });
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
  fs.writeFile("Intouch\\main-Functions\\data\\most-recent.json", mostRecentString,{ flag: "w+" }, (err) => {
    if (err) throw err;
    // C:\Users\lovep\Intouch\main-Functions\data\most-recent.json
    // console.log(`most recent ${JSON.stringify(mostRecent, null, 2)} \n most recent string ${mostRecentString}`);
    convertCSV.runAsyncFunc(mostRecent.name, dev);
    return mostRecent;
  });
}


// runChromium();
searchFilter();
