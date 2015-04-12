'use strict';

var BugMagnet = require('./common.js');

// load dependencies
var data = require("sdk/self").data;
var config = data.load('config.json');
var cm = require('sdk/context-menu');
BugMagnet.processConfigText(config, new FirefoxMenuBuilder(cm, data));
