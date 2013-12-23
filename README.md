BigRedButtonNodeHID
===================

A node-hid based driver to read the Dream Cheeky Big Red Button from node.js.

The test gives an example of use. Polls every 100ms for status and emits lidRaised, lidClosed, buttonPressed, buttonReleased events. Also has functions isLidUp(), isLidDown() and isButtonPressed() for determining state with reference to events.

Uses the node-hid package - https://npmjs.org/package/node-hid to get access.

MIT licensed. (C) Dj Walker-Morgan 2013
