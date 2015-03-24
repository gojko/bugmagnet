BugMagnet.FirefoxMenuBuilder = function(cm, data) {

	var self = this;
	// construct a new menu
	self.rootMenu = function (title) {
		return cm.Menu({
			label: title,
			context: cm.SelectorContext('editable'),
			items: []
		});
	}

	self.subMenu = function(title, parentMenu) {
		var menu = self.rootMenu(title);
		parentMenu.addItem(menu)
		return menu
	}

	// construct a new menu item
	self.menuItem = function (title, parentMenu, itemData) {
		if (typeof(itemData) === 'string') {
			itemData = { _type: 'literal', value: itemData };
		}
		var item = cm.Item({
			label: title,
			context: cm.SelectorContext('editable'),
			data: itemData,
			contentScriptFile: data.url("context-element.js")
		});
		parentMenu.addItem(item);
	}
};
