/*global describe, it, expect, beforeEach, afterEach, jasmine*/
const CredentialManager = require('../src/lib/credential-manager');
const testData = require('./data/accounts.json');

describe('CredentialManager with Azure Key Vault', () => {
	'use strict';
	let browserInterface, fetchSpy, manager;
	beforeEach(() => {
		fetchSpy = jasmine.createSpy('fetch');
		global.fetch = fetchSpy;
		browserInterface = jasmine.createSpyObj('browserInterface', ['getOptionsAsync', 'executeScript', 'sendMessage']);
		browserInterface.getOptionsAsync.and.returnValue(Promise.resolve(testData));
		browserInterface.executeScript.and.returnValue(Promise.resolve());
		browserInterface.sendMessage.and.returnValue(Promise.resolve());
		manager = new CredentialManager(browserInterface);
	});
	afterEach(() => {
		delete global.fetch;
	});
	it('fills credentials from Azure Key Vault on the page', done => {
		fetchSpy.and.returnValue(Promise.resolve({
			ok: true,
			json: () => Promise.resolve({ value: 'secret-pass' })
		}));
		manager.fillCredentials(42, testData.accounts[0]).then(() => {
			expect(fetchSpy).toHaveBeenCalled();
			expect(browserInterface.executeScript).toHaveBeenCalledWith(42, '/credential-fill.js');
			expect(browserInterface.sendMessage).toHaveBeenCalledWith(42, { username: testData.accounts[0], password: 'secret-pass' });
		}).then(done, done.fail);
	});
	it('updates password in Azure Key Vault', done => {
		fetchSpy.and.returnValue(Promise.resolve({ ok: true }));
		manager.updatePassword(testData.accounts[0], 'newpass').then(() => {
			expect(fetchSpy).toHaveBeenCalled();
		}).then(done, done.fail);
	});
});
