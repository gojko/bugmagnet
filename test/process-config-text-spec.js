/*global describe, it, expect, beforeEach, jasmine */
const processConfigText = require('../src/lib/process-config-text');
describe('processConfigText', function () {
	'use strict';
	let menuBuilder;
	beforeEach(function () {
		menuBuilder = jasmine.createSpyObj('menuBuilder', ['rootMenu', 'subMenu', 'menuItem']);
	});
	it('creates a root level menu titled Bug Magnet if root menu is not provided', function () {
		processConfigText('{}', menuBuilder);
		expect(menuBuilder.rootMenu).toHaveBeenCalledWith('Bug Magnet');
	});
	it('returns the root menu id', function () {
		menuBuilder.rootMenu.and.returnValue('rootM');
		const result = processConfigText('{}', menuBuilder);
		expect(result).toEqual('rootM');
	});
	it('does not create a root menu, but uses the one from the argument if provided', function () {
		processConfigText('{"First Item": { "_type": "taxtype", "amount": "200" }}', menuBuilder, 'customRoot');
		expect(menuBuilder.rootMenu).not.toHaveBeenCalled();
		expect(menuBuilder.menuItem.calls.count()).toBe(1);
		expect(menuBuilder.menuItem.calls.argsFor(0)).toEqual(['First Item', 'customRoot', {'_type': 'taxtype', 'amount': '200'}]);
	});
});
