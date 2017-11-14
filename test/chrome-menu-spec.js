/*global describe, window, it, afterEach, beforeEach, jasmine, expect*/
const FakeChromeApi = require('./utils/fake-chrome-api.js'),
	ChromeMenu = require('../src/chrome-menu');
describe('ChromeMenu', function () {
	'use strict';
	let oldHttpRequest, fakeHttpRequest, fakeRoot, chrome, underTest, configLoaders, chromeMenuBuilder;
	beforeEach(function () {
		chrome = new FakeChromeApi();
		oldHttpRequest = window.XMLHttpRequest;
		chrome.extension.getURL.and.returnValue('http://some-url');
		window.XMLHttpRequest = function () {
			const self = this;
			self.open = jasmine.createSpy('open');
			self.send = jasmine.createSpy('send');
			fakeHttpRequest = this;
		};
		fakeRoot = {fake: 'root'};
		chrome.storage.sync.get.calls.reset();
		chrome.storage.onChanged.addListener.calls.reset();

		configLoaders = jasmine.createSpyObj('configLoaders', ['processConfigText', 'processMenuObject']);
		chromeMenuBuilder = jasmine.createSpyObj('menuBuilder', ['rootMenu', 'separator', 'menuItem']);
		chromeMenuBuilder.rootMenu.and.returnValue(fakeRoot);
		underTest = new ChromeMenu(chrome, configLoaders, chromeMenuBuilder);
	});
	afterEach(function () {
		window.XMLHttpRequest = oldHttpRequest;
	});
	it('creates a root menu using the menu builder', function () {
		underTest.init();
		expect(underTest.getRootMenu()).toBe(fakeRoot);
	});
	describe('standard config', function () {
		it('loads the standard config using xhr', function () {
			underTest.init();
			expect(chrome.extension.getURL).toHaveBeenCalledWith('config.json');
			expect(fakeHttpRequest.open).toHaveBeenCalledWith('GET', 'http://some-url');
			expect(fakeHttpRequest.send).toHaveBeenCalled();
		});
		it('does not load the config text immediately', function () {
			underTest.init();
			expect(configLoaders.processConfigText).not.toHaveBeenCalled();
		});
		it('registers an onload handler that creates the menu', function () {
			underTest.init();
			fakeHttpRequest.onload.apply({responseText: 'some-text'});
			expect(configLoaders.processConfigText).toHaveBeenCalledWith('some-text', chromeMenuBuilder, fakeRoot);
		});
	});
	describe('additional config', function () {
		let callback;
		beforeEach(function () {
			underTest.init();
			fakeHttpRequest.onload.apply({responseText: 'some-text'});
			callback = chrome.storage.sync.get.calls.argsFor(0)[1];
		});
		it('asks the chrome.storage.sync api for additional config items', function () {
			expect(chrome.storage.sync.get).toHaveBeenCalledWith({additionalMenus: []}, jasmine.any(Function));
		});
		it('loads additional items from the config and name property of each array element', function () {
			callback({additionalMenus: [{name: 'additional 1', config: {first: 'yes'}}, {name: 'additional 2', config: {second: 'yes'}}]});
			expect(configLoaders.processMenuObject.calls.count()).toBe(2);
			expect(configLoaders.processMenuObject.calls.argsFor(0)[0]).toEqual({'additional 1': {first: 'yes'}});
			expect(configLoaders.processMenuObject.calls.argsFor(1)[0]).toEqual({'additional 2': {second: 'yes'}});
		});
		it('does nothing if chrome.storage.sync api does not have any additional config', function () {
			callback(false);
			expect(configLoaders.processMenuObject).not.toHaveBeenCalled();
		});
		it('does nothing if chrome.storage.sync api has an empty array', function () {
			callback([]);
			expect(configLoaders.processMenuObject).not.toHaveBeenCalled();
		});
	});
	describe('sync storage listener', function () {
		const newFakeRoot = {newRoot: 'root'};
		let listener;
		beforeEach(function () {
			underTest.init();
			fakeHttpRequest.onload.apply({responseText: 'some-text'});
			chrome.contextMenus.create.calls.reset();
			chrome.contextMenus.removeAll.calls.reset();
			chromeMenuBuilder.rootMenu.and.returnValue(newFakeRoot);
			fakeHttpRequest.send.calls.reset();
			listener = chrome.storage.onChanged.addListener.calls.argsFor(0)[0];
		});
		it('clears all menu items', function () {
			listener({additionalMenus: [{name: 'a', config: {'b': 'c'}}]}, 'sync');
			expect(chrome.contextMenus.removeAll).toHaveBeenCalled();
		});
		describe('after menu was cleared', function () {
			beforeEach(function () {
				listener({additionalMenus: {newValue: [{name: 'a', config: {'b': 'c'}}]}}, 'sync');
				chrome.contextMenus.removeAll.calls.argsFor(0)[0]();
			});
			it('creates a new root menu', function () {
				expect(underTest.getRootMenu()).toBe(newFakeRoot);
			});
			it('reloads menus from cached standard config response', function () {
				expect(fakeHttpRequest.send).not.toHaveBeenCalled();
				expect(configLoaders.processConfigText).toHaveBeenCalledWith('some-text', chromeMenuBuilder, newFakeRoot);
			});
			it('appends any elements from the additionalMenus.newValue object', function () {
				expect(configLoaders.processMenuObject.calls.count()).toBe(1);
				expect(configLoaders.processMenuObject.calls.first().args[0]).toEqual({'a': {'b': 'c'}});
			});
		});
		it('ignores changes that are not for the sync storage area', function () {
			listener({additionalMenus: [{name: 'a', config: {'b': 'c'}}]}, 'local');
			expect(chrome.contextMenus.removeAll).not.toHaveBeenCalled();
			expect(underTest.getRootMenu()).toBe(fakeRoot);
		});
		it('ignores changes that are not for the additionalMenus object', function () {
			listener({version: 2}, 'sync');
			expect(chrome.contextMenus.removeAll).not.toHaveBeenCalled();
			expect(underTest.getRootMenu()).toBe(fakeRoot);
		});
	});
});
