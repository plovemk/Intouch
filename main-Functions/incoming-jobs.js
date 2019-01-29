require('dotenv').config();
var puppeteer = require('puppeteer');
// var eachOfSeries  = require('async/eachOfSeries');
var eachSeries = require('async/eachSeries');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var os = require('os');
// var PDFParser = require("pdf2json");
var convertCSV = require("./work-flow/convertCSV.js");
var pathCSV = `C:\\Users\\${os.userInfo().username}\\Downloads`;
var colors = require('colors');
var reportPage = process.env.APRIMO_REPORT;
var projected;
// var pdfParser = new PDFParser();
// var fielObject = new Object();
var csvArray = [];
var mappedStatsArray = [];
let tempPath;
let birthdate;
let fileObject;
var sortedArray;
var mostRecent;

var devsArray = [
  {winName: 'Love', nameIn: 'Love, Paul', nameOut: 'Paul Love'},
  {winName: 'Freelancer - McGee', nameIn: 'McGee, Kayla', nameOut: 'Kayla McGee'},
  {winName: 'Freelancer - Nipper', nameIn: 'Nipper, Riley' , nameOut: 'Riley Nipper'}
]
function runChromium() {

  eachSeries(devsArray, async(dev) => {

    const browser = await puppeteer.launch({
      executablePath: 'chrome.exe',
      headless: false,
      slowMo: 25,
      args: ['--window-size=1920,1200']
      // devtools: true
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 1200
    });
    await page.goto(reportPage, {"waitUntil" : "networkidle0"});
    await page.waitForSelector("#fieldDRowsRun_txtStringFilterVal001001", {"timeout": 15000})
    await page.waitFor('input[name="fieldDRowsRun_txtStringFilterVal001001"]')
    await page.focus("input[name='fieldDRowsRun_txtStringFilterVal001001']");
    await page.keyboard.type(dev.winName);
    await page.click('#Save');
    //this creates a promise to target page that is created aafter save is clicked
    const newPagePromise = new Promise(x => browser.on('targetcreated', target => x(target.page())));
    await page.waitFor("#ExportToolBarItem");
    await page.click("#ExportToolBarItem");
    const newPage = await newPagePromise;
    await newPage.waitFor('a');
    await newPage.click('a');
    await setTimeout(() => {scanDownloads(dev)}, 3500);
    await setTimeout(() => {browser.close()}, 1500);
  })
};

async function scanDownloads(dev){


    fs.readdir(pathCSV, {"withFileTypes": true}, (err,data) => {
    if (err) throw err;
    for(x in data){
       tempPath = path.join(pathCSV, data[x]);
       data[x].includes('.csv') ? csvArray.push(tempPath) : null
    };

     (() => {
      csvArray.forEach((val, index) => {
          birthdate = fs.statSync(csvArray[index]);

           fileObject = new Object({
             name: csvArray[index],
             date: birthdate.birthtime
           });
           mappedStatsArray.push(fileObject);
      })
    })();
    // console.log('devdevIndex', dev )
    findLatestFile(mappedStatsArray, dev);
  })
}
 function findLatestFile(mappedStatsArray, dev ){
  sortedArray = _.sortBy(mappedStatsArray, [function(o) { return o.date;}]);
  mostRecent = _.last(sortedArray);
  var mostRecentString = JSON.stringify(mostRecent);
  fs.writeFile("main-Functions\\work-flow\\most-recent.json", mostRecentString,{ flag: 'w+' }, (err) => {
    if (err) throw err;
     convertCSV.runAsyncFunc(mostRecent.name, dev)
    return mostRecent;
  })
}


  runChromium()
