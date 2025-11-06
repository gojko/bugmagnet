import { ContextMenu } from '../src/lib/context-menu.js';

describe('ContextMenu', () => {
	let fakeRoot, standardConfig, browserInterface, underTest, processMenuObject, menuBuilder;
	beforeEach(() => {
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
	describe('initial load', () => {
		it('sets up the basic menu when no local settings', async () => {
			browserInterface.getOptionsAsync.and.returnValue(Promise.resolve());
			await underTest.init();
			expect(processMenuObject.calls.count()).toBe(1);
			expect(processMenuObject.calls.argsFor(0)).toEqual([standardConfig, menuBuilder, fakeRoot, jasmine.any(Function)]);
		});
		it('sets up only the basic menu when local settings do not contain additional menus', async () => {
			browserInterface.getOptionsAsync.and.returnValue(Promise.resolve({another: true}));
			await underTest.init();
			expect(processMenuObject.calls.count()).toBe(1);
			expect(processMenuObject.calls.argsFor(0)).toEqual([standardConfig, menuBuilder, fakeRoot, jasmine.any(Function)]);
		});
		it('sets up only the basic menu when local settings do contain an empty menu list', async () => {
			browserInterface.getOptionsAsync.and.returnValue(Promise.resolve({additionalMenus: []}));
			await underTest.init();
			expect(processMenuObject.calls.count()).toBe(1);
			expect(processMenuObject.calls.argsFor(0)).toEqual([standardConfig, menuBuilder, fakeRoot, jasmine.any(Function)]);
		});
		it('sets up the additional menus between the standard config and generic menus', async () => {
			browserInterface.getOptionsAsync.and.returnValue(Promise.resolve({
				additionalMenus: [{name: 'first', config: '123'}, {name: 'second', config: 'xyz'}]
			}));
			await underTest.init();
			expect(processMenuObject.calls.count()).toBe(3);
			expect(processMenuObject.calls.argsFor(0)).toEqual([standardConfig, menuBuilder, fakeRoot, jasmine.any(Function)]);
			expect(processMenuObject.calls.argsFor(1)).toEqual([{
				first: '123'
			}, menuBuilder, fakeRoot, jasmine.any(Function)]);
			expect(processMenuObject.calls.argsFor(2)).toEqual([{
				second: 'xyz'
			}, menuBuilder, fakeRoot, jasmine.any(Function)]);
		});
		it('sets up only the additional menus when skipStandard is set', async () => {
			browserInterface.getOptionsAsync.and.returnValue(Promise.resolve({
				skipStandard: true,
				additionalMenus: [{name: 'first', config: '123'}, {name: 'second', config: 'xyz'}]
			}));
			await underTest.init();
			expect(processMenuObject.calls.count()).toBe(2);
			expect(processMenuObject.calls.argsFor(0)).toEqual([{
				first: '123'
			}, menuBuilder, fakeRoot, jasmine.any(Function)]);
			expect(processMenuObject.calls.argsFor(1)).toEqual([{
				second: 'xyz'
			}, menuBuilder, fakeRoot, jasmine.any(Function)]);
		});
	});
	describe('sync storage listener', () => {
		let listener, validChange, newRoot;
		beforeEach(async () => {
			validChange = {additionalMenus: [{name: 'a', config: {'b': 'c'}}]};
			newRoot = {newRoot: 'root'};
			browserInterface.getOptionsAsync.and.returnValue(Promise.resolve({
				additionalMenus: [{name: 'first', config: '123'}, {name: 'second', config: 'xyz'}]
			}));
			await underTest.init();
			menuBuilder.rootMenu.and.returnValue(newRoot);
			listener = browserInterface.addStorageListener.calls.argsFor(0)[0];
			processMenuObject.calls.reset();
			menuBuilder.rootMenu.calls.reset();
		});
		it('clears all menu items', async () => {
			await listener(validChange);
			expect(menuBuilder.removeAll).toHaveBeenCalled();
		});
		it('does not re-create menus before the old menu is cleared', async () => {
			let callbackExecuted = false;
			menuBuilder.removeAll.and.callFake(() => {
				expect(menuBuilder.rootMenu).not.toHaveBeenCalled();
				expect(processMenuObject).not.toHaveBeenCalled();
				callbackExecuted = true;
				return new Promise(() => false);
			});
			listener({additionalMenus: [{name: 'a', config: {'b': 'c'}}]});
			await new Promise(resolve => setTimeout(resolve, 10));
			expect(callbackExecuted).toBe(true);
		});
		it('sets up the new menus after clearing', async () => {
			browserInterface.getOptionsAsync.and.returnValue(Promise.resolve({
				additionalMenus: [
					{name: 'new1', config: {n1: 'v1'}},
					{name: 'new2', config: {n2: 'v2'}}
				]
			}));
			await listener();
			expect(processMenuObject.calls.count()).toBe(3);
			expect(processMenuObject.calls.argsFor(0)).toEqual([standardConfig, menuBuilder, newRoot, jasmine.any(Function)]);
			expect(processMenuObject.calls.argsFor(1)).toEqual([{
				new1: {n1: 'v1'}
			}, menuBuilder, newRoot, jasmine.any(Function)]);
			expect(processMenuObject.calls.argsFor(2)).toEqual([{
				new2: {n2: 'v2'}
			}, menuBuilder, newRoot, jasmine.any(Function)]);
		});
		it('sets up only the additional menus when skipStandard is set', async () => {
			browserInterface.getOptionsAsync.and.returnValue(Promise.resolve({
				skipStandard: true,
				additionalMenus: [
					{name: 'new1', config: {n1: 'v1'}},
					{name: 'new2', config: {n2: 'v2'}}
				]
			}));
			await listener();
			expect(processMenuObject.calls.count()).toBe(2);
			expect(processMenuObject.calls.argsFor(0)).toEqual([{
				new1: {n1: 'v1'}
			}, menuBuilder, newRoot, jasmine.any(Function)]);
			expect(processMenuObject.calls.argsFor(1)).toEqual([{
				new2: {n2: 'v2'}
			}, menuBuilder, newRoot, jasmine.any(Function)]);
		});

	});
	describe('click handler for menus', () => {
		let clickHandler;
		beforeEach(async () => {
			browserInterface.getOptionsAsync.and.returnValue(Promise.resolve());
			await underTest.init();
			clickHandler = processMenuObject.calls.argsFor(0)[3];
		});
		it('does nothing when the value is false -- but not empty string', () => {
			clickHandler(1, null);
			clickHandler(2, false);
			clickHandler(3, undefined);
			expect(browserInterface.executeScript).not.toHaveBeenCalled();
		});
		it('executes the script when the message is valid', async () => {
			let callbackExecuted = false;
			browserInterface.executeScript.and.callFake((tabId, url) => {
				expect(tabId).toEqual(1);
				expect(url).toEqual('inject-value.js');
				callbackExecuted = true;
				return new Promise(() => false);
			});
			clickHandler(1, 'something');
			await new Promise(resolve => setTimeout(resolve, 10));
			expect(callbackExecuted).toBe(true);
		});
		it('does not send the message before the script executes', async () => {
			let callbackExecuted = false;
			browserInterface.executeScript.and.callFake(() => {
				expect(browserInterface.sendMessage).not.toHaveBeenCalled();
				callbackExecuted = true;
				return new Promise(() => false);
			});
			clickHandler(1, 'something');
			await new Promise(resolve => setTimeout(resolve, 10));
			expect(callbackExecuted).toBe(true);
		});
		it('sends plain strings as a literal type object after the script executes', async () => {
			await clickHandler(1, 'something');
			expect(browserInterface.sendMessage).toHaveBeenCalledWith(1, {_type: 'literal', value: 'something'});
		});
		it('sends empty strings as a literal type object after the script executes', async () => {
			await clickHandler(1, '');
			expect(browserInterface.sendMessage).toHaveBeenCalledWith(1, {_type: 'literal', value: ''});
		});
		it('sends objects directly after the script executes', async () => {
			await clickHandler(1, {a: 'b'});
			expect(browserInterface.sendMessage).toHaveBeenCalledWith(1, {a: 'b'});
		});


	});
});
