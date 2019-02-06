const fs = require("fs-extra");
const mainShell = "powershell/Microsoft.PowerShell_profile.ps1";
const os = require("os");
const powerPath = `C:/Users/${os.userInfo().username}/Documents/WindowsPowerShell`;
const scriptsFolder = "powershell/scripts";
// const folder = "powershell/";
// var futureFile;
// var currentFile;

function makeFiles(currentFile, futureFile) {

  fs.copy(currentFile, futureFile, err => {
    if (err) return console.error(err);
    console.log("success! ps1 file created ", futureFile);
  });
}
function subLoop(folder) {
  // console.log(" user info", os.userInfo())
  var file;
  fs.readdir(folder, function(err, dir) {
    for (file in dir) {
      let scriptFunctions = powerPath + "/Scripts/" + dir[file];
      let cFile = scriptsFolder + "/" + dir[file];
      makeFiles(cFile, scriptFunctions);

    }
  });
}

subLoop(scriptsFolder);
makeFiles(mainShell, `${powerPath}/Microsoft.PowerShell_profile.ps1`);
