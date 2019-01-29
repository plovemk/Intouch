process.chdir(__dirname);
var puppeteer = require('puppeteer');
var fs = require('fs-extra');
var findElement;
var file;
var missLinks;
var argPath = process.argv[2];
var misFile;
var firstGrab = async function(file) {
  var attrAr = [];
  const browser = await puppeteer.launch({
    executablePath: 'chrome.exe'
  });
  const page = await browser.newPage();
  await page.goto("file:///" + file, {"waitUntil": "networkidle0"});
  missLinks = await page.$$eval('[href="#"]', e => e.map(a => '{\n' + '"COMPONENT-COPY": ' + '"' + a.parentNode.textContent + '",'+ '\n' + '"LINK-COPY": ' + '"' + a.text + '"' + '\n}'));
  await  findElement(missLinks);
  await browser.close();
}

function findElement(missLinks) {
  fs.writeFile(argPath + '\\missing.json', missLinks,(err) => {
    if (err) throw err;
    console.log('Links to pages and PDFs that are missing are in missing.json" \n --------------------------- \n')
  })
}
function dirLoop(argPath) {
  fs.readdir(argPath, function(err, dir) {
    for (file in dir) {

      fType = dir[file].includes("html");
      langType = dir[file].includes("EN-US");
      if (fType && langType) {
        file = argPath + '/' + dir[file];
        firstGrab(file);
      }
    }
  })
}
dirLoop(argPath);
