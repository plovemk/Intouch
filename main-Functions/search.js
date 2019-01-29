const FileHound = require('filehound');
var colors = require('colors');
const readline = require('readline');
const filehound = FileHound.create();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var mapResults;
var resultQuestion;
var results = new Map();
var query = process.argv[2]
    query = '*' + query + '*';
var depthNumber = process.argv[3] ? process.argv[3] : 1
var nextNumber = parseInt(depthNumber) + 1;

console.log(`Search Depth: ${depthNumber} `)
console.time("Search Time")
console.log("\n")

filehound
  .paths('Z:\\')
  .directory()
  .depth(depthNumber)
  .match(query)
  .find((err,files) => {
    if (err) return console.error(err);
     console.timeEnd("Search Time");
     console.log("\n\n")
     mapResults(files);
  })


function mapResults(files){
  files.map((file, index) => {
    console.log(colors.green(index + ': ' + file + "\n"))
    results.set(index, file)
  })
  files.length < 1 ?  (console.log(colors.yellow(`Try changing the depth of the search field for more results: searchJobs ${process.argv[2]} ${nextNumber} \n`)), process.exit() ): resultQuestion(results)

}

function resultQuestion(results) {
  rl.question('Select an index: \n', (answer) => {
    answer = parseInt(answer);
    answer = results.get(answer);
    console.log('Opening \n', colors.green(answer))
    process.chdir(`${answer}`)
    require('child_process').exec(`explorer "."` )
    rl.close();
  })
}
