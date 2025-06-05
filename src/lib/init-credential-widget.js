module.exports = function initCredentialWidget(domElement, browserInterface) {
        'use strict';
        let vaultField = domElement.querySelector('[role=vault-url]'),
                patField = domElement.querySelector('[role=vault-pat]'),
                accountsField = domElement.querySelector('[role=accounts]'),
                status = domElement.querySelector('[role=cred-status]');
        const restore = function () {
                        return browserInterface.getOptionsAsync().then(opts => {
                                vaultField.value = opts.vaultUrl || '';
                                patField.value = opts.vaultPat || '';
                                accountsField.value = Array.isArray(opts.accounts) ? JSON.stringify(opts.accounts, null, 2) : '[]';
                        });
                },
                save = function () {
                        try {
                                const acc = accountsField.value ? JSON.parse(accountsField.value) : [];
                                browserInterface.saveOptions({ vaultUrl: vaultField.value, vaultPat: patField.value, accounts: acc });
                                status.textContent = 'Saved';
                                setTimeout(() => status.textContent = '', 1000);
                        } catch (e) {
                                status.textContent = 'Invalid accounts JSON';
                        }
                };
        domElement.querySelector('[role=save-credentials]').addEventListener('click', save);
        restore();
};
