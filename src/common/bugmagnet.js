/*global document*/
var BugMagnet = BugMagnet || {};
BugMagnet.processMenuObject = function (configObject, menuBuilder, parentMenu) {
	'use strict';
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
			BugMagnet.processMenuObject(value, menuBuilder, result);
		}
	});
};
BugMagnet.processConfigText = function (configText, menuBuilder, rootMenu) {
	'use strict';
	var config = JSON.parse(configText);
	rootMenu = rootMenu || menuBuilder.rootMenu('Bug Magnet');
	BugMagnet.processMenuObject(config, menuBuilder, rootMenu);
	return rootMenu;
};
BugMagnet.executeRequest = function (request) {
	'use strict';
	var type_flag = '_type',
		generators = {
				literal: function (request) {
					return request.value;
				},
				size: function (request) {
					var size = parseInt(request.size, 10),
							value = request.template;
					while (value.length < size) {
						value += request.template;
					}
					return value.substring(0, request.size);
				}
			},
			getValue = function (request) {
				if (!request) {
					return false;
				}
				var generator = generators[request[type_flag]];
				if (!generator) {
					return false;
				}
				return generator(request);
			},
			triggerEvents = function (element, eventArray) {
				var evt;
				eventArray.forEach(function (eventName) {
					evt = document.createEvent('HTMLEvents');
					evt.initEvent(eventName, true, false);
					element.dispatchEvent(evt);
				});
			},
			actualValue = getValue(request),
			domElement = document.activeElement;
	if (!domElement || !actualValue) {
		return;
	}
	while (domElement.contentDocument) {
		domElement = domElement.contentDocument.activeElement;
	}
	if (domElement.tagName === 'TEXTAREA' || domElement.tagName === 'INPUT') {
		domElement.value = actualValue;
		triggerEvents(domElement, ['input', 'change']);
	} else if (domElement.hasAttribute('contenteditable')) {
		domElement.innerText = actualValue;
	}
};
