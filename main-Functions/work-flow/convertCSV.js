const replace = require("replace-in-file");
const excelToJson = require("convert-excel-to-json");
const async = require("async");
const colors = require("colors");
const csvjson = require("csvjson");
const iconv = require("iconv-lite");
const utf8 = require("utf8");
const _ = require("lodash");
const path = require("path");
const os = require("os");
const pathCSV = `C:\\Users\\${os.userInfo().username}\\Downloads`;
const fs = require("fs");
// var incoming = require('./../incoming-jobs.js');
// const recentFile = require("./most-recent.json");
var fileArr = [];
var csvArr = [];
var today = new Date();
today = today.toISOString();
today = Date.parse(today);
// var age;
// var xcel;
var stats;
var fileStats = {};
var jobsDetails = {};
var jobDeatailsArray = [];
var devWorkLoad = {};
var xp;
let dates;
var findExt;
var sorted;
var dataCsv;
var file;

async function convertFile(name ,dev){
  var getDaysLeft;
  var jobsArray;
  // var streamJobs;
  // var options;
console.log(`most recent name ${name}`)
  // options = {
  //   files: name,
  //   from:
  // }
  // let testfile = path.join("main-Functions/work-flow/temp-2019.txt");
  // streamJobs =
  // fs.readFile(name, 'utf8', (err, xdata) => {
  //   if (err) throw err;
  //   console.log(`streaming jobs ${colors.green(xdata)}`);
  //   // return xdata;
  //   fs.writeFile(testfile, xdata, (err) => {
  //     if (err) throw err;
  //     console.log(`this is streaming the csv file ${xdata}`);
  //     return xdata;
  //   });
  // });
  file = excelToJson({
    sourceFile: name,
    header:{
      rows: 1
    },
    columnToKey: {
      A: "Assignee",
      B: "JobId",
      C: "JobTitle",
      D: "LaunchDate",
      E: "TaskEndDate",
      F: "FirstName",
      G: "LastName",
      H: "Role"


    }
  });
  file = JSON.stringify(file, null, 2);
  console.log(`${colors.red(file)}`)
  console.log(`   ${colors.magenta(dev.winName)} \n --------------------`);
  //creating a new file called jobs.json from the stringified file variable above
  //this also calls a function getDaysLeft
  await (() => {
    fs.writeFile("main-Functions\\work-flow\\jobs.json", file, (err) => {
      if (err) throw err;
      getDaysLeft();
    });
  })();

  getDaysLeft  = () =>  {
    file = JSON.parse(file);
    jobsArray = file["Sheet1"];

    jobsArray.forEach((jobData) => {

      console.log(" \n");
      let temp = JSON.stringify(jobData.TaskEndDate);

      temp = JSON.parse(temp);
      temp = Date.parse(temp);
      let d = Math.abs(temp - today)/1000;
      let diff= Math.floor(d/86400);
      jobsDetails = {
        name: dev.nameOut,
        jobNumber: jobData.JobId,
        daysRemain: diff

      };
      jobDeatailsArray.push(jobsDetails);
      console.log(` ${colors.yellow(diff)} days remaining for ${colors.green(jobData.JobId)}.`);
    });
    // devWorkLoad = {
    //   name: dev.winName,
    //   jobsList: jobDeatailsArray
    // }
    console.log(`\n\n ${colors.magenta(jobsArray.length)} jobs remaining \n`);
    let stringWorkload = JSON.stringify(jobDeatailsArray);

    fs.appendFile("main-Functions\\work-flow\\all-jobs.json", stringWorkload, (err) => {
      if(err) throw err;
      console.log(`\n this is the devworkload obj ${stringWorkload}`);

    });
    // return devWorkLoad;
  };
  // await (() => {
  // let stringWorkload = JSON.stringify(devWorkLoad);
  //
  //   fs.appendFile('main-Functions\\work-flow\\all-jobs.json', stringWorkload, (err) => {
  //     if(err) throw err;
  //     console.log(`\n this is the devworkload obj ${stringWorkload}`)
  //
  //   })
  // })()
  // console.log(`\n this is the devworkload obj ${devWorkLoad}`)
  console.log(`This is convert file should be one ${colors.green('one')}`)
}

//function that creates new object and pushes object into toArray
// tempaArr = [];
// devwithjobsObj = {
//   name: 'Love',
//   jobDetails: function(){
//
//   }
// }
//then take array and append create/append new file


///scan dir function that is synchronous readdirSync
const getFiles = () => {
  fs.readdirSync(pathCSV).forEach((d) => {
    fileArr.push(d);
  });
  console.log(`This is getfiles file should be two ${colors.green('two')}`)
  return fileArr;
};


