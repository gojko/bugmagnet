/* global chrome, BugMagnet */
BugMagnet.ChromeMenuBuilder = function () {
	'use strict';
	var self = this,
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
	self.menuItem = function (title, parentMenu, value) {
		return chrome.contextMenus.create({'title': title, 'parentId': parentMenu, 'contexts': ['editable'], onclick: buildContentMessage(value)});
	};
};
