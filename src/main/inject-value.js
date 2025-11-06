import { injectValueToActiveElement } from '../lib/inject-value-to-active-element.js';

const listener = function (request /*, sender, sendResponse */) {
	injectValueToActiveElement(request);
	chrome.runtime.onMessage.removeListener(listener);
};
chrome.runtime.onMessage.addListener(listener);
