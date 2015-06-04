/*global BugMagnet, describe, window, it, afterEach, beforeEach, jasmine, expect, chrome, spyOn*/
describe('BugMagnet.initChromeMenu', function () {
	'use strict';
	var oldHttpRequest, fakeHttpRequest, fakeRoot;
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
		fakeRoot = {fake: 'root'};
		chrome.contextMenus.create.calls.reset();
		chrome.contextMenus.create.and.returnValue(fakeRoot);
		chrome.storage.sync.get.calls.reset();
		chrome.storage.onChanged.addListener.calls.reset();
	});
	afterEach(function () {
		window.XMLHttpRequest = oldHttpRequest;
	});
	it('creates a root menu and the menu builder', function () {
		BugMagnet.initChromeMenu();
		expect(chrome.contextMenus.create.calls.count()).toBe(1);
		expect(BugMagnet.rootMenu).toBe(fakeRoot);
	});
	describe('standard config', function () {
		it('loads the standard config using xhr', function () {
			BugMagnet.initChromeMenu();

			expect(chrome.extension.getURL).toHaveBeenCalledWith('config.json');
			expect(fakeHttpRequest.open).toHaveBeenCalledWith('GET', 'http://some-url');
			expect(fakeHttpRequest.send).toHaveBeenCalled();
		});
		it('does not load the config text immediately', function () {
			BugMagnet.initChromeMenu();
			expect(BugMagnet.processConfigText).not.toHaveBeenCalled();
		});
		it('registers an onload handler that creates the menu', function () {
			BugMagnet.initChromeMenu();
			fakeHttpRequest.onload.apply({responseText: 'some-text'});
			expect(BugMagnet.processConfigText).toHaveBeenCalledWith('some-text', jasmine.any(BugMagnet.ChromeMenuBuilder), fakeRoot);
		});
	});
	describe('additional config', function () {
		beforeEach(function () {
			spyOn(BugMagnet, 'processMenuObject');
			fakeHttpRequest.onload.apply({responseText: 'some-text'});
		});
		it('asks the chrome.storage.sync api for additional config items', function () {
			BugMagnet.initChromeMenu();
			expect(chrome.storage.sync.get).toHaveBeenCalledWith({additionalMenus: []}, jasmine.any(Function));
		});
		it('loads additional items from the config and name property of each array element', function () {
			BugMagnet.initChromeMenu();
			var callback = chrome.storage.sync.get.calls.argsFor(0)[1];
			callback({additionalMenus: [{name: 'additional 1', config: {first: 'yes'}}, {name: 'additional 2', config: {second: 'yes'}}]});
			expect(BugMagnet.processMenuObject.calls.count()).toBe(2);
			expect(BugMagnet.processMenuObject.calls.argsFor(0)[0]).toEqual({'additional 1': {first: 'yes'}});
			expect(BugMagnet.processMenuObject.calls.argsFor(1)[0]).toEqual({'additional 2': {second: 'yes'}});
		});
		it('does nothing if chrome.storage.sync api does not have any additional config', function () {
			BugMagnet.initChromeMenu();
			var callback = chrome.storage.sync.get.calls.argsFor(0)[1];
			callback(false);
			expect(BugMagnet.processMenuObject).not.toHaveBeenCalled();
		});
		it('does nothing if chrome.storage.sync api has an empty array', function () {
			BugMagnet.initChromeMenu();
			var callback = chrome.storage.sync.get.calls.argsFor(0)[1];
			callback([]);
			expect(BugMagnet.processMenuObject).not.toHaveBeenCalled();
		});
	});
	describe('sync storage listener', function () {
		var newFakeRoot = {newRoot: 'root'},
				underTest;
		beforeEach(function () {
			spyOn(BugMagnet, 'processMenuObject');
			BugMagnet.initChromeMenu();
			fakeHttpRequest.onload.apply({responseText: 'some-text'});
			chrome.contextMenus.create.calls.reset();
			chrome.contextMenus.removeAll.calls.reset();
			chrome.contextMenus.create.and.returnValue(newFakeRoot);
			fakeHttpRequest.send.calls.reset();
			underTest = chrome.storage.onChanged.addListener.calls.argsFor(0)[0];

		});
		it('clears all menu items', function () {
			underTest({additionalMenus: [{name: 'a', config: {'b': 'c'}}]}, 'sync');
			expect(chrome.contextMenus.removeAll).toHaveBeenCalled();
		});
		describe('after menu was cleared', function () {
			beforeEach(function () {
				underTest({additionalMenus: {newValue: [{name: 'a', config: {'b': 'c'}}]}}, 'sync');
				chrome.contextMenus.removeAll.calls.argsFor(0)[0]();
			});
			it('creates a new root menu', function () {
				expect(BugMagnet.rootMenu).toBe(newFakeRoot);
			});
			it('reloads menus from cached standard config response', function () {
				expect(fakeHttpRequest.send).not.toHaveBeenCalled();
				expect(BugMagnet.processConfigText).toHaveBeenCalledWith('some-text', jasmine.any(BugMagnet.ChromeMenuBuilder), newFakeRoot);
			});
			it('appends any elements from the additionalMenus.newValue object', function () {
				expect(BugMagnet.processMenuObject.calls.count()).toBe(1);
				expect(BugMagnet.processMenuObject.calls.first().args[0]).toEqual({'a': {'b': 'c'}});
			});
		});
		it('ignores changes that are not for the sync storage area', function () {
			underTest({additionalMenus: [{name: 'a', config: {'b': 'c'}}]}, 'local');
			expect(chrome.contextMenus.removeAll).not.toHaveBeenCalled();
			expect(BugMagnet.rootMenu).toBe(fakeRoot);
		});
		it('ignores changes that are not for the additionalMenus object', function () {
			underTest({version: 2}, 'sync');
			expect(chrome.contextMenus.removeAll).not.toHaveBeenCalled();
			expect(BugMagnet.rootMenu).toBe(fakeRoot);
		});
	});
});
