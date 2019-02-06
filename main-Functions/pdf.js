require("dotenv").config();
const puppeteer = require("puppeteer");
const {combinePDF} = require("pdf-toolz/SplitCombine");
const colors = require("colors");
// const path = require("path");
const fs = require("fs");
const mzfs = require("mz/fs");
// const aw = require("await-fs");
const filetoScreenGrab = process.argv[2];
const langParam = process.argv[3];
const version = process.argv[4];
const englishBoardPath = filetoScreenGrab.replace("Production\\HTML", "Boards\\Screenshots\\en-US\\");
const spanishBoardPath = filetoScreenGrab.replace("Production\\HTML", "Boards\\Screenshots\\es-US\\");
const finalBoardPath = filetoScreenGrab.replace("Production\\HTML", "Boards\\Screenshots\\");
// var ScreenGrabName;
// var pathWithName;
// var exec;
let i = 0;


const firstGrab = async function(filetoScreenGrab, ScreenGrabName, langPath) {
  var options = {
    path: ScreenGrabName,
    format: "Tabloid",
    printBackground: true
  };
  var browser = await puppeteer.launch({
    executablePath: "chrome.exe",
    // headless: false,
    // slowMo: 250,
    // devtools: true
  });
  const page = await browser.newPage();
  // await page.evaluate(() => {debugger;});

  await page.goto(filetoScreenGrab, {waitUntil: "networkidle0"});
  await page.emulateMedia("screen");
  await page.pdf(options);
  await page.close();
  await browser.close();
  await pdfPathArray(langPath);
};
async function mergePDF(newArr) {
  let contents;
  let readFiles = [];
  i++;
  process.chdir(finalBoardPath);
  i == 1 ? require("child_process").exec("explorer \"\".\"") : null;

  for (const pFile of newArr) {
    contents = await mzfs.readFile(pFile);
    readFiles.push(contents);
  }
  async function ghostMerge() {
    try{
      const combined = await combinePDF(readFiles);
      await mzfs.writeFile(finalBoardPath + langParam + "-" + version + ".pdf", combined);
      if(i === 0){
        i++;
        console.log("get i ", i);
        require("child_process").exec("explorer \"\".\"");
      }
      console.log(colors.green("Files created successfully"));
    }catch(err) {
      console.log(err);
    }
  }
  ghostMerge();
}
function pdfPathArray(englishBoardPath) {
  let boardArray = [];
  let newArr = [];
  // var pName;

  (async () => {
    try{
      // let test =
      await fs.readdir(englishBoardPath, function(err,dir) {
        let file;
        for(file in dir){
          boardArray.push(englishBoardPath + dir[file]);
        }
        newArr = boardArray;
        mergePDF(newArr);
      });
    }catch(err){
      console.log(err);
    }
  })();
}
function dirLoop(folder) {
  var pathWithName;
  var ScreenGrabName;
  let newPath = filetoScreenGrab + "\\" + folder + "\\";
  fs.readdir(newPath, function(err, dir) {

    let file;
    let fType;
    let langType;
    for (file in dir) {
      fType = dir[file].includes("html");
      langType = dir[file].includes("EN-US");

      if (fType && langType) {
        ScreenGrabName = englishBoardPath + dir[file].replace(".html", ".pdf");
        pathWithName = newPath + dir[file];
        firstGrab(pathWithName, ScreenGrabName, englishBoardPath);
      }
      else if(fType && !langType) {
        ScreenGrabName = spanishBoardPath + dir[file].replace(".html", ".pdf");
        pathWithName = newPath + dir[file];
        firstGrab(pathWithName, ScreenGrabName, spanishBoardPath);
      }
    }
  });
}
function findFolders( filetoScreenGrab, langParam){
  let tempFolder;
  if (!langParam) {
    throw "Missing a parameter: Specify the langtype[english, spanish, en, sp]";
  }

  fs.readdir(filetoScreenGrab, function(err, dir) {
    let enCheck = langParam.includes("en");
    let spCheck = langParam.includes("sp");
    let index;
    for(index in dir) {
      tempFolder = dir[index];
      if(tempFolder == "ENGLISH" && enCheck){
        dirLoop(tempFolder);
      }
      else if (tempFolder == "SPANISH" && spCheck) {
        dirLoop(tempFolder);
      }

    }
  });
}

findFolders(filetoScreenGrab,langParam);
