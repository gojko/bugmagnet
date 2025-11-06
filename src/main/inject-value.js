/*global chrome*/
'use strict';
const executeRequest = require('../lib/inject-value-to-active-element'),
	listener = function (request /*, sender, sendResponse */) {
		executeRequest(request);
		chrome.runtime.onMessage.removeListener(listener);
	};
chrome.runtime.onMessage.addListener(listener);
