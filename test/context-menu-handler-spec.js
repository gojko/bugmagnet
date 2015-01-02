/*global describe, it, expect, chrome, beforeEach, afterEach */
describe('Context menu handler', function () {
	'use strict';
	var handler,
			testElements,
			template = '<input type="text" value="old text"/>' +
					'<textarea>old text area</textarea>' +
				  '<div contenteditable>old div</div>',
			input, textArea, contentEditable,
			triggerContextMenu = function (element) {
				var ev = document.createEvent('HTMLEvents');
				ev.initEvent('contextmenu', true, true);
				element.dispatchEvent(ev);
			};
	beforeEach(function () {
		handler = chrome.runtime.onMessage.addListener.calls.first().args[0];
		testElements = document.createElement('div');
		testElements.innerHTML = template;
		input = testElements.getElementsByTagName('input')[0];
		textArea = testElements.getElementsByTagName('textarea')[0];
		contentEditable = testElements.getElementsByTagName('div')[0];
		document.body.appendChild(testElements);
	});
	afterEach(function () {
		document.body.removeChild(testElements);
	});
	it('installs a handler for the chrome message listener to change the element under context menu', function () {
		expect(chrome.runtime.onMessage.addListener.calls.count()).toBe(1);
		expect(handler instanceof Function).toBeTruthy();
	});
	it('does not blow up if a message is passed before an element is actually clicked', function () {
		handler({'type': 'literal', 'value': 'xxx'});
	});
	it('sets the input text value if triggered on an input element', function () {
		triggerContextMenu(input);

	});
});
