/* global jasmine, window */
module.exports = function FakeChromeApi() {
	'use strict';
	const self = this;
	self.runtime = {};
	self.runtime.onMessage = jasmine.createSpyObj('chrome.runtime.onMessage', ['addListener']);
	self.contextMenus = jasmine.createSpyObj('chrome.contextMenus', ['create', 'removeAll']);
	self.extension = jasmine.createSpyObj('chrome.extension', ['getURL']);
	self.tabs = jasmine.createSpyObj('chrome.tabs', ['sendMessage']);
	self.storage = {};
	self.storage.sync = jasmine.createSpyObj('chrome.storage.sync', ['get']);
	self.storage.onChanged = jasmine.createSpyObj('chrome.storage.onChanged', ['addListener']);
};
