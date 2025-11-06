import { getRequestValue } from './get-request-value.js';
import { triggerEvents } from './trigger-events.js';

export function injectValueToActiveElement(request) {
	const actualValue = getRequestValue(request);
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
}
