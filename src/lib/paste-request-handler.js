const copyToClipboard = require('./copy-request-handler');
module.exports = function pasteRequestHandler(browserInterface, tabId, request) {
	'use strict';
	copyToClipboard(browserInterface, tabId, request);
	return browserInterface.executeScript(tabId, '/paste.js');
};
