require('dotenv').config();
const shell = require('node-powershell');
const async = require('async');
var os = require('os');
const CardEmail = `C:\\Users\\${os.userInfo().username}\\Documents\\WindowsPowerShell\\Scripts\\Emails\\New-Email-Cards.ps1`
const WebEmail = `C:\\Users\\${os.userInfo().username}\\Documents\\WindowsPowerShell\\Scripts\\Emails\\New-Email-Webpage.ps1`;
var fs = require('fs');
var colors = require('colors');
var jFile = `C:/Users/${os.userInfo().username}/Intouch/intouch-tools/main-Functions/recent-jobs/jobs.json`;
var searchQ = process.argv[2];
var fileContents;
var matches = [];
var parsed;
var data;
let jobId;
let jobName;
let releaseLink;
let ps = new shell({
  executionPolicy: 'Bypass',
  noProfile: true
});
async function searchJFile() {
  fileContents = fs.readFileSync(jFile, {encoding: 'utf8'});
  fileContents = JSON.parse(fileContents);
  fileContents = fileContents["recentDir"]
  parsed = Number.parseInt(searchQ);
// (async () => {


    if(Number.isNaN(parsed)) {
      await searchId();
    //take the return value of searchs and use that when calling the function that calls either releasemail or release web
      await emailRouter();
    } else if(!Number.isNaN(parsed)) {
      await searchName();
      await emailRouter();
    }
  // })()
}
//if matches arraylength is equal to one then then run function to run powershell script to open draft of email

function searchId(){
  fileContents.forEach((data,i) => {
    let dName = data.name;
    if(dName.match(searchQ)) {
      matches.push(data)
      console.log(`recent directory searchid ${searchQ}`)
      console.log(colors.green(`heres the path if search matches the name ${data.path}`))
      console.log(`here's an array of the matches ${matches.length}`)
      // return data;
    }
  })
}

function searchName() {
  fileContents.forEach((data, i) => {
    let dId = data.id;
    if(dId.match(searchQ)) {
      matches.push(data)
      console.log(`looks it matches maybe we should break out and do switch statement ${searchQ} `)
      console.log(colors.green(`here's the path that we shuould get al files out of ${data.path}`))
      console.log(`here's an array of the matches ${matches.length}`)
      console.log('matches', matches)
      // return data;
    }
    // console.log(`recent directory searchname ${JSON.stringify(data)}`)

  })

}

function releaseCards(matches){
  // exec("echo 'hello there'" )
  if(matches){
    var matched = matches["0"];
    jobId = matched.id;
    jobName = matched.name;
    releaseLink = matched.path;
    releaseLink = releaseLink.replace("Z:\\",process.env.INTOUCH_SERV).replace("Working folder\\Production\\HTML","Release folder")

    ps.addCommand(CardEmail, [
      {jobid: jobId},
      {jobName: jobName},
      {releaseLink: releaseLink},
    ])
  invokeShell();
  }
}
function releaseWebPage(matches) {
  if(matches) {
    var matched = matches["0"];
     jobId = matched.id;
     jobName = matched.name;
     releaseLink = matched.path;
    let copyLink = releaseLink.replace("Z:\\",process.env.INTOUCH_SERV).replace("Production\\HTML", "Assets\\Documents")
        releaseLink = releaseLink.replace("Z:\\",process.env.INTOUCH_SERV).replace("Working folder\\Production\\HTML","Release folder")

    ps.addCommand(WebEmail, [
      {jobid: jobId},
      {jobName: jobName},
      {releaseLink: releaseLink},
      {copyLink: copyLink}
    ])
  invokeShell();
  }
}
function invokeShell() {
  ps.invoke().then(output => {
    ps.dispose().then(code => {console.log(code)}).catch(err => {});
  }).catch(err => {console.log(err)});
}
function emailRouter() {
   type = matches["0"].jobType;
   jobId = matches["0"].id;
   jobName = matches["0"].name;
  console.log('matches', matches)
  if(matches.length === 1 ){
      switch (type) {
        case 'ecard':
          releaseCards(matches);
          break;
        case 'webpage':
          releaseWebPage(matches);
          break;
        default:
      }
    }
  //check jobType of returned object from the searches in searchJFile()
  //call the either email or webpage inside this function
}
// releaseCards();
searchJFile();








//--------------Email--------------
// releaseCards(jobId) functionName
// take arg and search json Object
//Loop through file obj[index].jobId and if equal to arg then take path Obj[index].jobId
//Use that path to
// --------------ecard email--------------
// path to release folders
// zipped folder files in release should be attached

// --------------WebPage email--------------
// path to release folder
// missing links listed
// path to copy english doc - get by most recent date and CONTAINS check of langType
// path to copy spanish doc = get by most recent date and CONTAINS check of langType
