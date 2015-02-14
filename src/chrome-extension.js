/* global chrome, BugMagnet, window, XMLHttpRequest */
(function () {
	'use strict';
	window.BugMagnet = window.BugMagnet || {};
	var processConfig = function () {
			var configText = this.responseText;
			BugMagnet.processConfigText(configText, new BugMagnet.ChromeMenuBuilder());
		},
		loadConfig = function () {
			var xhr = new XMLHttpRequest();
			xhr.open('GET', chrome.extension.getURL('config.json'));
			xhr.onload = processConfig;
			xhr.send();
		};
	loadConfig();
})();
