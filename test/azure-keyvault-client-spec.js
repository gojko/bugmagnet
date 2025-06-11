/*global describe, it, expect, beforeEach, afterEach, jasmine*/
const AzureKeyVaultClient = require('../src/lib/azure-keyvault-client');

describe('AzureKeyVaultClient', () => {
	'use strict';
	let fetchSpy, client;
	beforeEach(() => {
		fetchSpy = jasmine.createSpy('fetch');
		global.fetch = fetchSpy;
		client = new AzureKeyVaultClient({ url: 'https://example.vault.azure.net', token: 'abc' });
	});
	afterEach(() => {
		delete global.fetch;
	});
	it('converts account identifier to secret name', () => {
		expect(client.toSecretName('user_example@test.email.com')).toBe('user---example--test-email-com');
	});
	it('retrieves a secret value', done => {
		fetchSpy.and.returnValue(Promise.resolve({
			ok: true,
			json: () => Promise.resolve({ value: 'secret' })
		}));
		client.getSecret('test@example.com').then(value => {
			expect(fetchSpy).toHaveBeenCalled();
			expect(value).toBe('secret');
		}).then(done, done.fail);
	});
	it('stores a secret value', done => {
		fetchSpy.and.returnValue(Promise.resolve({ ok: true }));
		client.setSecret('test@example.com', 'secret').then(() => {
			expect(fetchSpy).toHaveBeenCalled();
		}).then(done, done.fail);
	});
});
