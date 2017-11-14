module.exports = function initConfigWidget(domElement, configInterface) {
	'use strict';
	let template,
		list,
		additionalMenus = [];
	const updateStatus = function (text) {
			const status = domElement.querySelector('[role=status]');
			status.textContent = text;
			setTimeout(function () {
				status.textContent = '';
			}, 1500);
		},
		rebuildMenu = function () {
			list.innerHTML = '';
			if (additionalMenus && additionalMenus.length) {
				additionalMenus.forEach(function (configItem, index) {
					const clone = template.cloneNode(true);
					list.appendChild(clone);
					clone.querySelector('[role=name]').textContent = configItem.name;
					clone.querySelector('[role=source]').textContent = configItem.source;
					clone.querySelector('[role=remove]').addEventListener('click', function () {
						additionalMenus.splice(index, 1);
						rebuildMenu();
						configInterface.saveOptions(additionalMenus);
					});
				});
				domElement.querySelector('[role=no-custom]').style.display = 'none';
				domElement.querySelector('[role=yes-custom]').style.display = '';
			} else {
				domElement.querySelector('[role=yes-custom]').style.display = 'none';
				domElement.querySelector('[role=no-custom]').style.display = '';
			}
		},
		restoreOptions = function () {
			configInterface.loadOptions(function (opts) {
				if (Array.isArray(opts)) {
					additionalMenus = opts;
				}	else {
					additionalMenus = [];
				}
				rebuildMenu();
			});
		},
		showMainScreen = function () {
			domElement.querySelector('[role=main-screen]').style.display = '';
			domElement.querySelector('[role=file-loader]').style.display = 'none';
		},
		showFileSelector = function () {
			domElement.querySelector('[role=main-screen]').style.display = 'none';
			domElement.querySelector('[role=file-loader]').style.display = '';
		},
		initScreen = function () {
			domElement.querySelector('[role=add]').addEventListener('click', showFileSelector);
			domElement.querySelector('[role=close]').addEventListener('click', function () {
				window.close();
			});
			domElement.querySelector('[role=back]').addEventListener('click', showMainScreen);

			domElement.querySelector('[role=file-selector]').addEventListener('change', function () {
				const element = this,
					oFReader = new FileReader(),
					submenuField =  domElement.querySelector('[role=submenu-name]');
				let fileName, submenuName, fileInfo;//eslint-disable-line
				oFReader.onload = function (oFREvent) {
					try {
						const parsed = JSON.parse(oFREvent.target.result);
						additionalMenus.push({source: fileName, config: parsed, name: submenuName});
						submenuField.value = '';
						showMainScreen();
						rebuildMenu();
						configInterface.saveOptions(additionalMenus);
					} catch (exception) {
						updateStatus('Error reading ' + fileName);
					}
				};
				oFReader.onerror = function () {
					updateStatus('Error reading ' + fileName);
				};
				fileInfo = this.files[0];//eslint-disable-line
				fileName = fileInfo.name;//eslint-disable-line
				submenuName = submenuField.value && submenuField.value.trim();
				if (!submenuName) {
					updateStatus('Please provide submenu name!');
				} else {
					oFReader.readAsText(fileInfo, 'UTF-8');
				}
				element.value = '';
			});
			template = domElement.querySelector('[role=template]');
			list = template.parentElement;
			list.removeChild(template);
			restoreOptions();
			showMainScreen();
		};
	initScreen();
};

