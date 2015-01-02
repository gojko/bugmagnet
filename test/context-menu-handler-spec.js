/*global describe, it, expect, chrome, beforeEach, afterEach */
describe('Context menu handler', function () {
	'use strict';
	var handler,
			testElements,
			template = '<input type="text" value="old text"/>' +
					'<textarea>old text area</textarea>' +
				  '<div contenteditable>old div</div>' +
					'<iframe></iframe>',
			input, textArea, contentEditable, iframe;
	beforeEach(function () {
		handler = chrome.runtime.onMessage.addListener.calls.first().args[0];
		testElements = document.createElement('div');
		testElements.innerHTML = template;
		input = testElements.getElementsByTagName('input')[0];
		textArea = testElements.getElementsByTagName('textarea')[0];
		contentEditable = testElements.getElementsByTagName('div')[0];
		document.body.appendChild(testElements);
		iframe = testElements.getElementsByTagName('iframe')[0];

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
	it('sets the input text value if input element in focus', function () {
		input.focus();
		handler({'type': 'literal', 'value': 'xyz'});

		expect(input.value).toBe('xyz');
	});
	it('sets the text area text value if text area in focus', function () {
		textArea.focus();
		handler({'type': 'literal', 'value': 'xyz'});

		expect(textArea.value).toBe('xyz');
	});
	it('sets the contenteditable div inner text if a contenteditable div is in focus', function () {
		contentEditable.focus();
		handler({'type': 'literal', 'value': 'xyz'});

		expect(contentEditable.innerText).toBe('xyz');
	});
	it('sets the value of an element inside an iframe if it is in focus', function () {
		iframe.contentDocument.body.innerHTML = template;
		var insideInput = iframe.contentDocument.getElementsByTagName('input')[0];
		iframe.focus(); /* make phantomjs think it's clicked */
		insideInput.focus();

		expect(document.activeElement).toBe(iframe);

		handler({'type': 'literal', 'value': 'xyz'});
		expect(insideInput.value).toBe('xyz');
	});
});
