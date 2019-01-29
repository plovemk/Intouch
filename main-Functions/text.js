require('dotenv').config();
var htmlToText = require('html-to-text');
const path = require('path');
var _ = require('lodash');
var fs = require('fs');

var en = 'HTML/ENGLISH/';
var sp = 'HTML/SPANISH/';
var htmlDir = path.resolve("./" + '\\HTML\\');
var folder;
var englishDir = path.resolve("./") + '\\HTML\\ENGLISH\\';
var spanishDir = path.resolve("./") + '\\HTML\\SPANISH\\';
var htmlDir = path.resolve("./" + '\\HTML\\');
var filetoScreenGrab;
var ScreenGrabName;
var pathWithName;
var previewPath;
var textArray = ['SUBJECT','[[ConsultantPWS]]','[[OptOutText]]'];
var findSubject;
var i = 0;

function copyText(){

  htmlToText.fromFile( `${process.env.TOOLS_PATH}/HTML/ENGLISH/863909-DM-Cyber-Monday-EC-IBC-CON-blank-EN-US.html`,  {
    // preserveNewlines: true,
    ignoreImage: true,

    // tables: true
    // baseElement: 'a'
    //need to format and add dotted lines in the spots they need to go

    format: {
      anchor: function(elem,loop) {
        let title = elem.attribs.title;
        let url = elem.attribs.href;
        return title + '\n' + url + '\n\n';
      },
      // text: function(elems, loop){
      //    findSubject = elems.data.trim();
      //   // = textArray.includes(findSubject);
      //   if(findSubject != ''){
      //     console.log('this is working', findSubject)
      //     // if(i = 3 || 9 || 14 ){
      //     //   return '\n' + '-------------------------------------------------------------------';
      //     //
      //     // }
      //       // let boolSub = _.startsWith(item, findSubject)
      //     textArray.forEach(function(item, index) {
      //       let boolSub = _.startsWith(item, findSubject)
      //       if(boolSub){
      //         console.log('\n' + '-------------------------------------------------------------------', )
      //         // console.log('$$$$$$$$$$$$$$$$$$$$$$$$', findSubject);
      //         return '\n' + '-------------------------------------------------------------------';
      //         // console.log('findSubject inside lodash', item);
      //       }
      //     })
      //
      //   }
      //
      //   // let fSubject = findSubject ? findSubject : '';
      // },

    },
  }, (err, text) => {
    if (err) return console.error(err);
    fs.writeFile('name.txt', text, (err) => {
      if (err) return console.error(err);
      // console.log(text);
    });
  });
}

function dirLoop(folder) {
  fs.readdir(folder, function(err, dir) {
    for (file in dir) {
      // ScreenGrabName = dir[file].replace('.html', '.pdf');
      fType = dir[file].includes("html");
      langType = dir[file].includes("EN-US");
      if (fType && langType) {
        pathWithName = englishDir + dir[file];
        previewPath = englishDir + ScreenGrabName;
        firstGrab(pathWithName, ScreenGrabName).then(function() {
          // bundle();
        });
      } else if(fType && !langType) {
        pathWithName = spanishDir + dir[file];
        previewPath = spanishDir + ScreenGrabName;
        firstGrab(pathWithName, ScreenGrabName).then(function() {
          // bundle();
        });
      }
    }
  })
}

copyText();
