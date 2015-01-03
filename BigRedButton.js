// BigRedButton.js - Dream Cheeky Big Red Button node.js/node-hid driver
// MIT licensed. (C) Dj Walker-Morgan 2013

var HID = require('node-hid');
var util = require('util');
var events = require('events');

var allDevices;
var cmdStatus=new Buffer([ 0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02 ]);
var lastState;

var LID_DOWN=0x15, LID_UP=0x17, BUTTON_DOWN=0x16;

function getAllDevices()
{
     allDevices = HID.devices(7476,13);
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
   this.button = bigRedButton[index];
   this.hid = new HID.HID(bigRedButton[index].path);

   this.hid.write(cmdStatus);

   var that=this;
   this.hid.read(function(error,data) {
      lastState=data[0];
      that.hid.read(that.interpretData.bind(that));
   });
   this.interval = setInterval(this.askForStatus.bind(this),100);
   this.close = function() {
      clearInterval(this.interval);
      this.interval = false;
      setTimeout(function() {
         this.hid.close();
      }.bind(this), 100);
      this.emit("buttonGone");
   };
}

util.inherits(BigRedButton, events.EventEmitter);

BigRedButton.prototype.askForStatus = function() {
   this.hid.write(cmdStatus);
};

BigRedButton.prototype.interpretData = function(error, data) {
   if (!this.interval || error || !data) {
      this.close();
      return;
   }
   var newState=data[0];

   if (lastState!=newState) {
      if (lastState==LID_DOWN && newState==LID_UP) {
         this.emit("lidRaised");
      } else if (lastState==LID_UP && newState==BUTTON_DOWN) {
         this.emit("buttonPressed");
      } else if (lastState==BUTTON_DOWN && newState==LID_UP) {
         this.emit("buttonReleased");
      } else if (lastState==BUTTON_DOWN && newState==LID_DOWN) {
         this.emit("buttonReleased");
         this.emit("lidClosed");
      } else if (lastState==LID_UP && newState==LID_DOWN) {
         this.emit("lidClosed");
      }
      lastState=newState;
   }

   this.hid.read(this.interpretData.bind(this));
}

BigRedButton.prototype.isLidUp = function() {
   return lastState==LID_UP || lastState==BUTTON_DOWN;
}

BigRedButton.prototype.isButtonPressed = function() {
   return lastState==BUTTON_DOWN;
}

BigRedButton.prototype.isLidDown = function() {
   return lastState==LID_DOWN;
}

exports.BigRedButton = BigRedButton;
exports.deviceCount = function () { return getAllDevices().length; }
