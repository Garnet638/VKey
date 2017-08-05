//Requirments
var fs = require('fs');
var path = require('path');
//Allow control of main window to dynamically scale
const remote = require('electron').remote;
var window = remote.getCurrentWindow();
//List of every keyboard
var keyboards = {};
//What modifier are we on rn?
var mod = 0;
//0 Lowercase
//1 Uppercase
//2 Caps
//3 Ctrl
//4 Alt

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
  let keyBoardHTML = '<ul class="center" id="keyboardRowContainer">';

  //The keyboard's file
  let keyBoardJson = require(path.join(__dirname, '..', 'keyboards', (keyboard + '.json')));

  //Iterate through the keyboard's rows
  for (var i in keyBoardJson['rows']){

    //New table row
    keyBoardHTML += '<li class="keyboardRow">';

    //Iterate though individual keys
    for (var j = 0; j < keyBoardJson['rows'][i].length; j++){

      //Modifiers/Special keys
      if (shortcutKeys.has(keyBoardJson['rows'][i][j][0])){
        switch (keyBoardJson['rows'][i][j][0]){
          default:
            keyBoardHTML += '<div class="key special"><p class="flow-text white-text">' + shortcutKeys.get(keyBoardJson['rows'][i][j][0]) + '</p></div>';
            break;

          case '{lalt}':
          case '{ralt}':
            keyBoardHTML += '<div class="key special alt waves-effect waves-light" onclick="alt()"><p class="flow-text white-text">Alt</p></div>';
            break;

          case '{lctrl}':
          case '{rctrl}':
            keyBoardHTML += '<div class="key special ctrl waves-effect waves-light" onclick="ctrl()"><p class="flow-text white-text">Ctrl</p></div>';
            break;

          case '{lshift}':
          case '{rshift}':
            keyBoardHTML += '<div class="key special shift waves-effect waves-light" onclick="shift(0)"><p class="flow-text white-text">Shift</p></div>';
            break;

          case '{capsl}':
            keyBoardHTML += '<div class="key special capsl waves-effect waves-light" onclick="shift(1)"><p class="flow-text white-text">Caps Lock</p></div>';
            break;

          case '{tab}':
            keyBoardHTML += '<div class="key special tab waves-effect waves-light" onclick="pressKey(\'\t\')"><p class="flow-text white-text">Tab</p></div>';
            break;

          case '{bksp}':
            keyBoardHTML += '<div class="key special bksp waves-effect waves-light" onclick="backspace()"><p class="flow-text white-text">Backspace</p></div>';
            break;

          case '{enter}':
            keyBoardHTML += '<div class="key special bksp waves-effect waves-light" onclick="pressKey(\'\n\')"><p class="flow-text white-text">Enter</p></div>';
            break;

          case '{space}':
            keyBoardHTML += '<div class="key special bksp waves-effect waves-light" onclick="pressKey(\' \')"><p class="flow-text white-text"> </p></div>';
            break;
        }
      }

      //Normal keys
      else{
        //Lowercase
        keyBoardHTML += '<div class="key lowercase waves-effect waves-light" onclick="pressKey(\'' + keyBoardJson['rows'][i][j][0] + '\')"><p class="flow-text white-text">' + keyBoardJson['rows'][i][j][0] + '</p></div>';

        //Uppercase
        if (keyBoardJson['rows'][i][j][1] != null){
          keyBoardHTML += '<div class="key uppercase waves-effect waves-light" onclick="pressKey(\'' + keyBoardJson['rows'][i][j][1] + '\')"><p class="flow-text white-text">' + keyBoardJson['rows'][i][j][1] + '</p></div>';
        }
        else{
          keyBoardHTML += '<div class="key uppercase waves-effect waves-light" onclick="pressKey(\'' + keyBoardJson['rows'][i][j][0] + '\')"><p class="flow-text white-text">' + keyBoardJson['rows'][i][j][0] + '</p></div>';
        }

        //Control
        if (keyBoardJson['rows'][i][j][2] != null){
          keyBoardHTML += '<div class="key ctrlk waves-effect waves-light" onclick="pressKey(\'' + keyBoardJson['rows'][i][j][2] + '\')"><p class="flow-text white-text">' + keyBoardJson['rows'][i][j][2] + '</p></div>';
        }
        else{
          keyBoardHTML += '<div class="key ctrlk waves-effect waves-light" onclick="pressKey(\'' + keyBoardJson['rows'][i][j][0] + '\')"><p class="flow-text white-text">' + keyBoardJson['rows'][i][j][0] + '</p></div>';
        }

        //Alt
        if (keyBoardJson['rows'][i][j][3] != null){
          keyBoardHTML += '<div class="key altk waves-effect waves-light" onclick="pressKey(\'' + keyBoardJson['rows'][i][j][3] + '\')"><p class="flow-text white-text">' + keyBoardJson['rows'][i][j][3] + '</p></div>';
        }
        else{
          keyBoardHTML += '<div class="key altk waves-effect waves-light" onclick="pressKey(\'' + keyBoardJson['rows'][i][j][0] + '\')"><p class="flow-text white-text">' + keyBoardJson['rows'][i][j][0] + '</p></div>';
        }
      }
    }

    //End table row
    keyBoardHTML += '</li>';

  }

  //Close HTML
  keyBoardHTML += '</ul>';

  $('#keyboard').html(keyBoardHTML);
  $('.key').slideUp(0);
  $('.special').slideDown(0);
  $('.lowercase').slideDown(0);
  $('#keyboard').slideDown(0);

  window.setTimeout(function(){window.resizeTo(($('#keyboard').width()), $('#window').height()+25);},5);


}

function pressKey(key){
  $('#textarea').val($('#textarea').val() + key);
  if (mod == 1){mod = 0;}
}

function backspace(){
  $('#textarea').val($('#textarea').val().substring(0, $('#textarea').val().length-1));
}

//Shift and caps lock
function shift(type){

  //Unpress
  if (mod > 0){
    mod = 0;
    $('.key').slideUp(0);
    $('.special').slideDown(0);
    $('.lowercase').slideDown(0);
  }

  //Shift
  else {
    if (type == 0){mod = 1;}

    //Capslock
    else if (type == 1){mod = 2;}

    //Show correct keys
    $('.key').slideUp(0);
    $('.special').slideDown(0);
    $('.uppercase').slideDown(0);
  }
}

//Control
function ctrl(){

  //Unpress
  if (mod > 0){
    mod = 0;
    $('.key').slideUp(0);
    $('.special').slideDown(0);
    $('.lowercase').slideDown(0);
  }

  //Press
  else{
    mod = 3;
    //Show correct keys
    $('.key').slideUp(0);
    $('.special').slideDown(0);
    $('.ctrlk').slideDown(0);
  }

}


//Alt
function alt(){

  //Unpress
  if (mod > 0){
    mod = 0;
    $('.key').slideUp(0);
    $('.special').slideDown(0);
    $('.lowercase').slideDown(0);
  }

  //Press
  else{
    mod = 4;
    //Show correct keys
    $('.key').slideUp(0);
    $('.special').slideDown(0);
    $('.altk').slideDown(0);
  }

}

function closeWindow(){
  window.close();
}

function minWindow(){
  window.minimize();
}
