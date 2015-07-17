/* global jasmine, window */
(function () {
	'use strict';
	var FakeChromeApi = function () {
		var self = this;
		self.runtime = {};
		self.runtime.onMessage = jasmine.createSpyObj('chrome.runtime.onMessage', ['addListener']);
		self.contextMenus = jasmine.createSpyObj('chrome.contextMenus', ['create', 'removeAll']);
		self.extension = jasmine.createSpyObj('chrome.extension', ['getURL']);
		self.tabs = jasmine.createSpyObj('chrome.tabs', ['sendMessage']);
		self.storage = {};
		self.storage.sync = jasmine.createSpyObj('chrome.storage.sync', ['get']);
		self.storage.onChanged = jasmine.createSpyObj('chrome.storage.onChanged', ['addListener']);
	};
	window.chrome = new FakeChromeApi();
})();
