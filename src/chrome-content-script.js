/* global chrome, BugMagnet */
chrome.runtime.onMessage.addListener(function (request /*, sender, sendResponse */) {
	'use strict';
	BugMagnet.executeRequest(request);
});
