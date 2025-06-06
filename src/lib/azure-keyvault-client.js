module.exports = function AzureKeyVaultClient(settings) {
	'use strict';
	const opts = settings || {},
		apiVersion = opts.apiVersion || '7.1',
	 vaultUrl = opts.url ? opts.url.replace(/\/$/, '') : '',
		authToken = opts.pat || opts.token,
		toSecretName = function (identifier) {
			return identifier.replace(/_/g, '---')
				.replace(/@/g, '--')
				.replace(/\./g, '-');
		},
		getSecret = function (identifier) {
			const name = toSecretName(identifier),
				url = vaultUrl + '/secrets/' + name + '?api-version=' + apiVersion;
			return fetch(url, {
				method: 'GET',
				headers: { 'Authorization': 'Bearer ' + authToken }
			}).then(response => {
				if (!response.ok) {
					throw new Error('Error fetching secret');
				}
				return response.json();
			}).then(data => data.value);
		},
		setSecret = function (identifier, value) {
			const name = toSecretName(identifier),
				url = vaultUrl + '/secrets/' + name + '?api-version=' + apiVersion;
			return fetch(url, {
				method: 'PUT',
				headers: { 'Authorization': 'Bearer ' + authToken, 'Content-Type': 'application/json' },
				body: JSON.stringify({ value: value })
			}).then(response => {
				if (!response.ok) {
					throw new Error('Error setting secret');
				}
			});
		};
	return { getSecret: getSecret, setSecret: setSecret, toSecretName: toSecretName };
};
