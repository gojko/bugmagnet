'use strict';

var BugMagnet = BugMagnet || {};

// load dependencies
var config = require('sdk/self').data.load('config.json');
var cm = require('sdk/context-menu');
var data = require("sdk/self").data;
BugMagnet.processConfigText(config, new BugMagnet.FirefoxMenuBuilder(cm, data));
