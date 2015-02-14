/* global chrome, document, window, BugMagnet */
window.BugMagnet = window.BugMagnet || {};
(function () {
	'use strict';
	chrome.runtime.onMessage.addListener(function (request /*, sender, sendResponse */) {
		var activeElement = document.activeElement;
		BugMagnet.executeRequestOnElement(activeElement, request);
	});
})();
