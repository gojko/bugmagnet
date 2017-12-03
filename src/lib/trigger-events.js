module.exports = function triggerEvents(element, eventArray) {
	'use strict';
	eventArray.forEach((eventName) => {
		const evt = document.createEvent('HTMLEvents');
		evt.initEvent(eventName, true, false);
		element.dispatchEvent(evt);
	});
};

