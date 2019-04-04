// const sharp = require("sharp");
const puppeteer = require("puppeteer");
const async = require("async");
var Jimp = require("jimp");
var fs = require("fs");
var colors = require("colors");
var path = require("path");
// var en = "ENGLISH/";
// var sp = "SPANISH/";
var englishDir = path.resolve("./") + "\\ENGLISH\\";
var spanishDir = path.resolve("./") + "\\SPANISH\\";
// const filetoScreenGrab = process.argv[2];
var fType;
var langFolderArray = [
  "ENGLISH","SPANISH"
];
var mapSizeImg = new Object();
var ImageHeight;

var runChromium = async function(PathWithName, ScreenGrabName) {

  (async () => {
    const browser = await puppeteer.launch({
      executablePath: "chrome.exe"
    });
    const page = await browser.newPage();
    await page.goto("file:///" + PathWithName, {"waitUntil" : "networkidle0"});
  
    await page.setViewport({
      width: 600,
      height: 2000
    });
    await page.screenshot({
      path: ScreenGrabName
    });
    ImageHeight = await page.evaluate(() => document.getElementsByTagName("html")[0].offsetHeight);
    mapSizeImg = {
      height: ImageHeight,
      name: ScreenGrabName,
      addObj: async function addObj(height, name){
        await resizeImagesBundle(name, height);
      }
    };
    await mapSizeImg.addObj(ImageHeight, ScreenGrabName);
    await browser.close();
  })();
};

async function filterFiles(allFiles) {
  let PathWithName;
  var ScreenGrabName;
  var langType;
  // let previewPath;
  allFiles.forEach(async function(file) {
    fType = file.includes("html");
    ScreenGrabName = file.replace(".html", ".jpg");
    langType = file.includes("EN-US") ? "EN-US" : "ES-US";
    (async () => {
      if(fType){
        switch (langType) {
        case "EN-US":
          PathWithName = englishDir + file;

          await runChromium(PathWithName, ScreenGrabName);
          break;
        case "ES-US":
          PathWithName = spanishDir + file;

          await runChromium(PathWithName, ScreenGrabName);
          break;
        default:

        }
      }
    })();
  });
}

function getAllFiles() {
  async.concat(langFolderArray, fs.readdir, function(err, allFiles){
    filterFiles(allFiles);
  });
}

function resizeImage(width, type, img, height) {
  let newFile = img.replace(".jpg", type);
  let cropHeight = height + 10;
  let evalName = img.includes("EN-US");
  let htmlDir = evalName ? englishDir : spanishDir;
  newFile = htmlDir + newFile;
  let thumbCheck = newFile.includes("thumb");

  Jimp
    .read(img)
    .then((image)  => {
      image.crop(0,0, image.bitmap.width, cropHeight);
      return thumbCheck ? image.resize(width, Jimp.AUTO ) : image.resize(width, Jimp.AUTO );
    })
    .then(image => image.writeAsync(newFile))
    .catch(err => console.log(err));
}

function preview(img, height) {
  resizeImage(498, "-preview.jpg", img, height);
  console.log(colors.green(`PREVIEW CREATED: ${img} \n Height: ${height} \n`));
}

function email(img, height) {
  resizeImage(298, "-email.jpg", img, height);
  console.log(colors.green(`EMAIL CREATED: ${img} \n Height: ${height} \n`));
}

function thumb(img, height) {
  resizeImage(130, "-thumb.jpg", img, height);
  console.log(colors.green(`THUMBNAIL CREATED: ${img} \n Height: ${height} \n`));
}



async function resizeImagesBundle(img, height) {
  await preview(img, height);
  await email(img, height);
  await thumb(img, height);
}


getAllFiles();
