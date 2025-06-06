module.exports = function initCredentialWidget(domElement, browserInterface) {
	'use strict';
	const vaultField = domElement.querySelector('[role=vault-url]'),
		patField = domElement.querySelector('[role=vault-pat]'),
		tokenField = domElement.querySelector('[role=vault-token]'),
		accountsField = domElement.querySelector('[role=accounts]'),
		status = domElement.querySelector('[role=cred-status]'),
	 restore = function () {
			return browserInterface.getOptionsAsync().then(opts => {
				vaultField.value = opts.vaultUrl || '';
				patField.value = opts.vaultPat || '';
				tokenField.value = opts.vaultToken || '';
				accountsField.value = Array.isArray(opts.accounts) ? JSON.stringify(opts.accounts, null, 2) : '[]';
			});
		},
		save = function () {
			try {
				const acc = accountsField.value ? JSON.parse(accountsField.value) : [];
				browserInterface.saveOptions({ vaultUrl: vaultField.value, vaultPat: patField.value, vaultToken: tokenField.value, accounts: acc });
				status.textContent = 'Saved';
				setTimeout(() => status.textContent = '', 1000);
			} catch (e) {
				console.error(e);
				status.textContent = 'Invalid accounts JSON';
			}
		};
	domElement.querySelector('[role=save-credentials]').addEventListener('click', save);
	restore();
};
