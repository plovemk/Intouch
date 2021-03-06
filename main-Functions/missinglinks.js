process.chdir(__dirname);
const puppeteer = require("puppeteer");
const fs = require("fs-extra");
const argPath = process.argv[2];

async function firstGrab(file) {
  var missLinks;
  var missLink;
  const browser = await puppeteer.launch({
    executablePath: "chrome.exe"
  });
  const page = await browser.newPage();
  await page.goto("file:///" + file, {"waitUntil": "networkidle0"});
  // missLinks = await page.$$eval("[href=\"#\"]", e => e.map(a => "{\n" + "\"COMPONENT-COPY\": " + "\"" + a.parentNode.textContent + "\"," + "\n}"));
  // missLink = await page.$$eval("[href=\"\"]", e => e.map(a => "{\n" + "\"COMPONENT-COPY\": " + "\"" + a.parentNode.textContent + "\"," + "\n}"));
  missLinks = await page.$$eval("[href=\"#\"]", e => e.map(a =>  a.parentNode.textContent.replace(/\t/g,"") + ""));
  missLink = await page.$$eval("[href=\"\"]", e => e.map(a =>  a.parentNode.textContent.replace(/\t/g,"") +  ""));

  await  findElement(missLinks, missLink);
  await browser.close();
}
function findElement(missLinks, missLink) {
  var links;

  links = {
    missLink,
    missLinks
  };
  fs.writeFile(argPath + "\\missing.json", JSON.stringify(links, null, 2),(err) => {
    if (err) throw err;
    console.log("Links to pages and PDFs that are missing are in missing.json\" \n --------------------------- \n");
  });
}

function dirLoop(argPath) {
  var fType;
  var langType;
  var file;
  fs.readdir(argPath, function(err, dir) {
    for (file in dir) {

      fType = dir[file].includes("html");
      langType = dir[file].includes("EN-US");
      if (fType && langType) {
        file = argPath + "/" + dir[file];
        firstGrab(file);
      }
    }
  });
}
dirLoop(argPath);
