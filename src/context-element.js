/* global chrome */
(function(){
	'use strict';
	var generators = {
				literal: function (request) {
					return request.value;
				},
				size: function(request) {
					var size = parseInt(request.size, 10),
							value = request.template;
					while (value.length < size) {
						value += request.template;
					}
					return value.substring(0, request.size);
				}
			},
			getValue = function(request) {
				if (!request) {
					return false;
				}
				var generator = generators[request['_type']];
				if (!generator) {
					return false;
				}
				return generator(request);
			};
	chrome.runtime.onMessage.addListener(function(request /*, sender, sendResponse */) {
		var activeElement = document.activeElement, actualValue = getValue(request);
		if (!activeElement || !actualValue) {
			return;
		}
		while (activeElement.contentDocument) {
			activeElement = activeElement.contentDocument.activeElement;
		}
		if (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT') {
			activeElement.value = actualValue;
		}
		else if (activeElement.hasAttribute('contenteditable')) {
			activeElement.innerText = actualValue;
		}
	});
})();
