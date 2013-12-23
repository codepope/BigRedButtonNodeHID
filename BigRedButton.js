// BigRedButton.js - Dream Cheeky Big Red Button node.js/node-hid driver
// MIT licensed. (C) Dj Walker-Morgan 2013

var HID = require('node-hid');
var util = require('util');
var events = require('events');

var allDevices;
var cmd_status=new Buffer([ 0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02 ]);
var last_state;

var LID_DOWN=0x15, LID_UP=0x17, BUTTON_DOWN=0x16;

function getAllDevices()
{
    if (!allDevices) {
        allDevices = HID.devices(7476,13);
    }
    return allDevices;
}

function BigRedButton(index)
{
    if (!arguments.length) {
            index = 0;
    }

    var bigRedButton = getAllDevices();
    if (!bigRedButton.length) {
        throw new Error("No BigRedButton could be found");
    }
    if (index > bigRedButton.length || index < 0) {
        throw new Error("Index " + index + " out of range, only " + bigRedButton.length + " BigRedButton found");
    }
    this.hid = new HID.HID(bigRedButton[index].path);

    this.hid.write(cmd_status);
    
    var that=this;
    this.hid.read(function(error,data) {
    	last_state=data[0];
    	that.hid.read(that.interpretData.bind(that));
    });
    setInterval(this.askForStatus.bind(this),100);
}

util.inherits(BigRedButton, events.EventEmitter);

BigRedButton.prototype.askForStatus = function() {
	 this.hid.write(cmd_status);
};

BigRedButton.prototype.interpretData = function(error, data) {
   var n_state=data[0];

   if(last_state!=n_state) {
   		if(last_state==LID_DOWN && n_state==LID_UP) {
   			this.emit("lidRaised");
   		} else if (last_state==LID_UP && n_state==BUTTON_DOWN) {
   			this.emit("buttonPressed");
   		} else if(last_state==BUTTON_DOWN && n_state==LID_UP) {
   			this.emit("buttonReleased");
   		} else if(last_state==BUTTON_DOWN && n_state==LID_DOWN) {
   			this.emit("buttonReleased");
   			this.emit("lidClosed");
   		} else if(last_state==LID_UP && n_state==LID_DOWN) {
   			this.emit("lidClosed");
   		}
   		last_state=n_state;
   }

   this.hid.read(this.interpretData.bind(this));
}

BigRedButton.prototype.isLidUp = function() {
	return last_state==LID_UP || last_state==BUTTON_DOWN;
}

BigRedButton.prototype.isButtonPressed = function() {
	return last_state==BUTTON_DOWN;
}

BigRedButton.prototype.isLidDown = function() {
	return last_state==LID_DOWN;
}

exports.BigRedButton = BigRedButton;
exports.deviceCount = function () { return getAllDevices().length; }


       