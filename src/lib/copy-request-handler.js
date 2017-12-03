const getRequestValue = require('./get-request-value');
module.exports = function pasteRequestHandler(browserInterface, tabId, request) {
	'use strict';
	browserInterface.copyToClipboard(getRequestValue(request));
};
