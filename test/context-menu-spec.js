/*global describe, window, it, beforeEach, jasmine, expect*/
const ContextMenu = require('../src/lib/context-menu');
describe('ContextMenu', function () {
	'use strict';
	let fakeRoot, standardConfig, browserInterface, underTest, processMenuObject, menuBuilder;
	beforeEach(function () {
		standardConfig = {
			name: 'value'
		};
		fakeRoot = {fake: 'root'};
		processMenuObject = jasmine.createSpy('processMenuObject');
		menuBuilder = jasmine.createSpyObj('menuBuilder', ['rootMenu', 'separator', 'menuItem', 'removeAll', 'subMenu', 'choice']);
		browserInterface = jasmine.createSpyObj('browserInterface', ['getOptionsAsync', 'openSettings', 'addStorageListener', 'executeScript', 'sendMessage']);
		browserInterface.executeScript.and.returnValue(Promise.resolve({}));
		browserInterface.sendMessage.and.returnValue(Promise.resolve({}));
		menuBuilder.rootMenu.and.returnValue(fakeRoot);
		menuBuilder.removeAll.and.returnValue(Promise.resolve({}));
		underTest = new ContextMenu(standardConfig, browserInterface, menuBuilder, processMenuObject);
	});
	describe('initial load', function () {
		it('sets up the basic menu when no local settings', done => {
			browserInterface.getOptionsAsync.and.returnValue(Promise.resolve());
			underTest.init().then(() => {
				expect(processMenuObject.calls.count()).toBe(1);
				expect(processMenuObject.calls.argsFor(0)).toEqual([standardConfig, menuBuilder, fakeRoot, jasmine.any(Function)]);
			}).then(done, done.fail);
		});
		it('sets up only the basic menu when local settings do not contain additional menus', done => {
			browserInterface.getOptionsAsync.and.returnValue(Promise.resolve({another: true}));
			underTest.init().then(() => {
				expect(processMenuObject.calls.count()).toBe(1);
				expect(processMenuObject.calls.argsFor(0)).toEqual([standardConfig, menuBuilder, fakeRoot, jasmine.any(Function)]);
			}).then(done, done.fail);
		});
		it('sets up only the basic menu when local settings do contain an empty menu list', done => {
			browserInterface.getOptionsAsync.and.returnValue(Promise.resolve({additionalMenus: []}));
			underTest.init().then(() => {
				expect(processMenuObject.calls.count()).toBe(1);
				expect(processMenuObject.calls.argsFor(0)).toEqual([standardConfig, menuBuilder, fakeRoot, jasmine.any(Function)]);
			}).then(done, done.fail);
		});
		it('sets up the additional menus between the standard config and generic menus', done => {
			browserInterface.getOptionsAsync.and.returnValue(Promise.resolve({
				additionalMenus: [{name: 'first', config: '123'}, {name: 'second', config: 'xyz'}]
			}));
			underTest.init().then(() => {
				expect(processMenuObject.calls.count()).toBe(3);
				expect(processMenuObject.calls.argsFor(0)).toEqual([standardConfig, menuBuilder, fakeRoot, jasmine.any(Function)]);
				expect(processMenuObject.calls.argsFor(1)).toEqual([{
					first: '123'
				}, menuBuilder, fakeRoot, jasmine.any(Function)]);
				expect(processMenuObject.calls.argsFor(2)).toEqual([{
					second: 'xyz'
				}, menuBuilder, fakeRoot, jasmine.any(Function)]);

			}).then(done, done.fail);
		});
		it('sets up only the additional menus when skipStandard is set', done => {
			browserInterface.getOptionsAsync.and.returnValue(Promise.resolve({
				skipStandard: true,
				additionalMenus: [{name: 'first', config: '123'}, {name: 'second', config: 'xyz'}]
			}));
			underTest.init().then(() => {
				expect(processMenuObject.calls.count()).toBe(2);
				expect(processMenuObject.calls.argsFor(0)).toEqual([{
					first: '123'
				}, menuBuilder, fakeRoot, jasmine.any(Function)]);
				expect(processMenuObject.calls.argsFor(1)).toEqual([{
					second: 'xyz'
				}, menuBuilder, fakeRoot, jasmine.any(Function)]);

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
			browserInterface.getOptionsAsync.and.returnValue(Promise.resolve({
				additionalMenus: [
					{name: 'new1', config: {n1: 'v1'}},
					{name: 'new2', config: {n2: 'v2'}}
				]
			}));
			listener().then(() => {
				expect(processMenuObject.calls.count()).toBe(3);
				expect(processMenuObject.calls.argsFor(0)).toEqual([standardConfig, menuBuilder, newRoot, jasmine.any(Function)]);
				expect(processMenuObject.calls.argsFor(1)).toEqual([{
					new1: {n1: 'v1'}
				}, menuBuilder, newRoot, jasmine.any(Function)]);
				expect(processMenuObject.calls.argsFor(2)).toEqual([{
					new2: {n2: 'v2'}
				}, menuBuilder, newRoot, jasmine.any(Function)]);
			}).then(done, done.fail);
		});
		it('sets up only the additional menus when skipStandard is set', done => {
			browserInterface.getOptionsAsync.and.returnValue(Promise.resolve({
				skipStandard: true,
				additionalMenus: [
					{name: 'new1', config: {n1: 'v1'}},
					{name: 'new2', config: {n2: 'v2'}}
				]
			}));
			listener().then(() => {
				expect(processMenuObject.calls.count()).toBe(2);
				expect(processMenuObject.calls.argsFor(0)).toEqual([{
					new1: {n1: 'v1'}
				}, menuBuilder, newRoot, jasmine.any(Function)]);
				expect(processMenuObject.calls.argsFor(1)).toEqual([{
					new2: {n2: 'v2'}
				}, menuBuilder, newRoot, jasmine.any(Function)]);
			}).then(done, done.fail);
		});

	});
	describe('click handler for menus', () => {
		let clickHandler;
		beforeEach((done) => {
			browserInterface.getOptionsAsync.and.returnValue(Promise.resolve());
			underTest.init().then(() => {
				clickHandler = processMenuObject.calls.argsFor(0)[3];
			}).then(done, done.fail);
		});
		it('does nothing when the value is false -- but not empty string', () => {
			clickHandler(1, null);
			clickHandler(2, false);
			clickHandler(3, undefined);
			expect(browserInterface.executeScript).not.toHaveBeenCalled();
		});
		it('executes the script when the message is valid', done => {
			browserInterface.executeScript.and.callFake((tabId, url) => {
				expect(tabId).toEqual(1);
				expect(url).toEqual('/inject-value.js');
				done();
				return new Promise(() => false);
			});
			clickHandler(1, 'something').then(done.fail, done.fail);
		});
		it('does not send the message before the script executes', done => {
			browserInterface.executeScript.and.callFake(() => {
				expect(browserInterface.sendMessage).not.toHaveBeenCalled();
				done();
				return new Promise(() => false);
			});
			clickHandler(1, 'something').then(done.fail, done.fail);
		});
		it('sends plain strings as a literal type object after the script executes', done => {
			clickHandler(1, 'something')
				.then(() => expect(browserInterface.sendMessage).toHaveBeenCalledWith(1, {_type: 'literal', value: 'something'}))
				.then(done, done.fail);
		});
		it('sends empty strings as a literal type object after the script executes', done => {
			clickHandler(1, '')
				.then(() => expect(browserInterface.sendMessage).toHaveBeenCalledWith(1, {_type: 'literal', value: ''}))
				.then(done, done.fail);
		});
		it('sends objects directly after the script executes', done => {
			clickHandler(1, {a: 'b'})
				.then(() => expect(browserInterface.sendMessage).toHaveBeenCalledWith(1, {a: 'b'}))
				.then(done, done.fail);
		});


	});
});
