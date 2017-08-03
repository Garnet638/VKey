//Requirments
var fs = require('fs');
var path = require('path');
//Allow control of main window to dynamically scale
const remote = require('electron').remote;
var window = remote.getCurrentWindow();
//List of every keyboard
var keyboards = {};
//Names and symbols for the shortcut keys
var shortcutKeys = new Map([
  ['{lalt}', 'Alt'],
  ['{ralt}', 'Alt'],
  ['{lctrl}', 'Ctrl'],
  ['{rctrl}', 'Ctrl'],
  ['{win}', 'WIN'],
  ['{tab}', 'Tab'],
  ['{capsl}', 'Caps Lock'],
  ['{space}', ''],
  ['{bksp}', 'Backspace'],
  ['{lshift}', 'Shift'],
  ['{rshift}', 'Shift'],
  ['{enter}', 'Enter']
]);


//Get a list of all keyboards in /keyboards
function getKeyboards(){
  fs.readdirSync(path.join(__dirname, '..', 'keyboards')).forEach(file => {
    console.log(file);
  })

  //Placeholder, will eventually do something to change it
  loadKeyboard('hy');
}

//Load keys
function loadKeyboard(keyboard){

  //Initialize HTML
  let keyBoardHTML = '<div class="row">';

  //The keyboard's file
  let keyBoardJson = require(path.join(__dirname, '..', 'keyboards', (keyboard + '.json')));

  //Iterate through the keyboard's rows
  for (var i in keyBoardJson['rows']){

    //New table row
    keyBoardHTML += '<div class="keyboardRow">';

    //Iterate though individual keys
    for (var j = 0; j < keyBoardJson['rows'][i].length; j++){

      //Modifiers/Special keys
      if (shortcutKeys.has(keyBoardJson['rows'][i][j][0])){
        keyBoardHTML += '<div class="key special"><p class="flow-text white-text">' + shortcutKeys.get(keyBoardJson['rows'][i][j][0]) + '</p></div>';
      }

      //Normal keys
      else{
        //Lowercase
        keyBoardHTML += '<div class="key lowercase"><p class="flow-text white-text">' + keyBoardJson['rows'][i][j][0] + '</p></div>';

        //Uppercase
        if (keyBoardJson['rows'][i][j][1] != null){
          keyBoardHTML += '<div class="key uppercase"><p class="flow-text white-text">' + keyBoardJson['rows'][i][j][1] + '</p></div>';
        }

        //Control
        if (keyBoardJson['rows'][i][j][2] != null){
          keyBoardHTML += '<div class="key ctrl"><p class="flow-text white-text">' + keyBoardJson['rows'][i][j][2] + '</p></div>';
        }
      }
    }

    //End table row
    keyBoardHTML += '</div>';

  }

  //Close HTML
  keyBoardHTML += '</div>';

  $('#keyboard').html(keyBoardHTML);
  $('#keyboard').slideDown(0);

  window.setTimeout(function(){window.resizeTo(($('#keyboard').width()), $('#window').height()+25);},5);


}

function closeWindow(){
  window.close();
}

function minWindow(){
  window.minimize();
}
