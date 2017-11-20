module.exports = function initConfigWidget(domElement, browserInterface) {
	'use strict';
	let template,
		list,
		additionalMenus = [];
	const showErrorMsg = function (text) {
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
						browserInterface.saveOptions(additionalMenus);
					});
				});
				domElement.querySelector('[role=no-custom]').style.display = 'none';
				domElement.querySelector('[role=yes-custom]').style.display = '';
			} else {
				domElement.querySelector('[role=yes-custom]').style.display = 'none';
				domElement.querySelector('[role=no-custom]').style.display = '';
			}
		},
		showMainScreen = function () {
			domElement.querySelector('[role=main-screen]').style.display = '';
			domElement.querySelector('[role=file-loader]').style.display = 'none';
		},
		addSubMenu = function (textContent, submenuName, sourceName) {
			const parsed = JSON.parse(textContent);
			additionalMenus.push({source: sourceName, config: parsed, name: submenuName});
			showMainScreen();
			rebuildMenu();
			browserInterface.saveOptions(additionalMenus);
		},
		restoreOptions = function () {
			browserInterface.loadOptions(function (opts) {
				if (Array.isArray(opts)) {
					additionalMenus = opts;
				}	else {
					additionalMenus = [];
				}
				rebuildMenu();
			});
		},
		showFileSelector = function () {
			const submenuField =  domElement.querySelector('[role=submenu-name]'),
				configTextArea = domElement.querySelector('[role=custom-config-text]');
			submenuField.value = '';
			configTextArea.value = '';
			domElement.querySelector('[role=main-screen]').style.display = 'none';
			domElement.querySelector('[role=file-loader]').style.display = '';
		},
		initScreen = function () {
			const submenuField =  domElement.querySelector('[role=submenu-name]');
			domElement.querySelector('form').addEventListener('submit', e => e.preventDefault());
			domElement.querySelector('[role=close]').addEventListener('click', browserInterface.closeWindow);
			domElement.querySelector('[role=add]').addEventListener('click', showFileSelector);
			Array.from(domElement.querySelectorAll('[role=back]')).map(el => el.addEventListener('click', showMainScreen));
			domElement.querySelector('[role=select-file-cover]').addEventListener('click', () => {
				const event = new MouseEvent('click', {
					view: window,
					bubbles: true,
					cancelable: true
				});
				domElement.querySelector('[role=file-selector]').dispatchEvent(event);
			});
			domElement.querySelector('[role=file-selector]').addEventListener('change', function () {
				const element = this,
					fileInfo = this.files[0],
					fileName = fileInfo.name,
					submenuName = submenuField.value && submenuField.value.trim();
				if (!submenuName) {
					showErrorMsg('Please provide submenu name!');
					submenuField.value = '';
				} else {
					browserInterface.readFile(fileInfo).then(result => {
						addSubMenu(result, submenuName, fileName);
					}).catch(showErrorMsg);
				}
				element.value = '';
			});
			domElement.querySelector('[role=add-custom-config]').addEventListener('click', () => {
				const submenuName = submenuField.value && submenuField.value.trim(),
					customConfigText = 	domElement.querySelector('[role=custom-config-text]').value;
				if (!submenuName) {
					submenuField.value = '';
					return showErrorMsg('Please provide submenu name!');
				}
				if (!customConfigText) {
					return showErrorMsg('Please provide the configuration');
				}
				try {
					addSubMenu(customConfigText, submenuName, 'config');
				} catch (e) {
					showErrorMsg(e);
				}
			});
			template = domElement.querySelector('[role=template]');
			list = template.parentElement;
			list.removeChild(template);
			restoreOptions();
			showMainScreen();
		};
	initScreen();
};

