'use strict';
const copyToClipboard = require('./copy-request-handler');
module.exports = function pasteRequestHandler(browserInterface, tabId, request) {
	copyToClipboard(browserInterface, tabId, request);
	return browserInterface.executeScript(tabId, '/paste.js');
};
