/* global chrome, BugMagnet, XMLHttpRequest */
var processConfig = function () {
		'use strict';
		var configText = this.responseText;
		BugMagnet.processConfigText(configText, new BugMagnet.ChromeMenuBuilder());
	},
	loadConfig = function () {
		'use strict';
		var xhr = new XMLHttpRequest();
		xhr.open('GET', chrome.extension.getURL('config.json'));
		xhr.onload = processConfig;
		xhr.send();
	};
loadConfig();
