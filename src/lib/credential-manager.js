const AzureKeyVaultClient = require('./azure-keyvault-client');
module.exports = function CredentialManager(browserInterface) {
        'use strict';
        let options = {},
                client;
        const loadOptions = function () {
                        return browserInterface.getOptionsAsync().then(opts => {
                                options = opts || {};
                                client = new AzureKeyVaultClient({ url: options.vaultUrl, pat: options.vaultPat, token: options.vaultToken });
                        });
                };
        this.getAccounts = function () {
                return loadOptions().then(() => options.accounts || []);
        };
        this.fillCredentials = function (tabId, accountId) {
                return loadOptions().then(() => client.getSecret(accountId)
                        .then(password => browserInterface.executeScript(tabId, '/credential-fill.js')
                                .then(() => browserInterface.sendMessage(tabId, { username: accountId, password: password }))
                        ));
        };
        this.updatePassword = function (accountId, newPassword) {
                return loadOptions().then(() => client.setSecret(accountId, newPassword));
        };
};
