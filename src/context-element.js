/* global chrome */
(function(){
	'use strict';
	chrome.runtime.onMessage.addListener(function(request /*, sender, sendResponse */) {
		var activeElement = document.activeElement;
		if (!activeElement) {
			return;
		}
		while (activeElement.contentDocument) {
			activeElement = activeElement.contentDocument.activeElement;
		}
		if(request['_type'] === 'literal') {
			if (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT') {
				activeElement.value = request.value;
			}
			else if (activeElement.tagName === 'DIV' && activeElement.hasAttribute('contenteditable')) {
				activeElement.innerText = request.value;
			}
		}
	});
})();
