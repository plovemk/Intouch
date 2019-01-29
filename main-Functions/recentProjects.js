var async = require('async');
var fs = require('fs');
var os = require('os');
var jFile = `C:/Users/${os.userInfo().username}/Intouch/intouch-tools/main-Functions/recent-jobs/jobs.json`;
var jobId = process.argv[2];
var jobName = process.argv[3];
var jobType = process.argv[4];
var jobPath = process.argv[5];
var date = new Date();
var fileContents;
var ff;
var jobsSeed = new Object({
  recentDir: []
})
var projectObject = new Object({
  id: jobId,
  name: jobName,
  path: jobPath,
  jobType: jobType,
  date: date.toJSON(),
})

async function existCheck() {
   ff = fs.existsSync(jFile)
  if(ff){
    pushParse()
  } else {
    await fs.writeFileSync(jFile, JSON.stringify(jobsSeed))
    await pushParse()
  }
}

async function pushParse() {
  await readFile()
  await parsePushContents()
  await writeFile()
}

 function pushtoList(){
    try {
      let newObj = fs.appendFileSync(jFile, JSON.stringify(projectObject))
      console.log('file was appended')
    } catch (err){
      console.log(err)
    }
}
function readFile(){
   fileContents = fs.readFileSync(jFile, {encoding: 'utf8'})
  return fileContents
}
function parsePushContents(){
  fileContents = JSON.parse(fileContents);
  fileContents['recentDir'].push(projectObject)
  console.log(`type of file contents ${JSON.stringify(fileContents)}`)
}
function writeFile() {
    fs.writeFileSync(jFile, JSON.stringify(fileContents))
}

existCheck()


//--------------Email--------------
// releaseEmail(jobId) functionName
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
