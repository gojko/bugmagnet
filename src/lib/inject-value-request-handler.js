'use strict';
module.exports = function injectValueRequestHandler(browserInterface, tabId, requestValue) {
	return browserInterface.executeScript(tabId, '/inject-value.js')
		.then(() => browserInterface.sendMessage(tabId, requestValue));
};

