/*global describe, it, expect, require */
const getRequestValue = require('../src/lib/get-request-value');
describe('getRequestValue', () => {
	'use strict';
	it('returns a literal value for _type=literal', () => {
		expect(getRequestValue({_type: 'literal', value: 'abc'})).toEqual('abc');
	});
	it('returns a replicated value up to size for _type=size', () => {
		expect(getRequestValue({ '_type': 'size', 'size': '5', 'template': 'A' })).toEqual('AAAAA');
		expect(getRequestValue({ '_type': 'size', 'size': '20', 'template': '1234567' })).toEqual('12345671234567123456');
	});
});
