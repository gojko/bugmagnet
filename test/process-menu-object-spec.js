/*global jasmine, beforeEach, it, expect, describe */
const processMenuObject = require('../src/lib/process-menu-object');
describe('processMenuObject', function () {
	'use strict';
	let rootMenu, menuBuilder, onClick;
	beforeEach(function () {
		rootMenu = 'rootM';
		menuBuilder = jasmine.createSpyObj('menuBuilder', ['rootMenu', 'subMenu', 'menuItem']);
		onClick = jasmine.createSpy('onClick');
	});
	it('creates simple menu items out of string-value properties, in order of appearance', function () {
		processMenuObject({'First Item': 'VAT', 'Second Item': 'Corporate Tax', 'Another Item': 'Euro VAT'}, menuBuilder, rootMenu, onClick);
		expect(menuBuilder.menuItem.calls.count()).toBe(3);
		expect(menuBuilder.menuItem.calls.argsFor(0)).toEqual(['First Item', 'rootM', onClick, 'VAT']);
		expect(menuBuilder.menuItem.calls.argsFor(1)).toEqual(['Second Item', 'rootM', onClick, 'Corporate Tax']);
		expect(menuBuilder.menuItem.calls.argsFor(2)).toEqual(['Another Item', 'rootM', onClick, 'Euro VAT']);
	});
	it('creates simple menu items out of objects with _type property, passing the object into the menu as value', function () {
		processMenuObject({'First Item': { '_type': 'taxtype', 'amount': '200' }}, menuBuilder, rootMenu, onClick);
		expect(menuBuilder.menuItem.calls.count()).toBe(1);
		expect(menuBuilder.menuItem.calls.argsFor(0)).toEqual(['First Item', 'rootM', onClick, {'_type': 'taxtype', 'amount': '200'}]);
	});
	it('creates sub-menus out of string array items, using name as label, in array index order', function () {
		menuBuilder.subMenu.and.returnValue('subM');
		processMenuObject({'Taxes': ['VAT', 'Corporate Tax', 'Euro VAT']}, menuBuilder, rootMenu, onClick);

		expect(menuBuilder.subMenu).toHaveBeenCalledWith('Taxes', 'rootM');
		expect(menuBuilder.menuItem.calls.count()).toBe(3);
		expect(menuBuilder.menuItem.calls.argsFor(0)).toEqual(['VAT', 'subM', onClick, 'VAT']);
		expect(menuBuilder.menuItem.calls.argsFor(1)).toEqual(['Corporate Tax', 'subM', onClick, 'Corporate Tax']);
		expect(menuBuilder.menuItem.calls.argsFor(2)).toEqual(['Euro VAT', 'subM', onClick, 'Euro VAT']);
	});
	it('creates sub-menus out of hash items', function () {
		menuBuilder.subMenu.and.returnValue('subM');
		processMenuObject({'Taxes': {'First Item': 'VAT', 'Second Item': 'Corporate Tax', 'Another Item': 'Euro VAT'}}, menuBuilder, rootMenu, onClick);

		expect(menuBuilder.subMenu).toHaveBeenCalledWith('Taxes', 'rootM');
		expect(menuBuilder.menuItem.calls.count()).toBe(3);
		expect(menuBuilder.menuItem.calls.argsFor(0)).toEqual(['First Item', 'subM', onClick, 'VAT']);
		expect(menuBuilder.menuItem.calls.argsFor(1)).toEqual(['Second Item', 'subM', onClick, 'Corporate Tax']);
		expect(menuBuilder.menuItem.calls.argsFor(2)).toEqual(['Another Item', 'subM', onClick, 'Euro VAT']);
	});
});


