const executeRequest = require('../execute-request');
window.chrome.runtime.onMessage.addListener(function (request /*, sender, sendResponse */) {
	'use strict';
	executeRequest(request);
});
