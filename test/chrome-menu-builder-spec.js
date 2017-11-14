/*global describe, it, expect, beforeEach, jasmine*/
const FakeChromeApi = require('./utils/fake-chrome-api'),
	ChromeMenuBuilder = require('../src/chrome-menu-builder');
describe('BugMagnet.ChromeMenuBuilder', function () {
	'use strict';
	let underTest, chrome;
	const lastMenu = function () {
		return chrome.contextMenus.create.calls.argsFor(0)[0];
	};
	beforeEach(function () {
		chrome = new FakeChromeApi();
		underTest = new ChromeMenuBuilder(chrome);
	});
	describe('rootMenu', function () {
		it('creates a menu item without a parent', function () {
			underTest.rootMenu('test me');
			expect(chrome.contextMenus.create.calls.count()).toBe(1);
			const result = lastMenu();
			expect(result.contexts).toEqual(['editable']);
			expect(result.title).toBe('test me');
			expect(result.parentId).toBeFalsy();
			expect(result.onclick).toBeFalsy();
		});
	});
	describe('subMenu', function () {
		it('creates a menu item with a parent', function () {
			underTest.subMenu('test me', 'root');
			expect(chrome.contextMenus.create.calls.count()).toBe(1);
			const result = lastMenu();
			expect(result.contexts).toEqual(['editable']);
			expect(result.title).toBe('test me');
			expect(result.parentId).toBe('root');
			expect(result.onclick).toBeFalsy();
		});
	});
	describe('separator', function () {
		it('creates a separator under a parent', function () {
			underTest.separator('root');
			expect(chrome.contextMenus.create.calls.count()).toBe(1);
			const result = lastMenu();
			expect(result.contexts).toEqual(['editable']);
			expect(result.parentId).toBe('root');
			expect(result.type).toBe('separator');
		});
	});
	describe('menuItem', function () {
		it('creates a clickable menu item with a parent', function () {
			underTest.menuItem('test me', 'root', 'some value');
			expect(chrome.contextMenus.create.calls.count()).toBe(1);
			const result = lastMenu();
			expect(result.contexts).toEqual(['editable']);
			expect(result.title).toBe('test me');
			expect(result.parentId).toBe('root');
			expect(result.onclick instanceof Function).toBeTruthy();
		});
		it('connects a chrome.tabs.sendMessage call to click with a simple string', function () {
			underTest.menuItem('test me', 'root', 'some value');
			const result = lastMenu();

			result.onclick({}, {id: 5});
			expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(5, {'_type': 'literal', value: 'some value'});
		});
		it('connects a chrome.tabs.sendMessage call to click with a hash object string', function () {
			underTest.menuItem('test me', 'root', {'_type': 'size', value: 'some value'});
			const result = lastMenu();
			result.onclick({}, {id: 5});
			expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(5, {'_type': 'size', value: 'some value'});
		});
		it('attaches a custom click handler if provided', function () {
			const spy = jasmine.createSpy('click');
			underTest.menuItem('test me', 'root', 'some value', spy);
			lastMenu().onclick({}, {id: 5});
			expect(chrome.tabs.sendMessage).not.toHaveBeenCalledWith();
			expect(spy).toHaveBeenCalled();
		});
	});
});

