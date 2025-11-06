import { copyRequestHandler } from './copy-request-handler.js';

export function pasteRequestHandler(browserInterface, tabId, request) {
	copyRequestHandler(browserInterface, tabId, request);
	return browserInterface.executeScript(tabId, '/paste.js');
}
