module.exports = function ChromeMenuBuilder(chrome) {
	'use strict';
	const self = this,
		buildContentMessage = function (menuValue) {
			if (typeof (menuValue) === 'string') {
				menuValue = { '_type': 'literal', 'value': menuValue};
			}
			return function (info, tab) {
				chrome.tabs.sendMessage(tab.id, menuValue);
			};
		};
	self.rootMenu = function (title) {
		return chrome.contextMenus.create({'title': title, 'contexts': ['editable']});
	};
	self.subMenu = function (title, parentMenu) {
		return chrome.contextMenus.create({'title': title, 'parentId': parentMenu, 'contexts': ['editable']});
	};
	self.separator = function (parentMenu) {
		return chrome.contextMenus.create({'type': 'separator', 'parentId': parentMenu, 'contexts': ['editable']});
	};
	self.menuItem = function (title, parentMenu, value, clickHandler) {
		return chrome.contextMenus.create({'title': title, 'parentId': parentMenu, 'contexts': ['editable'], onclick: clickHandler || buildContentMessage(value)});
	};
	self.removeAll = function () {
		return new Promise(resolve => chrome.contextMenus.removeAll(resolve));
	};
};
