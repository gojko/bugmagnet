/* global chrome, BugMagnet, XMLHttpRequest, window */
BugMagnet.initChromeMenu = function () {
	'use strict';
	var standardConfig,
			processConfig = function () {
				BugMagnet.processConfigText(standardConfig, BugMagnet.menuBuilder, BugMagnet.rootMenu);
			},
			loadConfigFromInternalFile = function (callback) {
				var xhr = new XMLHttpRequest();
				xhr.open('GET', chrome.extension.getURL('config.json'));
				xhr.onload = function () {
					if (!standardConfig && this.responseText) {
						standardConfig = this.responseText;
					}
					processConfig();
					callback();
				};
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
			loadConfigFromLocalSettings = function (callback) {
				chrome.storage.sync.get({ additionalMenus: [] }, function (items) {
					if (items && items.additionalMenus) {
						loadAdditionalMenus(items.additionalMenus);
					}
					callback();
				});
			},
			addGenericMenus = function () {
				var openOptions = function () {
					if (chrome.runtime.openOptionsPage) {
						chrome.runtime.openOptionsPage();
					} else {
						window.open(chrome.runtime.getURL('options.html'));
					}
				};
				BugMagnet.menuBuilder.separator(BugMagnet.rootMenu);
				BugMagnet.menuBuilder.menuItem('Configure BugMagnet', BugMagnet.rootMenu, false, openOptions);
			};
	BugMagnet.menuBuilder = new BugMagnet.ChromeMenuBuilder();
	BugMagnet.rootMenu =  BugMagnet.menuBuilder.rootMenu('Bug Magnet');
	loadConfigFromInternalFile(function () {
		loadConfigFromLocalSettings(addGenericMenus);
	});
	chrome.storage.onChanged.addListener(function (changes, areaName) {
		if (areaName === 'sync' && changes.additionalMenus) {
			chrome.contextMenus.removeAll(function () {
				BugMagnet.rootMenu = BugMagnet.menuBuilder.rootMenu('Bug Magnet');
				processConfig();
				loadAdditionalMenus(changes.additionalMenus.newValue);
				addGenericMenus();
			});
		}
	});
};
if (!window.jasmine) {
	new BugMagnet.initChromeMenu();
}
