/* global jasmine, window */
(function() {
	'use strict';
	var FakeChromeApi = function () {
		var self = this;
		self.runtime = {};
		self.runtime.onMessage = jasmine.createSpyObj('chrome.runtime.onMessage', ['addListener']);
		self.contextMenus = jasmine.createSpyObj('chrome.contextMenus', ['create']);
		self.extension = jasmine.createSpyObj('chrome.extension', ['getURL']);
	};
	window.chrome = new FakeChromeApi();
})();
