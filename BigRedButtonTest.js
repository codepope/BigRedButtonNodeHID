var BigRedButton = require('./BigRedButton');

var bigRedButton;

for (var i = 0; i < BigRedButton.deviceCount(); i++) {

    console.log('opening BigRedButton', i);

    bigRedButton = new BigRedButton.BigRedButton(i);

    bigRedButton.on('buttonPressed', function () {
            console.log('button pressed');
        });

    bigRedButton.on('buttonReleased', function () {
            console.log('button released');
        });

	bigRedButton.on('lidRaised', function () {
            console.log('lid raised');
        });
	bigRedButton.on('lidClosed', function () {
            console.log('lid closed');
        });

 }