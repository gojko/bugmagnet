/*global describe, it, expect, beforeEach, afterEach, jasmine, document, BugMagnet */
describe('BugMagnet.executeRequest', function () {
	'use strict';
	var handler,
			testElements,
			template = '<input type="text" value="old text"/>' +
					'<textarea>old text area</textarea>' +
					'<div contenteditable>old div</div>' +
					'<span contenteditable>old span</span>' +
					'<iframe></iframe>',
			input, textArea, contentEditable, iframe, span;
	beforeEach(function () {
		handler = BugMagnet.executeRequest;
		testElements = document.createElement('div');
		testElements.innerHTML = template;
		input = testElements.getElementsByTagName('input')[0];
		textArea = testElements.getElementsByTagName('textarea')[0];
		contentEditable = testElements.getElementsByTagName('div')[0];
		span = testElements.getElementsByTagName('span')[0];
		document.body.appendChild(testElements);
		iframe = testElements.getElementsByTagName('iframe')[0];

	});
	afterEach(function () {
		document.body.removeChild(testElements);
	});
	it('does not blow up if a message is passed before an element is actually clicked', function () {
		handler({'_type': 'literal', 'value': 'xxx'});
	});
	it('sets the input text value if input element in focus', function () {
		input.focus();
		handler({'_type': 'literal', 'value': 'xyz'});

		expect(input.value).toBe('xyz');
	});
	it('dispatches change event on input', function () {
		var spy = jasmine.createSpy('change');
		input.focus();
		input.onchange = spy;
		handler({'_type': 'literal', 'value': 'xyz'});
		expect(spy).toHaveBeenCalled();
	});
	it('dispatches input event on input', function () {
		var spy = jasmine.createSpy('input');
		input.focus();
		input.onchange = spy;
		handler({'_type': 'literal', 'value': 'xyz'});
		expect(spy).toHaveBeenCalled();
	});
	it('sets the text area text value if text area in focus', function () {
		textArea.focus();
		handler({'_type': 'literal', 'value': 'xyz'});

		expect(textArea.value).toBe('xyz');
	});
	it('dispatches change event on textarea', function () {
		var spy = jasmine.createSpy('change');
		textArea.focus();
		textArea.onchange = spy;
		handler({'_type': 'literal', 'value': 'xyz'});
		expect(spy).toHaveBeenCalled();
	});
	it('dispatches input event on textarea', function () {
		var spy = jasmine.createSpy('input');
		textArea.focus();
		textArea.onchange = spy;
		handler({'_type': 'literal', 'value': 'xyz'});
		expect(spy).toHaveBeenCalled();
	});
	it('sets the contenteditable div inner text if a contenteditable div is in focus', function () {
		contentEditable.focus();
		handler({'_type': 'literal', 'value': 'xyz'});

		expect(contentEditable.innerText).toBe('xyz');
	});
	it('spans can also be contenteditable', function () {
		span.focus();
		handler({'_type': 'literal', 'value': 'xyz'});

		expect(span.innerText).toBe('xyz');
	});
	it('sets the value of an element inside an iframe if it is in focus', function () {
		iframe.contentDocument.body.innerHTML = template;
		var insideInput = iframe.contentDocument.getElementsByTagName('input')[0];
		iframe.focus(); /* make phantomjs think it's clicked */
		insideInput.focus();

		expect(document.activeElement).toBe(iframe);

		handler({'_type': 'literal', 'value': 'xyz'});
		expect(insideInput.value).toBe('xyz');
	});
	describe('size generator', function () {
		it('sets the field content to a text of specified size by multiplying the template', function () {
			input.focus();
			handler({ '_type': 'size', 'size': '20', 'template': '1234567' });
			expect(input.value).toBe('12345671234567123456');
		});
	});
});
