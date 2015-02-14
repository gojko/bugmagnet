/* global chrome, window, BugMagnet */
(function () {
	'use strict';
	window.BugMagnet = window.BugMagnet || {};
	chrome.runtime.onMessage.addListener(function (request /*, sender, sendResponse */) {
		BugMagnet.executeRequest(request);
	});
})();
