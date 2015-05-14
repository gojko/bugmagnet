/*global BugMagnet, describe, window, it, afterEach, beforeEach, jasmine, expect, chrome, spyOn*/
describe('BugMagnet.initChromeMenu', function () {
	'use strict';
	var oldHttpRequest, fakeHttpRequest;
	beforeEach(function () {
		oldHttpRequest = window.XMLHttpRequest;
		chrome.extension.getURL.and.returnValue('http://some-url');
		spyOn(BugMagnet, 'processConfigText');
		window.XMLHttpRequest = function () {
			var self = this;
			self.open = jasmine.createSpy('open');
			self.send = jasmine.createSpy('send');
			fakeHttpRequest = this;
		};
	});
	afterEach(function () {
		window.XMLHttpRequest = oldHttpRequest;
	});
	it('loads the standard config using xhr', function () {
		BugMagnet.initChromeMenu();

		expect(chrome.extension.getURL).toHaveBeenCalledWith('config.json');
		expect(fakeHttpRequest.open).toHaveBeenCalledWith('GET', 'http://some-url');
		expect(fakeHttpRequest.send).toHaveBeenCalled();
	});
	it('does not create the menu immediately', function () {
		BugMagnet.initChromeMenu();
		expect(BugMagnet.processConfigText).not.toHaveBeenCalled();
	});
	it('registers an onload handler that creates the menu', function () {
		BugMagnet.initChromeMenu();
		fakeHttpRequest.onload.apply({responseText: 'some-text'});
		expect(BugMagnet.processConfigText).toHaveBeenCalledWith('some-text', jasmine.any(BugMagnet.ChromeMenuBuilder));
	});
});
