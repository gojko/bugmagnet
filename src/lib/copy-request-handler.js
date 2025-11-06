'use strict';
const getRequestValue = require('./get-request-value');
module.exports = function pasteRequestHandler(browserInterface, tabId, request) {
	browserInterface.copyToClipboard(getRequestValue(request));
};
