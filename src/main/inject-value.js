/*global chrome*/
const executeRequest = require('../lib/execute-request'),
	listener = function (request /*, sender, sendResponse */) {
		'use strict';
		executeRequest(request);
		chrome.runtime.onMessage.removeListener(listener);
	};
chrome.runtime.onMessage.addListener(listener);
