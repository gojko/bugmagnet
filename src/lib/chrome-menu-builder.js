module.exports = function ChromeMenuBuilder(chrome) {
	'use strict';
	let itemValues = {};
	const self = this,
		falsyButNotEmpty = function (v) {
			return v === undefined || v === null;
		},
		toValue = function (itemMenuValue) {
			if (typeof (itemMenuValue) === 'string') {
				return { '_type': 'literal', 'value': itemMenuValue};
			}
			return itemMenuValue;
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
		const id = chrome.contextMenus.create({'title': title, 'parentId': parentMenu, 'contexts': ['editable'], onclick: clickHandler});
		itemValues[id] = value;
	};
	self.removeAll = function () {
		itemValues = {};
		return new Promise(resolve => chrome.contextMenus.removeAll(resolve));
	};
	chrome.contextMenus.onClicked.addListener((info, tab) => {
		const valueToInsert = toValue(info && info.menuItemId && itemValues[info.menuItemId]);
		if (falsyButNotEmpty(valueToInsert)) {
			return;
		};
		try {
			chrome.tabs.executeScript(tab.id, {file: '/content-script.js'}, function () {
				console.log('after execution');
				chrome.tabs.sendMessage(tab.id, valueToInsert);
			});
		} catch (e) {
			console.error(e);
		}
	});
};
