BugMagnet.FirefoxMenuBuilder = function(cm, data) {

	var self = this;

	// which element selectors on which to enable Bug Magnet context menu
	// since Firefox Addon SDK doesn't have a generic 'editable' context like Chrome
	// Also, we specify the specific inputs since we don't want to trigger the menu
	// against non-text inputs
	var elements =  "input[type=text]," +
					"input[type=password]," +
					"input[type=email]," +
					"input[type=url]," +
					"input[type=search]," +
					"input[type=tel]," +
					"input[type=number]," +
					"textarea," +
					"*[contenteditable=true]";

	self.rootMenu = function (title) {
		return cm.Menu({
			label: title,
			image: data.url("magnet-16.png"),
			context: cm.SelectorContext(elements),
			items: []
		});
	}

	self.subMenu = function(title, parentMenu) {
		var menu = cm.Menu({
			label: title,
			context: cm.SelectorContext(elements),
			items: []
		});
		parentMenu.addItem(menu)
		return menu
	}

	self.menuItem = function (title, parentMenu, itemData) {
		// Firefox Addon SDK only allows strings to be set as the Item Menu data
		// so we use JSON.stringify here, and then JSON.parse when sending the data
		// on to the common BugMagnet function in the content script caller
		if (typeof(itemData) === 'string') {
			itemData = JSON.stringify({ _type: 'literal', value: itemData });
		} else {
			itemData = JSON.stringify(itemData);
		}
		var item = cm.Item({
			label: title,
			context: cm.SelectorContext(elements),
			data: itemData,
			contentScriptFile: data.url("context-element.js")
		});
		parentMenu.addItem(item);
	}
};
