export function ChromeBrowserInterface(chrome) {
	const instance = this;
	instance.saveOptions = function (options) {
		chrome.storage.sync.set(options);
	};
	instance.getOptionsAsync = function () {
		return new Promise((resolve) => {
			chrome.storage.sync.get(null, resolve);
		});
	};
	instance.openSettings = function () {
		if (chrome.runtime.openOptionsPage) {
			chrome.runtime.openOptionsPage();
		} else {
			chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
		}
	};
	instance.openUrl = function (url) {
		chrome.tabs.create({ url: url });
	};
	instance.addStorageListener = function (listener) {
		chrome.storage.onChanged.addListener((changes, areaName) => {
			if (areaName === 'sync') {
				listener(changes);
			};
		});
	};
	instance.getRemoteFile = function (url) {
		return fetch(url, {mode: 'cors'}).then((response) => {
			if (response.ok) {
				return response.text();
			}
			throw new Error('Network error reading the remote URL');
		});
	};
	instance.closeWindow = function () {
		window.close();
	};
	instance.readFile = function (fileInfo) {
		return new Promise((resolve, reject) => {
			const oFReader = new FileReader();
			oFReader.onload = function (oFREvent) {
				try {
					resolve(oFREvent.target.result);
				} catch (e) {
					reject(e);
				}
			};
			oFReader.onerror = reject;
			oFReader.readAsText(fileInfo, 'UTF-8');
		});
	};
	instance.executeScript = function (tabId, source) {
		return chrome.scripting.executeScript({
			target: { tabId: tabId },
			files: [source]
		});
	};
	instance.sendMessage = function (tabId, message) {
		return chrome.tabs.sendMessage(tabId, message);
	};

	instance.requestPermissions = function (permissionsArray) {
		return new Promise((resolve, reject) => {
			try {
				chrome.permissions.request({permissions: permissionsArray}, (granted) => {
					if (granted) {
						resolve();
					} else {
						reject();
					}
				});
			} catch (e) {
				console.log(e);
				reject(e);
			}
		});
	};
	instance.removePermissions = function (permissionsArray) {
		return new Promise((resolve) => chrome.permissions.remove({permissions: permissionsArray}, resolve));
	};
	instance.copyToClipboard = function (text) {
		// In Manifest V3, we need to use navigator.clipboard in a content script context
		// Since this is called from background, we inject into the active tab
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			if (tabs[0]) {
				chrome.scripting.executeScript({
					target: { tabId: tabs[0].id },
					func: (textToCopy) => {
						const handler = function (e) {
							e.clipboardData.setData('text/plain', textToCopy);
							e.preventDefault();
						};
						document.addEventListener('copy', handler);
						document.execCommand('copy');
						document.removeEventListener('copy', handler);
					},
					args: [text]
				});
			}
		});
	};
	instance.showMessage = function (text) {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			if (tabs[0]) {
				chrome.scripting.executeScript({
					target: { tabId: tabs[0].id },
					func: (message) => alert(message),
					args: [text]
				});
			}
		});
	};
};

