// MIT licensed. (C) Dj Walker-Morgan 2018

var BigRedButton = require('./BigRedButton');

function configureButton(button) {
  button.on('buttonPressed', function () {
    console.log('button pressed');
  });

  button.on('buttonReleased', function () {
    console.log('button released');
  });

  button.on('lidRaised', function () {
    console.log('lid raised');
  });
  button.on('lidClosed', function () {
    console.log('lid closed');
  });

  button.on('buttonGone', function () {
    console.log('button gone');
    setTimeout(newButton,1000);
  });
}

// Test a new button
function newButton() {
  console.log("Getting button 0")
  try {
    bigRedButton=new BigRedButton.BigRedButton(0);
  }
  catch(err) {
      console.log("No button, waiting");
      setTimeout(newButton,1000);
      return;
  }

  configureButton(bigRedButton);
  console.log("Configured button 0")
  return;
}

newButton();
