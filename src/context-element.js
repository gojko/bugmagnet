/* global chrome, console */
(function(){
	'use strict';
	var clickedEl = null;

	document.addEventListener('contextmenu', function(event){
		clickedEl = event.target;
	}, true);

	chrome.runtime.onMessage.addListener(function(request /*, sender, sendResponse */) {
		if (!clickedEl) {
			return;
		}
		if(request.type === 'literal') {
			console.log('setting context value');
			clickedEl.value = request.value;
		}
	});
})();
