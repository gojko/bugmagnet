const getRequestValue = require('./get-request-value');
module.exports = function pasteRequestHandler(browserInterface, tabId, request) {
	'use strict';
	const valueToPaste = getRequestValue(request);
	browserInterface.copyToClipboard(valueToPaste);
	return browserInterface.executeScript(tabId, '/paste.js');
};
