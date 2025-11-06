export function triggerEvents(element, eventArray) {
	eventArray.forEach((eventName) => {
		const evt = document.createEvent('HTMLEvents');
		evt.initEvent(eventName, true, false);
		element.dispatchEvent(evt);
	});
}

