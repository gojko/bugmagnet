/*global chrome, document, BugMagnet */
var ChromeConfigInterface = function () {
	'use strict';
	var self = this;
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
document.addEventListener('DOMContentLoaded', function () {
	'use strict';
	BugMagnet.initConfigWidget(document.getElementById('main'), new ChromeConfigInterface());
});
