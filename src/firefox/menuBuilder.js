FirefoxMenuBuilder = function(cm, data) {

	var self = this;

	self.rootMenu = function (title) {
		return cm.Menu({
			label: title,
			image: data.url("magnet-16.png"),
			context: cm.PredicateContext(function(context){
				return context.isEditable;
			}),
			items: []
		});
	}

	self.subMenu = function(title, parentMenu) {
		var menu = cm.Menu({
			label: title,
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
			data: itemData,
			contentScriptFile: data.url("context-element.js")
		});
		parentMenu.addItem(item);
	}
};

exports.FirefoxMenuBuilder = FirefoxMenuBuilder;
