/*global chrome*/
const executeRequest = require('../execute-request');
chrome.runtime.onMessage.addListener(function (request /*, sender, sendResponse */) {
	'use strict';
	executeRequest(request);
});
