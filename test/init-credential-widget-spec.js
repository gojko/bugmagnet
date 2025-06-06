/*global describe, it, expect, beforeEach, afterEach, jasmine */
const initCredentialWidget = require('../src/lib/init-credential-widget');

describe('initCredentialWidget', function () {
	'use strict';
	let container, browserInterface, status, saveBtn, vaultUrl, pat, token, accounts;
	const template = `
		<input role="vault-url" id="vaultUrl"/>
		<input role="vault-pat" id="pat"/>
		<input role="vault-token" id="token"/>
		<textarea role="accounts" id="accounts"></textarea>
		<span role="cred-status" id="status"></span>
		<button role="save-credentials" id="save">Save</button>`;

	beforeEach(() => {
		container = document.createElement('div');
		container.innerHTML = template;
		document.body.appendChild(container);
		browserInterface = jasmine.createSpyObj('browserInterface', ['saveOptions', 'getOptionsAsync']);
		browserInterface.getOptionsAsync.and.returnValue(Promise.resolve({
			vaultUrl: 'a',
			vaultPat: 'b',
			vaultToken: 'c',
			accounts: [{n:1}]
		}));
		browserInterface.saveOptions.and.returnValue(Promise.resolve());
		initCredentialWidget(container, browserInterface);
		status = document.getElementById('status');
		saveBtn = document.getElementById('save');
		vaultUrl = document.getElementById('vaultUrl');
		pat = document.getElementById('pat');
		token = document.getElementById('token');
		accounts = document.getElementById('accounts');
	});

	afterEach(() => {
		container.remove();
	});

	it('restores saved values on load', () => {
		expect(vaultUrl.value).toEqual('a');
		expect(pat.value).toEqual('b');
		expect(token.value).toEqual('c');
		expect(accounts.value).toMatch(/\[/);
	});

	it('saves values when clicking save', done => {
		vaultUrl.value = 'x';
		pat.value = 'y';
		token.value = 'z';
		accounts.value = '[{"u":1}]';
		saveBtn.click();
		setTimeout(() => {
			expect(browserInterface.saveOptions).toHaveBeenCalledWith({
				vaultUrl: 'x',
				vaultPat: 'y',
				vaultToken: 'z',
				accounts: [{u: 1}]
			});
			done();
		}, 0);
	});

	it('shows error for invalid JSON', () => {
		accounts.value = '[';
		saveBtn.click();
		expect(status.textContent).toMatch(/Invalid/);
		expect(browserInterface.saveOptions).not.toHaveBeenCalled();
	});
});
