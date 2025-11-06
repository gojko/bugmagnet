/*global describe, it, expect, beforeEach, jasmine*/
'use strict';
const FakeChromeApi = require('./utils/fake-chrome-api'),
	ChromeMenuBuilder = require('../src/lib/chrome-menu-builder');
describe('BugMagnet.ChromeMenuBuilder', () => {
	let underTest, chrome, index = 0, clickHandler;
	const lastMenu = function () {
		return chrome.contextMenus.create.calls.argsFor(0)[0];
	};
	beforeEach(() => {
		chrome = new FakeChromeApi();
		chrome.contextMenus.create.and.callFake(() => index++);
		underTest = new ChromeMenuBuilder(chrome);
		clickHandler = chrome.contextMenus.onClicked.addListener.calls.mostRecent().args[0];
	});
	describe('rootMenu', () => {
		it('creates a menu item without a parent', () => {
			underTest.rootMenu('test me');
			expect(chrome.contextMenus.create.calls.count()).toBe(1);
			const result = lastMenu();
			expect(result.contexts).toEqual(['editable']);
			expect(result.title).toBe('test me');
			expect(result.parentId).toBeFalsy();
			expect(result.onclick).toBeUndefined();
		});
	});
	describe('subMenu', () => {
		it('creates a menu item with a parent', () => {
			underTest.subMenu('test me', 'root');
			expect(chrome.contextMenus.create.calls.count()).toBe(1);
			const result = lastMenu();
			expect(result.contexts).toEqual(['editable']);
			expect(result.title).toBe('test me');
			expect(result.parentId).toBe('root');
			expect(result.onclick).toBeUndefined();
		});
	});
	describe('separator', () => {
		it('creates a separator under a parent', () => {
			underTest.separator('root');
			expect(chrome.contextMenus.create.calls.count()).toBe(1);
			const result = lastMenu();
			expect(result.contexts).toEqual(['editable']);
			expect(result.parentId).toBe('root');
			expect(result.type).toBe('separator');
		});
	});
	describe('menuItem', () => {
		it('creates a clickable menu item without a click handler', () => {
			underTest.menuItem('test me', 'root', 'some value');
			expect(chrome.contextMenus.create.calls.count()).toBe(1);
			const result = lastMenu();
			expect(result.contexts).toEqual(['editable']);
			expect(result.title).toBe('test me');
			expect(result.parentId).toBe('root');
			expect(result.onclick).toBeUndefined();
		});
		it('passes the value to the click handler', () => {
			const onClick = jasmine.createSpy('click'),
				result = underTest.menuItem('test me', 'root', onClick, 'some value');

			clickHandler({menuItemId: result}, {id: 5});
			expect(onClick).toHaveBeenCalledWith(5, 'some value');
		});
		it('executes the click handler even without a value', () => {
			const onClick = jasmine.createSpy('click'),
				result = underTest.menuItem('test me', 'root', onClick);
			clickHandler({menuItemId: result}, {id: 5});
			expect(onClick).toHaveBeenCalledWith(5, undefined);
		});
	});
});

