/*global describe, window, it, beforeEach, jasmine, expect*/
const ChromeMenu = require('../src/lib/chrome-menu');
describe('ChromeMenu', function () {
	'use strict';
	let fakeRoot, standardConfig, browserInterface, underTest, processMenuObject, menuBuilder;
	beforeEach(function () {
		standardConfig = {
			name: 'value'
		};
		fakeRoot = {fake: 'root'};
		processMenuObject = jasmine.createSpy('processMenuObject');
		menuBuilder = jasmine.createSpyObj('menuBuilder', ['rootMenu', 'separator', 'menuItem', 'removeAll']);
		browserInterface = jasmine.createSpyObj('browserInterface', ['getOptionsAsync', 'openSettings', 'addStorageListener']);
		menuBuilder.rootMenu.and.returnValue(fakeRoot);
		menuBuilder.removeAll.and.returnValue(Promise.resolve({}));
		underTest = new ChromeMenu(standardConfig, browserInterface, menuBuilder, processMenuObject);
	});
	describe('initial load', function () {
		it('sets up the basic menu when no local settings', done => {
			browserInterface.getOptionsAsync.and.returnValue(Promise.resolve());
			underTest.init().then(() => {
				expect(processMenuObject.calls.count()).toBe(1);
				expect(processMenuObject.calls.argsFor(0)).toEqual([standardConfig, menuBuilder, fakeRoot]);
			}).then(done, done.fail);
		});
		it('sets up the basic menu when local settings do not contain additional menus', done => {
			browserInterface.getOptionsAsync.and.returnValue(Promise.resolve({another: true}));
			underTest.init().then(() => {
				expect(processMenuObject.calls.count()).toBe(1);
				expect(processMenuObject.calls.argsFor(0)).toEqual([standardConfig, menuBuilder, fakeRoot]);
			}).then(done, done.fail);
		});
		it('sets up the basic menu when local settings do contain an empty menu list', done => {
			browserInterface.getOptionsAsync.and.returnValue(Promise.resolve({additionalMenus: []}));
			underTest.init().then(() => {
				expect(processMenuObject.calls.count()).toBe(1);
				expect(processMenuObject.calls.argsFor(0)).toEqual([standardConfig, menuBuilder, fakeRoot]);
			}).then(done, done.fail);
		});
		it('sets up the additional menus between the standard config and generic menus', done => {
			browserInterface.getOptionsAsync.and.returnValue(Promise.resolve({
				additionalMenus: [{name: 'first', config: '123'}, {name: 'second', config: 'xyz'}]
			}));
			underTest.init().then(() => {
				expect(processMenuObject.calls.count()).toBe(3);
				expect(processMenuObject.calls.argsFor(0)).toEqual([standardConfig, menuBuilder, fakeRoot]);
				expect(processMenuObject.calls.argsFor(1)).toEqual([{
					first: '123'
				}, menuBuilder, fakeRoot]);
				expect(processMenuObject.calls.argsFor(2)).toEqual([{
					second: 'xyz'
				}, menuBuilder, fakeRoot]);

			}).then(done, done.fail);
		});
	});
	describe('sync storage listener', function () {
		let listener, validChange, newRoot;
		beforeEach(done => {
			validChange = {additionalMenus: [{name: 'a', config: {'b': 'c'}}]};
			newRoot = {newRoot: 'root'};
			browserInterface.getOptionsAsync.and.returnValue(Promise.resolve({
				additionalMenus: [{name: 'first', config: '123'}, {name: 'second', config: 'xyz'}]
			}));
			underTest.init().then(() => {
				menuBuilder.rootMenu.and.returnValue(newRoot);
				listener = browserInterface.addStorageListener.calls.argsFor(0)[0];
				processMenuObject.calls.reset();
				menuBuilder.rootMenu.calls.reset();
			}).then(done, done.fail);
		});
		it('does nothing if the changes do not contain additionalMenus', done => {
			listener({somethingElse: true}).then(() => {
				expect(menuBuilder.removeAll).not.toHaveBeenCalled();
			}).then(done, done.fail);
		});
		it('clears all menu items', function (done) {
			listener(validChange).then(() => {
				expect(menuBuilder.removeAll).toHaveBeenCalled();
			}).then(done, done.fail);
		});
		it('does not re-create menus before the old menu is cleared', done => {
			menuBuilder.removeAll.and.callFake(() => {
				expect(menuBuilder.rootMenu).not.toHaveBeenCalled();
				expect(processMenuObject).not.toHaveBeenCalled();
				done();
				return new Promise(() => false);
			});
			listener({additionalMenus: [{name: 'a', config: {'b': 'c'}}]})
				.then(done.fail, done.fail);
		});
		it('sets up the new menus after clearing', done => {
			listener({
				additionalMenus: {
					newValue: [
						{name: 'new1', config: {n1: 'v1'}},
						{name: 'new2', config: {n2: 'v2'}}
					]
				}
			}).then(() => {
				expect(processMenuObject.calls.count()).toBe(3);
				expect(processMenuObject.calls.argsFor(0)).toEqual([standardConfig, menuBuilder, newRoot]);
				expect(processMenuObject.calls.argsFor(1)).toEqual([{
					new1: {n1: 'v1'}
				}, menuBuilder, newRoot]);
				expect(processMenuObject.calls.argsFor(2)).toEqual([{
					new2: {n2: 'v2'}
				}, menuBuilder, newRoot]);
			}).then(done, done.fail);
		});
	});
});
