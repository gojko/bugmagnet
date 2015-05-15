/*global exports, require*/
/*jshint moz:true*/
const FirefoxMenuBuilder = function () {
	'use strict';
};
exports.FirefoxMenuBuilder = FirefoxMenuBuilder;

FirefoxMenuBuilder.prototype.rootMenu = function (title) {
	'use strict';
	var cm = require('sdk/context-menu'),
		data = require('sdk/self').data;
	return cm.Menu({
		label: title,
		image: data.url('magnet-16.png'),
		context: cm.PredicateContext(function (context) {
			return context.isEditable;
		}),
		items: []
	});
};

FirefoxMenuBuilder.prototype.subMenu = function (title, parentMenu) {
	'use strict';
	var cm = require('sdk/context-menu'),
			menu = cm.Menu({
				label: title,
				items: []
			});
	parentMenu.addItem(menu);
	return menu;
};

FirefoxMenuBuilder.prototype.menuItem = function (title, parentMenu, itemData) {
	'use strict';
	var cm = require('sdk/context-menu'),
		data = require('sdk/self').data,
		item;
	// Firefox Addon SDK only allows strings to be set as the Item Menu data
	// so we use JSON.stringify here, and then JSON.parse when sending the data
	// on to the common BugMagnet function in the content script caller
	if (typeof (itemData) === 'string') {
		itemData = JSON.stringify({ '_type': 'literal', value: itemData });
	} else {
		itemData = JSON.stringify(itemData);
	}
	item = cm.Item({
		label: title,
		data: itemData,
		contentScriptFile: data.url('context-element.js')
	});
	parentMenu.addItem(item);
	return item;
};
