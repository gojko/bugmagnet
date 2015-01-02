/* global chrome */
(function () {
	'use strict';
	var rootMenu,
	buildContentMessage = function (textToInsert){
		return function (info, tab) {
			chrome.tabs.sendMessage(tab.id, {type:'literal', value: textToInsert});
		};
	},
	processMenuObject = function (parentMenuId, configObject) {
		var getTitle = function (key) {
			if (configObject instanceof Array) {
				return configObject[key];
			}
			return key;
		};
		Object.keys(configObject).forEach(function(key) {
			var	value = configObject[key],
			options = {'title': getTitle(key), 'parentId': parentMenuId, 'contexts':['editable']};
			if (typeof(value) === 'object') {
				var resultId = chrome.contextMenus.create(options);
				processMenuObject(resultId, value);
			}
			else {
				options.onclick = buildContentMessage(value);
				chrome.contextMenus.create(options);
			}
			});
		},
		processConfig = function () {
			var configText = this.responseText,
			config = JSON.parse(configText);
			processMenuObject(rootMenu, config);
		},
		loadConfig = function () {
			var xhr = new XMLHttpRequest();
			xhr.open('GET', chrome.extension.getURL('config.json'));
			xhr.onload = processConfig;
			xhr.send();
		};
	rootMenu = chrome.contextMenus.create({'title': 'Bug Magnet', 'contexts': ['editable']});
	loadConfig();
})();