//anotherfunction that is asynchronous and gives the stats of the files in that directory.
const getStats = () => {
  var age;
  var xcel;
  fileArr.map((download) => {
    stats = fs.statSync(pathCSV + "\\" + download);
    age = stats.birthtime;
    xcel = download.includes("xlsx");
    findExt = path.extname(download).includes(".csv");

    if(findExt){
      fileStats = {
        age: age,
        name: download
      };
      csvArr.push(fileStats);
    }
  });
  console.log(`This is getStats file should be 3 ${colors.green('3')}`)
};
//sort the files
function sortByDate() {
  sorted = _.sortBy(csvArr, ["age"]);
  sorted = _.last(sorted);
  console.log(`This is sortByDate file should be 4 ${colors.green('4')}`)
  return sorted;
}

//change the file ext
function changeExt() {
  // console.log(`path csv ${pathCSV}`)
  let source = path.join(pathCSV, sorted.name);
  let testfile = path.join("main-Functions/work-flow/sample.json");
  var readStream = fs.createReadStream(source, {encoding: "utf16le"});
  var write = fs.createWriteStream(testfile);
  var toObject = csvjson.stream.toArray();
  var stringify = csvjson.stream.stringify();
  // var pipes =
  readStream.pipe(toObject).pipe(stringify).pipe(write);
  dataCsv = fs.readFile(source,(err, data) => {
    if(err) throw err;
    data = iconv.decode(Buffer.from(data), "UTF8");
    data = utf8.encode(data);
    console.log(`data returend in changeext func ${data}`)
    return data;
  });

}
async function fixString(dev){
  var changes;
  var options = {
    files: "main-Functions\\work-flow\\sample.json",
    from: [  /\\t/g, /\[/g, /\]/g, /"/g, dev.nameIn, /Developer/g, /Role/g],
    to: [ ", ", "", "\n", "",dev.nameOut, "Developer,", "Role,"],
    // from: [  /\\t/g, /\[/g, /\]/g, /"/g, /,Love,Paul/g, /Developer/g, /Role/g],
    // to: [ ', ', '', '\n', "",'Paul Love', 'Developer,', 'Role,']
    // from: [  /\\t/g, /\[/g, /\]/g, /"/g, /, McGee, Kayla/g, /Developer/g, /Role/g],
    // to: [ ', ', '', '\n', "",'Kayla Mcgee', 'Developer,', 'Role,']
    // from: [  /\\t/g, /\[/g, /\]/g, /"/g, /, Nipper, Riley/g, /Developer/g, /Role/g],
    // to: [ ', ', '', '\n', "",'Riley Nipper', 'Developer,', 'Role,']
  };
  // console.log('dev type', typeof dev);
  try {
    // changes =
    changes = await
     replace(options).then((data) => {

       // await
       console.log(`this is changes where readeseample changes as param is called ${ typeof data}`)
      return  readSample(data);
     });
    // readSample((options) => {
    //   return replace(options)
    // })
  }
  catch(error) {
    console.error("error occured", error);
  }
  console.log(`This is fix string file should be 5 ${colors.green('5')}`)
}
function readSample(changedFile) {
  var csvFile = "main-Functions\\work-flow\\sample.csv";
  var newFile;
  // var xFile =
  console.log(`this is csvfile ${typeof csvFile} and this is changed file ${changedFile}`)
  fs.readFile(changedFile[0], (err, data) => {
    data = iconv.decode(Buffer.from(data), "UTF8");
    data = utf8.encode(data);
    data = data.trim();
    // var dataText =
    console.log(`this is the data from changedfile ${data}`)
    fs.writeFile(csvFile, data, (err) => {
      if(err) throw err;
      changeExt(csvFile);
    });
  });
  newFile = excelToJson({
    sourceFile: csvFile,
    header:{
      rows: 1
    },
    columnToKey: {
      A: "Assignee",
      B: "JobId",
      C: "JobTitle",
      D: "LaunchDate",
      E: "TaskEndDate",
      F: "FirstName",
      G: "LastName",
      H: "Role"
    }
  });
  newFile = JSON.stringify(newFile);

  fs.writeFile("main-Functions\\work-flow\\jobadiya.json", newFile, (err) => {
    if (err) throw err;
  });
}


const runAsyncFunc = async (name, dev) => {

  await convertFile(name, dev);
  // await getFiles();
  // await getStats();
  // await sortByDate();
  // await fixString(dev);
};
module.exports.runAsyncFunc = runAsyncFunc;
