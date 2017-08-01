var fs = require('fs');
var path = require('path');
const remote = require('electron').remote;
var keyboards = {};

function getKeyboards(){
  fs.readdirSync(path.join(__dirname, '..', 'keyboards')).forEach(file => {
    console.log(file);
  })
  loadKeyboard('en-us')
}

function loadKeyboard(keyboard){
  let keyBoardHTML = "<table>";
  let keyBoardJson = require(path.join(__dirname, '..', 'keyboards', (keyboard + '.json')));
console.log(keyBoardJson)
  for (var i in keyBoardJson['rows']){
    for (var j = 0; j < keyBoardJson['rows'][i].length; j++){
      console.log(keyBoardJson['rows'][i][j].join(' '));
    }
  }


}

function closeWindow(){
  var window = remote.getCurrentWindow();
  window.close();
}

function minWindow(){
  var window = remote.getCurrentWindow();
  window.minimize();
}
