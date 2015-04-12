BugMagnet.processConfigText = function (configText, menuBuilder, customRoot) {
	'use strict';
	var processMenuObject = function (configObject, parentMenu) {
			var getTitle = function (key) {
					if (configObject instanceof Array) {
						return configObject[key];
					}
					return key;
				};
			if (!configObject) {
				return;
			}
			Object.keys(configObject).forEach(function (key) {
				var	value = configObject[key],
						title = getTitle(key),
						result;
				if (typeof (value) === 'string' || (typeof (value) === 'object' && value.hasOwnProperty('_type'))) {
					menuBuilder.menuItem(title, parentMenu, value);
				} else if (typeof (value) === 'object') {
					result = menuBuilder.subMenu(title, parentMenu);
					processMenuObject(value, result);
				}
			});
		},
		config, rootMenu;
	config = JSON.parse(configText);
	rootMenu = customRoot || menuBuilder.rootMenu('Bug Magnet');
	processMenuObject(config, rootMenu);
	return rootMenu;
};
