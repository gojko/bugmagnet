const CredentialManager = require('./credential-manager');
module.exports = function fillCredentialsRequestHandler(browserInterface, tabId, account) {
        'use strict';
        const manager = new CredentialManager(browserInterface);
        return manager.fillCredentials(tabId, account);
};
