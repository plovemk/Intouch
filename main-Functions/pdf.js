require('dotenv').config();
const puppeteer = require('puppeteer');
const {combinePDF} = require('pdf-toolz/SplitCombine');
const path = require('path');
var colors = require('colors');
const fs = require('fs');
const mzfs = require('mz/fs');
const aw = require('await-fs');
var filetoScreenGrab = process.argv[2];
var langParam = process.argv[3];
var version = process.argv[4]
var englishBoardPath = filetoScreenGrab.replace('Production\\HTML', 'Boards\\Screenshots\\en-US\\');
var spanishBoardPath = filetoScreenGrab.replace('Production\\HTML', 'Boards\\Screenshots\\es-US\\');
var finalBoardPath = filetoScreenGrab.replace('Production\\HTML', 'Boards\\Screenshots\\');
var ScreenGrabName;
var pathWithName;
var exec;
var i = 0;


var firstGrab = async function(filetoScreenGrab, ScreenGrabName) {
  var options = {
    path: ScreenGrabName,
    format: 'Tabloid',
    printBackground: true
  };
    const browser = await puppeteer.launch({
      executablePath: 'chrome.exe',
      // headless: false,
      // slowMo: 250,
      // devtools: true
  });
    const page = await browser.newPage();
    // await page.evaluate(() => {debugger;});

  await page.goto(filetoScreenGrab, {waitUntil: 'networkidle0'});
  await page.emulateMedia('screen');
  await page.pdf(options)
  await page.close();
  await browser.close();
}
var mergePDF = async function(newArr) {
  var readFiles = [];
  i++;
  process.chdir(finalBoardPath)
  i == 1 ? require('child_process').exec('explorer ""."') : null

  for (const pFile of newArr) {
    var contents = await mzfs.readFile(pFile)
    readFiles.push(contents)
  }
  async function ghostMerge() {
    try{
      const combined = await combinePDF(readFiles);
      await mzfs.writeFile(finalBoardPath + langParam + '-' + version + ".pdf", combined)
      if(i === 0){
        i++;
        console.log("get i ", i)
        require('child_process').exec('explorer ""."')
      }
      console.log(colors.green('Files created successfully'))
    }catch(err) {
      console.log(err)
    }
}
ghostMerge()
}
var pdfPathArray = async function(englishBoardPath) {
  var boardArray = [];
  var newArr = [];
  var pName;

    (async () => {
      try{
        let test = await fs.readdir(englishBoardPath, function(err,dir) {
          for(file in dir){
            boardArray.push(englishBoardPath + dir[file])
          }
          newArr = boardArray;
          mergePDF(newArr)
        })
        }catch(err){
          console.log(err)
      }
    })()
}
function dirLoop(folder) {
  let newPath = filetoScreenGrab + "\\" + folder + '\\';
  fs.readdir(newPath, function(err, dir) {

    for (file in dir) {
      fType = dir[file].includes("html");
      langType = dir[file].includes("EN-US");

      if (fType && langType) {
        ScreenGrabName = englishBoardPath + dir[file].replace('.html', '.pdf');
        pathWithName = newPath + dir[file];
        firstGrab(pathWithName, ScreenGrabName).then(function() {
          pdfPathArray(englishBoardPath)
        });
      }
       else if(fType && !langType) {
       ScreenGrabName = spanishBoardPath + dir[file].replace('.html', '.pdf');
       pathWithName = newPath + dir[file];

        firstGrab(pathWithName, ScreenGrabName).then(function() {
          pdfPathArray(spanishBoardPath)});
      }
    }
  })
}
function findFolders( filetoScreenGrab, langParam){
  let tempFolder;
  if (!langParam) {
    throw 'Missing a parameter: Specify the langtype[english, spanish, en, sp]'
  }

    fs.readdir(filetoScreenGrab, function(err, dir) {
      let enCheck = langParam.includes("en")
      let spCheck = langParam.includes("sp")
      for(index in dir) {
        tempFolder = dir[index];
        if(tempFolder == 'ENGLISH' && enCheck){
          dirLoop(tempFolder)
        }
        else if (tempFolder == 'SPANISH' && spCheck) {
          dirLoop(tempFolder)
        }

      }
    })
}

findFolders(filetoScreenGrab,langParam)
