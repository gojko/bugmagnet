/*global chrome*/
const executeRequest = require('../lib/execute-request');
chrome.runtime.onMessage.addListener(function (request /*, sender, sendResponse */) {
	'use strict';
	executeRequest(request);
});
