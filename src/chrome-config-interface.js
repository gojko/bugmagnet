module.exports = function ChromeConfigInterface(chrome) {
	'use strict';
	const self = this;
	self.saveOptions = function (additionalMenus) {
		chrome.storage.sync.set({
			'additionalMenus': additionalMenus
		});
	};
	self.loadOptions = function (callback) {
		chrome.storage.sync.get({
			additionalMenus: []
		}, function (items) {
			callback(items && items.additionalMenus);
		});
	};
};

