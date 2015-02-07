/* global chrome, document */
(function () {
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
			};
	chrome.runtime.onMessage.addListener(function (request /*, sender, sendResponse */) {
		var activeElement = document.activeElement, actualValue = getValue(request);
		if (!activeElement || !actualValue) {
			return;
		}
		while (activeElement.contentDocument) {
			activeElement = activeElement.contentDocument.activeElement;
		}
		if (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT') {
			activeElement.value = actualValue;
			triggerEvents(activeElement, ['input', 'change']);
		} else if (activeElement.hasAttribute('contenteditable')) {
			activeElement.innerText = actualValue;
		}
	});
})();
