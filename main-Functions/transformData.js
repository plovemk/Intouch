
const replace = require("replace-in-file");
const fs = require("fs");
const { finished } = require("stream");
const colors = require("colors");
const csvjson = require("csvjson");
const iconv = require("iconv-lite");
const utf8 = require("utf8");
const _ = require("lodash");


var today = new Date();
today = today.toISOString();
today = Date.parse(today);

// Possible node databases to use
// https://www.npmjs.com/package/lowd
// https://www.npmjs.com/package/lokijsb


//need a function that takes newCsvPath reads the data and converts to csv files
function copyData(newCsvPath, dev) {
  var testfile = "main-Functions/data/temp-2019.csv";

  fs.readFile(newCsvPath, (err,data) => {
    if (err) throw err;
    data = iconv.decode(Buffer.from(data), "utf16le");
    data = utf8.encode(data);
    data = data.trim();
    writeData(testfile, data);
  });
  //this function writes to the the csv file
  function writeData(testfile, data) {
    fs.writeFile(testfile, data, (err) => {
      if (err) throw err;
    });
    fixNameString(testfile, dev);
  }


  //This funciton reads csv file and changes the name format in the Assignee columnm
  async function fixNameString(path, dev) {
    var nameIn = new RegExp(dev.nameIn, "g");
    var options = {
      files: path,
      from: [ nameIn],
      to: [ dev.nameOut + ","]
    };
    await replace(options);
    await convertTexttoJson(testfile);
  }
  // convert csv file to json files
  function convertTexttoJson(source) {
    var jPath = "main-functions/data/tempName.json";
    var readStream = fs.createReadStream(source);
    var write = fs.createWriteStream(jPath);
    var toObject = csvjson.stream.toArray();
    var contentString = csvjson.stream.stringify();
    readStream.pipe(toObject).pipe(contentString).pipe(write);
    //finished event is fired and the func to change the string in the json file is created.
    finished(write, (err) => {
      if(err) throw err;
      fixJString(jPath);
    });
  }
  //This function changes the json string and removes the tab charachters from the json file
  async function fixJString(jPath) {
    var options = {
      files: jPath,
      from: [  /\\t/g, /Developer/g, /Role/g],
      to: [ "\", \"", "Developer", "Role,"],
    };
    await replace(options);
    await formatObjects(dev, today, jPath);
  }
}
//this will read the json file and format array into an object with values from the header being the keysObject
// lodash helper _ zipObject helped with this
function formatObjects(dev, today, jPath) {
  var testJson = jPath;
  var x;
  var readJ = fs.readFileSync(testJson);
  var keysObject;
  var statsObject = {};
  readJ = JSON.parse(readJ);
  console.log(` \n  ${colors.magenta(dev.winName)} - Total Jobs: ${readJ.length - 1}\n --------------------`);
  for(x in readJ) {
    if(x > 0) {
      keysObject = _.zipObject(readJ[0], readJ[x]);
      getStats();
    }
  }
  //calculate days left for a job
  function getDaysLeft() {
    let taskEndDate = keysObject["TSA Date"];
    taskEndDate = Date.parse(taskEndDate);
    let d = Math.abs(taskEndDate - today)/1000;
    let diff = Math.floor(d/86400);

    return diff;
  }
  //pushes all of the important stats into an object
  function getStats() {
    statsObject = {
      devName: keysObject["Last Name"],
      jobName: keysObject["Job Title"],
      JobId: keysObject["Job ID"],
      daysRemain: getDaysLeft()
    };
    let daysCase = statsObject.daysRemain >= 6 ? true: false;
    switch (daysCase ) {
    case true:
      console.log(`${colors.green(statsObject.JobId)} ${colors.green(statsObject.jobName)} has  ${colors.green(statsObject.daysRemain)} days until Launch.`);
      break;
    case false:
      console.log(`${colors.red(statsObject.JobId)} ${colors.red(statsObject.jobName)} has  ${colors.red(statsObject.daysRemain)} days until Launch.`);
      break;
    default:
    }
  }
}


const runAsyncFunc = async (name, dev) => {
  await copyData(name, dev);
};


module.exports.runAsyncFunc = runAsyncFunc;
