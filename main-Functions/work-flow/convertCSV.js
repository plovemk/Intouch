var replace = require('replace-in-file') ;
var excelToJson = require('convert-excel-to-json');
var async = require('async');
var colors = require('colors');
var csvjson = require('csvjson');
var iconv = require('iconv-lite');
var utf8 = require('utf8');
var _ = require('lodash');
var path = require('path')
var os = require('os');
var pathCSV = `C:\\Users\\${os.userInfo().username}\\Downloads`;
var fs = require('fs');
// var incoming = require('./../incoming-jobs.js');
var recentFile = require('./most-recent.json');
var fileArr = [];
var csvArr = [];
var today = new Date();
    today = today.toISOString();
    today = Date.parse(today);
var age;
var xcel;
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
// console.log(`most recent name ${name}`)
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
      E: "TaskEndDate"


    }
  });
  file = JSON.stringify(file)

  console.log(`   ${colors.magenta(dev.winName)} \n --------------------`)
  //creating a new file called jobs.json from the stringified file variable above
  //this also calls a function getDaysLeft
  await (() => {
    fs.writeFile("main-Functions\\work-flow\\jobs.json", file, (err) => {
      if (err) throw err;
      getDaysLeft();
    });
  })()

  var getDaysLeft  = () =>  {
    file = JSON.parse(file);
    var jobsArray = file['Sheet1'];

    jobsArray.forEach((jobData,index) => {

      console.log(' \n')
      let temp = JSON.stringify(jobData.TaskEndDate);

    temp = JSON.parse(temp);
    temp = Date.parse(temp);
    let d = Math.abs(temp - today)/1000;
    let diff= Math.floor(d/86400)
    jobsDetails = {
      name: dev.winName,
      jobNumber: jobData.JobId,
      daysRemain: diff

    };
    jobDeatailsArray.push(jobsDetails);
    console.log(` ${colors.yellow(diff)} days remaining for ${colors.green(jobData.JobId)}.`)
  })
    // devWorkLoad = {
    //   name: dev.winName,
    //   jobsList: jobDeatailsArray
    // }
    console.log(`\n\n ${colors.magenta(jobsArray.length)} jobs remaining \n`)
    let stringWorkload = JSON.stringify(jobDeatailsArray);

      fs.appendFile('main-Functions\\work-flow\\all-jobs.json', stringWorkload, (err) => {
        if(err) throw err;
        console.log(`\n this is the devworkload obj ${stringWorkload}`)

      })
    // return devWorkLoad;
  }
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
    fileArr.push(d)
  });
  return fileArr
}


//anotherfunction that is asynchronous and gives the stats of the files in that directory.
const getStats = () => {
     fileArr.map((download) => {
        stats = fs.statSync(pathCSV + '\\' + download);
        age = stats.birthtime;
        xcel = download.includes('xlsx');
        findExt = path.extname(download).includes('.csv');

          if(findExt){
            fileStats = {
              age: age,
              name: download
            }
            csvArr.push(fileStats);
          }
    })
}
//sort the files
const sortByDate = () => {
   sorted = _.sortBy(csvArr, ['age']);
      sorted = _.last(sorted);
  return sorted
}

//change the file ext
const changeExt = () => {
  let source = path.join(pathCSV, sorted.name)
  let testfile = path.join("main-Functions/work-flow/sample.json")
  const readStream = fs.createReadStream(source, {encoding: 'utf16le'});
  var write = fs.createWriteStream(testfile)
  var toObject = csvjson.stream.toArray();
  var stringify = csvjson.stream.stringify();
  var pipes = readStream.pipe(toObject).pipe(stringify).pipe(write)
  dataCsv = fs.readFile(source,(err, data) => {
    if(err) throw err;
    data = iconv.decode(Buffer.from(data), 'UTF8')
    data = utf8.encode(data);

  });

}
const fixString = async (dev) => {
  var options = {
    files: "main-Functions\\work-flow\\sample.json",
    from: [  /\\t/g, /\[/g, /\]/g, /"/g, dev.nameIn, /Developer/g, /Role/g],
    to: [ ', ', '', '\n', "",dev.nameOut, 'Developer,', 'Role,']
    // from: [  /\\t/g, /\[/g, /\]/g, /"/g, /,Love,Paul/g, /Developer/g, /Role/g],
    // to: [ ', ', '', '\n', "",'Paul Love', 'Developer,', 'Role,']
    // from: [  /\\t/g, /\[/g, /\]/g, /"/g, /, McGee, Kayla/g, /Developer/g, /Role/g],
    // to: [ ', ', '', '\n', "",'Kayla Mcgee', 'Developer,', 'Role,']
    // from: [  /\\t/g, /\[/g, /\]/g, /"/g, /, Nipper, Riley/g, /Developer/g, /Role/g],
    // to: [ ', ', '', '\n', "",'Riley Nipper', 'Developer,', 'Role,']
  }
  try {
        var changes = await replace(options)
        readSample(changes);
      }
        catch(error) {
        console.error('error occured', error);
      }
}
var readSample = function(changedFile) {
  var csvFile = 'main-Functions\\work-flow\\sample.csv';
  var xFile = fs.readFile(changedFile[0], (err, data) => {
    data = iconv.decode(Buffer.from(data), 'UTF8');
    data = utf8.encode(data);
    data = data.trim();
    var dataText = fs.writeFile(csvFile, data, (err) => {
      if(err) throw err;
      changeExt(csvFile)
    })
  })
  var newFile = excelToJson({
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
  newFile = JSON.stringify(newFile)

  fs.writeFile("main-Functions\\work-flow\\jobadiya.json", newFile, (err) => {
    if (err) throw err;
  });
}


const runAsyncFunc = async (name, dev) => {

                    await convertFile(name, dev);
                    await getFiles();
                    await getStats();
                    await sortByDate();
                    await fixString(dev);
}
module.exports.runAsyncFunc = runAsyncFunc;
