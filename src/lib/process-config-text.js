const processMenuObject = require('./process-menu-object');
module.exports = function processConfigText(configText, menuBuilder, rootMenu) {
	'use strict';
	const config = JSON.parse(configText);
	rootMenu = rootMenu || menuBuilder.rootMenu('Bug Magnet');
	processMenuObject(config, menuBuilder, rootMenu);
	return rootMenu;
};

