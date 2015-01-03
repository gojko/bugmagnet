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
			expect(lastMenu()['contexts']).toEqual(['editable']);
			expect(lastMenu()['title']).toBe('test me');
			expect(lastMenu()['parentId']).toBeFalsy();
			expect(lastMenu()['onclick']).toBeFalsy();
		});
	});
	describe('subMenu', function () {
		it('creates a menu item with a parent', function () {
			underTest.subMenu('test me', 'root');
			expect(chrome.contextMenus.create.calls.count()).toBe(1);
			expect(lastMenu()['contexts']).toEqual(['editable']);
			expect(lastMenu()['title']).toBe('test me');
			expect(lastMenu()['parentId']).toBe('root');
			expect(lastMenu()['onclick']).toBeFalsy();
		});
	});
	describe('menuItem', function () {
		it('creates a clickable menu item with a parent', function () {
			underTest.menuItem('test me', 'root', 'some value');
			expect(chrome.contextMenus.create.calls.count()).toBe(1);
			expect(lastMenu()['contexts']).toEqual(['editable']);
			expect(lastMenu()['title']).toBe('test me');
			expect(lastMenu()['parentId']).toBe('root');
			expect(lastMenu()['onclick'] instanceof Function).toBeTruthy();
		});
		it('connects a chrome.tabs.sendMessage call to click with a simple string', function () {
			underTest.menuItem('test me', 'root', 'some value');
			var onclick = lastMenu()['onclick'];

			onclick({}, {id:5});
			expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(5, {'_type': 'literal', value: 'some value'});
		});
		it('connects a chrome.tabs.sendMessage call to click with a hash object string', function () {
			underTest.menuItem('test me', 'root', {'_type': 'size', value: 'some value'});
			var onclick = lastMenu()['onclick'];
			onclick({}, {id:5});
			expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(5, {'_type': 'size', value: 'some value'});
		});
	});
});

