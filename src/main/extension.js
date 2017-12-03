/*global chrome, browser*/
const ContextMenu = require('../lib/context-menu'),
	ChromeMenuBuilder = require('../lib/chrome-menu-builder'),
	ChromeBrowserInterface = require('../lib/chrome-browser-interface'),
	processMenuObject = require('../lib/process-menu-object'),
	standardConfig = require('../../template/config.json'),
	isFirefox = (typeof browser !== 'undefined');
new ContextMenu(
	standardConfig,
	new ChromeBrowserInterface(chrome),
	new ChromeMenuBuilder(chrome),
	processMenuObject,
	!isFirefox
).init();

