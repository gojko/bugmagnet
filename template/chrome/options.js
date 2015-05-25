/*global chrome, document, setTimeout, FileReader */
(function () {
	'use strict';
	var additionalMenus = [],
			template,
			list,
			updateStatus = function (text) {
				var status = document.getElementById('status');
				status.textContent = text;
				setTimeout(function () {
					status.textContent = '';
				}, 1500);
			},
			saveOptions = function () {
				chrome.storage.sync.set({
					'additionalMenus': additionalMenus
				});
			},
			rebuildMenu = function () {
				list.innerHTML = '';
				if (additionalMenus && additionalMenus.length) {
					additionalMenus.forEach(function (configItem, index) {
						var clone = template.cloneNode(true);
						list.appendChild(clone);
						clone.querySelector('[role=name]').textContent = configItem.name;
						clone.querySelector('[role=source]').textContent = configItem.source;
						clone.querySelector('[role=remove]').addEventListener('click', function () {
							additionalMenus.splice(index, 1);
							rebuildMenu();
							saveOptions();
						});
					});
					document.getElementById('no-custom').style.display = 'none';
					document.getElementById('yes-custom').style.display = '';
				} else {
					document.getElementById('yes-custom').style.display = 'none';
					document.getElementById('no-custom').style.display = '';
				}
			},
			restoreOptions = function () {
				chrome.storage.sync.get({
					additionalMenus: []
				}, function (items) {
					if (Array.isArray(items.additionalMenus)) {
						additionalMenus = items.additionalMenus || [];
					}
					rebuildMenu();
				});
			},
			showMainScreen = function () {
				document.getElementById('main-screen').style.display = '';
				document.getElementById('file-loader').style.display = 'none';
			},
			showFileSelector = function () {
				document.getElementById('main-screen').style.display = 'none';
				document.getElementById('file-loader').style.display = '';
			},
			initScreen = function () {
				document.getElementById('add').addEventListener('click', showFileSelector);
				document.getElementById('back').addEventListener('click', showMainScreen);

				document.getElementById('file-selector').addEventListener('change', function () {
					var element = this,
						oFReader = new FileReader(),
						fileName,
						submenuName,
						submenuField =  document.getElementById('submenu-name'),
						fileInfo;
					oFReader.onload = function (oFREvent) {
						try {
							var parsed = JSON.parse(oFREvent.target.result);
							additionalMenus.push({source: fileName, config: parsed, name: submenuName});
							submenuField.value = '';
							showMainScreen();
							rebuildMenu();
							saveOptions();
						} catch (exception) {
							updateStatus('Error reading ' + fileName);
						}
					};
					oFReader.onerror = function () {
						updateStatus('Error reading ' + fileName);
					};
					fileInfo = this.files[0];
					fileName = fileInfo.name;
					submenuName = submenuField.value && submenuField.value.trim();
					if (!submenuName) {
						updateStatus('Please provide submenu name!');
					} else {
						oFReader.readAsText(fileInfo, 'UTF-8');
					}
					element.value = '';
				});
				template = document.getElementById('template');
				list = template.parentElement;
				list.removeChild(template);
				restoreOptions();
				showMainScreen();
			};
	document.addEventListener('DOMContentLoaded', initScreen);
})();
