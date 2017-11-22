module.exports = function ChromeBrowserInterface(chrome) {
	'use strict';
	const self = this;
	self.saveOptions = function (additionalMenus) {
		chrome.storage.sync.set({
			'additionalMenus': additionalMenus
		});
	};
	self.getOptionsAsync = function () {
		return new Promise((resolve) => {
			chrome.storage.sync.get({
				additionalMenus: []
			}, resolve);
		});
	};
	self.openSettings = function () {
		if (chrome.runtime.openOptionsPage) {
			chrome.runtime.openOptionsPage();
		} else {
			window.open(chrome.runtime.getURL('options.html'));
		}
	};
	self.addStorageListener = function (listener) {
		chrome.storage.onChanged.addListener(function (changes, areaName) {
			if (areaName === 'sync') {
				listener(changes);
			};
		});
	};
	self.getRemoteFile = function (url) {
		return fetch(url, {mode: 'cors'}).then(function (response) {
			if (response.ok) {
				return response.text();
			}
			throw new Error('Network error reading the remote URL');
		});
	};
	self.closeWindow = function () {
		window.close();
	};
	self.readFile = function (fileInfo) {
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

};

