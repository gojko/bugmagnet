module.exports = function injectValueRequestHandler(browserInterface, tabId, requestValue) {
	'use strict';
	return browserInterface.executeScript(tabId, '/inject-value.js')
		.then(() => browserInterface.sendMessage(tabId, requestValue));
};

