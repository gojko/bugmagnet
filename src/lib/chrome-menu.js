module.exports = function ChromeMenu(chrome, configLoaders, menuBuilder) {
	'use strict';
	let standardConfig, rootMenu;
	const self = this,
		processConfig = function () {
			configLoaders.processConfigText(standardConfig, menuBuilder, rootMenu);
		},
		loadConfigFromInternalFile = function (callback) {
			const xhr = new XMLHttpRequest();
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
					const object = {};
					object[configItem.name] = configItem.config;
					configLoaders.processMenuObject(object, menuBuilder, rootMenu);
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
			const openOptions = function () {
				if (chrome.runtime.openOptionsPage) {
					chrome.runtime.openOptionsPage();
				} else {
					window.open(chrome.runtime.getURL('options.html'));
				}
			};
			menuBuilder.separator(rootMenu);
			menuBuilder.menuItem('Configure BugMagnet', rootMenu, false, openOptions);
		};
	self.init = function () {
		rootMenu =  menuBuilder.rootMenu('Bug Magnet');
		loadConfigFromInternalFile(function () {
			loadConfigFromLocalSettings(addGenericMenus);
		});
		chrome.storage.onChanged.addListener(function (changes, areaName) {
			if (areaName === 'sync' && changes.additionalMenus) {
				chrome.contextMenus.removeAll(function () {
					rootMenu = menuBuilder.rootMenu('Bug Magnet');
					processConfig();
					loadAdditionalMenus(changes.additionalMenus.newValue);
					addGenericMenus();
				});
			}
		});
	};
	self.getRootMenu = function () {
		return rootMenu;
	};
};

