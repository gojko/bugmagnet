module.exports = function ChromeMenu(standardConfig, browserInterface, menuBuilder, processMenuObject) {
	'use strict';
	const self = this,
		/*loadConfigFromInternalFile = function (callback) {
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
		},*/
		loadAdditionalMenus = function (additionalMenus, rootMenu) {
			if (additionalMenus && Array.isArray(additionalMenus) && additionalMenus.length) {
				additionalMenus.forEach(function (configItem) {
					const object = {};
					object[configItem.name] = configItem.config;
					processMenuObject(object, menuBuilder, rootMenu);
				});
			}
		},
		addGenericMenus = function (rootMenu) {
			menuBuilder.separator(rootMenu);
			menuBuilder.menuItem('Configure BugMagnet', rootMenu, false, browserInterface.openSettings);
		},
		rebuildMenu = function (additionalMenus) {
			const rootMenu =  menuBuilder.rootMenu('Bug Magnet');
			processMenuObject(standardConfig, menuBuilder, rootMenu);
			if (additionalMenus) {
				loadAdditionalMenus(additionalMenus, rootMenu);
			}
			addGenericMenus(rootMenu);
		},
		wireStorageListener = function () {
			browserInterface.addStorageListener(function (changes) {
				if (changes.additionalMenus) {
					return menuBuilder.removeAll().then(() => rebuildMenu(changes.additionalMenus.newValue));
				}
				return Promise.resolve();
			});
		};
	self.init = function () {
		return browserInterface.getOptionsAsync()
			.then(options => rebuildMenu(options && options.additionalMenus))
			.then(wireStorageListener);
	};
};

