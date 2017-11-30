/*global describe, it, expect, beforeEach, jasmine*/
const FakeChromeApi = require('./utils/fake-chrome-api'),
	ChromeMenuBuilder = require('../src/lib/chrome-menu-builder');
describe('BugMagnet.ChromeMenuBuilder', function () {
	'use strict';
	let underTest, chrome, index = 0, clickHandler;
	const lastMenu = function () {
		return chrome.contextMenus.create.calls.argsFor(0)[0];
	};
	beforeEach(function () {
		chrome = new FakeChromeApi();
		chrome.contextMenus.create.and.callFake(() => index++);
		underTest = new ChromeMenuBuilder(chrome);
		clickHandler = chrome.contextMenus.onClicked.addListener.calls.mostRecent().args[0];
	});
	describe('rootMenu', function () {
		it('creates a menu item without a parent', function () {
			underTest.rootMenu('test me');
			expect(chrome.contextMenus.create.calls.count()).toBe(1);
			const result = lastMenu();
			expect(result.contexts).toEqual(['editable']);
			expect(result.title).toBe('test me');
			expect(result.parentId).toBeFalsy();
			expect(result.onclick).toBeUndefined();
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
			expect(result.onclick).toBeUndefined();
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
		it('creates a clickable menu item without a click handler', function () {
			underTest.menuItem('test me', 'root', 'some value');
			expect(chrome.contextMenus.create.calls.count()).toBe(1);
			const result = lastMenu();
			expect(result.contexts).toEqual(['editable']);
			expect(result.title).toBe('test me');
			expect(result.parentId).toBe('root');
			expect(result.onclick).toBeUndefined();
		});
		it('passes the value to the click handler', function () {
			const onClick = jasmine.createSpy('click'),
				result = underTest.menuItem('test me', 'root', onClick, 'some value');

			clickHandler({menuItemId: result}, {id: 5});
			expect(onClick).toHaveBeenCalledWith(5, 'some value');
		});
		it('executes the click handler even without a value', function () {
			const onClick = jasmine.createSpy('click'),
				result = underTest.menuItem('test me', 'root', onClick);
			clickHandler({menuItemId: result}, {id: 5});
			expect(onClick).toHaveBeenCalledWith(5, undefined);
		});
	});
});

