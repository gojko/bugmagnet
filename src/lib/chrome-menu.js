module.exports = function ChromeMenu(standardConfig, browserInterface, menuBuilder, processMenuObject) {
	'use strict';
	const self = this,
		onClick = function (tabId, itemMenuValue) {
			const falsyButNotEmpty = function (v) {
					return !v && typeof (v) !== 'string';
				},
				toValue = function (itemMenuValue) {
					if (typeof (itemMenuValue) === 'string') {
						return { '_type': 'literal', 'value': itemMenuValue};
					}
					return itemMenuValue;
				},
				valueToInsert = toValue(itemMenuValue);
			if (falsyButNotEmpty(valueToInsert)) {
				return;
			};
			return browserInterface.executeScript(tabId, '/content-script.js')
				.then(() => browserInterface.sendMessage(tabId, valueToInsert));
		},
		loadAdditionalMenus = function (additionalMenus, rootMenu) {
			if (additionalMenus && Array.isArray(additionalMenus) && additionalMenus.length) {
				additionalMenus.forEach(function (configItem) {
					const object = {};
					object[configItem.name] = configItem.config;
					processMenuObject(object, menuBuilder, rootMenu, onClick);
				});
			}
		},
		addGenericMenus = function (rootMenu) {
			menuBuilder.separator(rootMenu);
			menuBuilder.menuItem('Configure BugMagnet', rootMenu, browserInterface.openSettings);
		},
		rebuildMenu = function (additionalMenus) {
			const rootMenu =  menuBuilder.rootMenu('Bug Magnet');
			processMenuObject(standardConfig, menuBuilder, rootMenu, onClick);
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

