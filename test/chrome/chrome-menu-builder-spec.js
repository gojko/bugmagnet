/*global describe, it, expect, BugMagnet, beforeEach, chrome*/
describe('BugMagnet.ChromeMenuBuilder', function () {
	'use strict';
	var underTest,
		lastMenu = function () {
			return chrome.contextMenus.create.calls.argsFor(0)[0];
		};
	beforeEach(function () {
		chrome.contextMenus.create.calls.reset();
		chrome.tabs.sendMessage.calls.reset();
		underTest = new BugMagnet.ChromeMenuBuilder();
	});
	describe('rootMenu', function () {
		it('creates a menu item without a parent', function () {
			underTest.rootMenu('test me');
			expect(chrome.contextMenus.create.calls.count()).toBe(1);
			var result = lastMenu();
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
			var result = lastMenu();
			expect(result.contexts).toEqual(['editable']);
			expect(result.title).toBe('test me');
			expect(result.parentId).toBe('root');
			expect(result.onclick).toBeFalsy();
		});
	});
	describe('menuItem', function () {
		it('creates a clickable menu item with a parent', function () {
			underTest.menuItem('test me', 'root', 'some value');
			expect(chrome.contextMenus.create.calls.count()).toBe(1);
			var result = lastMenu();
			expect(result.contexts).toEqual(['editable']);
			expect(result.title).toBe('test me');
			expect(result.parentId).toBe('root');
			expect(result.onclick instanceof Function).toBeTruthy();
		});
		it('connects a chrome.tabs.sendMessage call to click with a simple string', function () {
			underTest.menuItem('test me', 'root', 'some value');
			var result = lastMenu();

			result.onclick({}, {id: 5});
			expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(5, {'_type': 'literal', value: 'some value'});
		});
		it('connects a chrome.tabs.sendMessage call to click with a hash object string', function () {
			underTest.menuItem('test me', 'root', {'_type': 'size', value: 'some value'});
			var result = lastMenu();
			result.onclick({}, {id: 5});
			expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(5, {'_type': 'size', value: 'some value'});
		});
	});
});

