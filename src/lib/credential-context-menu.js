const fillCredentialsHandler = require('./fill-credentials-request-handler');
module.exports = function CredentialContextMenu(browserInterface) {
	'use strict';
	const self = this,
		buildMenu = function () {
			if (rootId) {
				chrome.contextMenus.remove(rootId);
				menuIds.forEach(id => chrome.contextMenus.remove(id));
				menuIds = [];
				rootId = null;
			}
			return browserInterface.getOptionsAsync().then(opts => {
				const accounts = opts && opts.accounts;
				if (!accounts || !accounts.length) {
					return;
				}
				rootId = chrome.contextMenus.create({title: 'Test Accounts', contexts: ['editable']});
				accounts.forEach(acc => {
					const id = chrome.contextMenus.create({
						title: acc,
						parentId: rootId,
						contexts: ['editable'],
						onclick: (info, tab) => fillCredentialsHandler(browserInterface, tab.id, acc)
					});
					menuIds.push(id);
				});
			});
		};
	let rootId,
		menuIds = [];
	self.init = function () {
		buildMenu();
		browserInterface.addStorageListener(buildMenu);
	};
};
