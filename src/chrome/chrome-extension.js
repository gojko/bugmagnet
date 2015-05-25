/* global chrome, BugMagnet, XMLHttpRequest, window */
BugMagnet.initChromeMenu = function () {
	'use strict';
	var standardConfig,
			processConfig = function () {
				if (!standardConfig && this.responseText) {
					standardConfig = this.responseText;
				}
				BugMagnet.processConfigText(standardConfig, BugMagnet.menuBuilder, BugMagnet.rootMenu);
			},
			loadConfigFromInternalFile = function () {
				var xhr = new XMLHttpRequest();
				xhr.open('GET', chrome.extension.getURL('config.json'));
				xhr.onload = processConfig;
				xhr.send();
			},
			loadAdditionalMenus = function (additionalMenus) {
				if (additionalMenus && Array.isArray(additionalMenus) && additionalMenus.length) {
					additionalMenus.forEach(function (configItem) {
						var object = {};
						object[configItem.name] = configItem.config;
						BugMagnet.processMenuObject(object, BugMagnet.menuBuilder, BugMagnet.rootMenu);
					});
				}
			},
			loadConfigFromLocalSettings = function () {
				chrome.storage.sync.get({ additionalMenus: [] }, function (items) {
					if (items && items.additionalMenus) {
						loadAdditionalMenus(items.additionalMenus);
					}
				});
			};
	BugMagnet.menuBuilder = new BugMagnet.ChromeMenuBuilder();
	BugMagnet.rootMenu =  BugMagnet.menuBuilder.rootMenu('Bug Magnet');
	loadConfigFromInternalFile();
	loadConfigFromLocalSettings();
	chrome.storage.onChanged.addListener(function (changes, areaName) {
		if (areaName === 'sync' && changes.additionalMenus) {
			chrome.contextMenus.removeAll(function () {
				BugMagnet.rootMenu = BugMagnet.menuBuilder.rootMenu('Bug Magnet');
				processConfig();
				loadAdditionalMenus(changes.additionalMenus.newValue);
			});
		}
	});
};
if (!window.jasmine) {
	new BugMagnet.initChromeMenu();
}
