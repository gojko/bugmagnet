/*global chrome*/
const ChromeMenu = require('../lib/chrome-menu'),
	ChromeMenuBuilder = require('../lib/chrome-menu-builder'),
	configLoaders = {
		processConfigText: require('../lib/process-config-text'),
		processMenuObject: require('../lib/process-menu-object')
	};
new ChromeMenu(chrome, configLoaders, new ChromeMenuBuilder(chrome)).init();
