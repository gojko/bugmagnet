export function processMenuObject(configObject, menuBuilder, parentMenu, onClick) {
	const getTitle = function (key) {
		if (configObject instanceof Array) {
			return configObject[key];
		}
		return key;
	};
	if (!configObject) {
		return;
	}
	Object.keys(configObject).forEach((key) => {
		const value = configObject[key],
			title = getTitle(key);
		let result;
		if (typeof (value) === 'string' || (typeof (value) === 'object' && Object.prototype.hasOwnProperty.call(value, '_type'))) {
			menuBuilder.menuItem(title, parentMenu, onClick, value);
		} else if (typeof (value) === 'object') {
			result = menuBuilder.subMenu(title, parentMenu);
			processMenuObject(value, menuBuilder, result, onClick);
		}
	});
}

