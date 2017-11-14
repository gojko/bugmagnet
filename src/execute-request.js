module.exports = function executeRequest(request) {
	'use strict';
	const type_flag = '_type',
		generators = {
			literal: function (request) {
				return request.value;
			},
			size: function (request) {
				const size = parseInt(request.size, 10);
				let value = request.template;
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
			const generator = generators[request[type_flag]];
			if (!generator) {
				return false;
			}
			return generator(request);
		},
		triggerEvents = function (element, eventArray) {
			eventArray.forEach((eventName) => {
				const evt = document.createEvent('HTMLEvents');
				evt.initEvent(eventName, true, false);
				element.dispatchEvent(evt);
			});
		},
		actualValue = getValue(request);
	let domElement = document.activeElement;
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
