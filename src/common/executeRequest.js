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
