/*global chrome*/
const executeRequest = require('../lib/inject-value-to-active-element'),
	listener = function (request /*, sender, sendResponse */) {
		'use strict';
		executeRequest(request);
		chrome.runtime.onMessage.removeListener(listener);
	};
chrome.runtime.onMessage.addListener(listener);
