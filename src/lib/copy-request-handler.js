import { getRequestValue } from './get-request-value.js';

export function copyRequestHandler(browserInterface, tabId, request) {
	browserInterface.copyToClipboard(getRequestValue(request));
}
