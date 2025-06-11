/*global describe, it, expect, beforeEach, afterEach, document*/
const FakeChromeApi = require('./utils/fake-chrome-api');

describe('credential-fill script', () => {
	'use strict';
	let chrome, listener, submitted;
	beforeEach(() => {
		chrome = new FakeChromeApi();
		global.chrome = chrome;
		document.body.innerHTML = '<form id="f"><input type="text"/><input type="password"/></form>';
		delete require.cache[require.resolve('../src/main/credential-fill.js')];
		require('../src/main/credential-fill.js');
		listener = chrome.runtime.onMessage.addListener.calls.argsFor(0)[0];
		submitted = false;
		document.getElementById('f').addEventListener('submit', e => { e.preventDefault(); submitted = true; });
	});
	afterEach(() => {
		document.body.innerHTML = '';
		delete global.chrome;
	});
	it('fills and submits the login form', () => {
		listener({ username: 'user', password: 'pass' });
		const inputs = document.querySelectorAll('input');
		expect(inputs[0].value).toBe('user');
		expect(inputs[1].value).toBe('pass');
		expect(submitted).toBe(true);
	});
});
