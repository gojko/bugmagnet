const ChromeMenu = require('../chrome-menu'),
	ChromeMenuBuilder = require('../chrome-menu-builder'),
	configLoaders = {
		processConfigText: require('../process-config-text'),
		processMenuObject: require('../process-menu-object')
	};
new ChromeMenu(window.chrome, configLoaders, new ChromeMenuBuilder(window.chrome)).init();
