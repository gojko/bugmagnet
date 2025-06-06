/*global chrome, browser*/
const ContextMenu = require('../lib/context-menu'),
	ChromeMenuBuilder = require('../lib/chrome-menu-builder'),
	ChromeBrowserInterface = require('../lib/chrome-browser-interface'),
	processMenuObject = require('../lib/process-menu-object'),
	CredentialContextMenu = require('../lib/credential-context-menu'),
	CredentialManager = require('../lib/credential-manager'),
	standardConfig = require('../../template/config.json'),
	isFirefox = (typeof browser !== 'undefined'),
	browserInterface = new ChromeBrowserInterface(chrome);

function initMenus() {
	'use strict';
	new ContextMenu(
		standardConfig,
		browserInterface,
		new ChromeMenuBuilder(chrome),
		processMenuObject,
		!isFirefox
	).init();
	new CredentialContextMenu(browserInterface).init();
}

chrome.runtime.onInstalled.addListener(initMenus);
chrome.runtime.onStartup.addListener(initMenus);

initMenus();
chrome.runtime.onMessage.addListener(function (request) {
	'use strict';
	if (request && request.type === 'updatePassword') {
		const manager = new CredentialManager(browserInterface);
		manager.updatePassword(request.username, request.password);
	}
});
