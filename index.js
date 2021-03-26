const fetch = require('node-fetch');
const fs = require('fs');

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

ask();

function ask() {
  rl.question('Download (d) or Upload (u)?', (answer) => {
    if (answer.toLowerCase().trim() == "d") {
      return download();
    }
    if (answer.toLowerCase().trim() == "u") {
      return upload();
    }
    console.log('Invalid input');
    ask();
  });
}

function download() {
  fetch('https://drawserver.yodacode.repl.co/whiteboard').then(a => a.text()).then(text => {
    fs.writeFileSync(__dirname + '/whiteboard.draw', text, 'utf-8');
    fs.renameSync(__dirname + '/whiteboard.draw', __dirname + '/whiteboard_REFRESH.draw');
    setTimeout(() => {    
      fs.renameSync(__dirname + '/whiteboard_REFRESH.draw', __dirname + '/whiteboard.draw');
      console.log("Download complete");
      ask();
    }, 100);
  });
}

function upload() {
  fetch('https://drawserver.yodacode.repl.co/whiteboard', {
    method: "POST",
    headers: {
      'content-type': "application/json"
    },
    body: fs.readFileSync(__dirname + '/whiteboard.draw', 'utf-8')
  }).then(a => a.text()).then(text => {
    console.log("Upload complete");
    ask();
  });
}
