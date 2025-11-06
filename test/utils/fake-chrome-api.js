/* global jasmine, window */
'use strict';
module.exports = function FakeChromeApi() {
	const instance = this,
		createEvent = function (eventName) {
			return jasmine.createSpyObj(eventName, ['addListener', 'removeListener']);
		};
	instance.runtime = {
		onMessage: createEvent('onMessage')
	};
	instance.contextMenus = jasmine.createSpyObj('chrome.contextMenus', ['create', 'removeAll']);
	instance.contextMenus.onClicked = createEvent('onClicked');
	instance.extension = jasmine.createSpyObj('chrome.extension', ['getURL']);
	instance.tabs = jasmine.createSpyObj('chrome.tabs', ['sendMessage', 'executeScript']);

	instance.storage = {
		onChanged: createEvent('onChanged')
	};
	instance.storage.sync = jasmine.createSpyObj('chrome.storage.sync', ['get']);
};
