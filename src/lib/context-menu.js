import { injectValueRequestHandler } from './inject-value-request-handler.js';
import { pasteRequestHandler } from './paste-request-handler.js';
import { copyRequestHandler } from './copy-request-handler.js';

export function ContextMenu(standardConfig, browserInterface, menuBuilder, processMenuObject, pasteSupported) {
	let handlerType = 'injectValue';
	const instance = this,
		handlerMenus = {},
		handlers = {
			injectValue: injectValueRequestHandler,
			paste: pasteRequestHandler,
			copy: copyRequestHandler
		},
		onClick = function (tabId, itemMenuValue) {
			const falsyButNotEmpty = function (v) {
					return !v && typeof (v) !== 'string';
				},
				toValue = function (value) {
					if (typeof (value) === 'string') {
						return { '_type': 'literal', 'value': value};
					}
					return value;
				},
				requestValue = toValue(itemMenuValue);
			if (falsyButNotEmpty(requestValue)) {
				return;
			};
			return handlers[handlerType](browserInterface, tabId, requestValue);
		},
		turnOnPasting = function () {
			return browserInterface.requestPermissions(['clipboardRead', 'clipboardWrite'])
				.then(() => handlerType = 'paste')
				.catch(() => {
					browserInterface.showMessage('Could not access clipboard');
					menuBuilder.selectChoice(handlerMenus.injectValue);
				});
		},
		turnOffPasting = function () {
			handlerType = 'injectValue';
			return browserInterface.removePermissions(['clipboardRead', 'clipboardWrite']);
		},
		turnOnCopy = function () {
			handlerType = 'copy';
		},
		loadAdditionalMenus = function (additionalMenus, rootMenu) {
			if (additionalMenus && Array.isArray(additionalMenus) && additionalMenus.length) {
				additionalMenus.forEach((configItem) => {
					const object = {};
					object[configItem.name] = configItem.config;
					processMenuObject(object, menuBuilder, rootMenu, onClick);
				});
			}
		},
		addGenericMenus = function (rootMenu) {
			menuBuilder.separator(rootMenu);
			if (pasteSupported) {
				const modeMenu = menuBuilder.subMenu('Operational mode', rootMenu);
				handlerMenus.injectValue = menuBuilder.choice('Inject value', modeMenu, turnOffPasting, true);
				handlerMenus.paste = menuBuilder.choice('Simulate pasting', modeMenu, turnOnPasting);
				handlerMenus.copy = menuBuilder.choice('Copy to clipboard', modeMenu, turnOnCopy);
			}
			menuBuilder.menuItem('Customise menus', rootMenu, browserInterface.openSettings);
			menuBuilder.menuItem('Help/Support', rootMenu, () => browserInterface.openUrl('https://bugmagnet.org/contributing.html'));
		},
		rebuildMenu = function (options) {
			const rootMenu =  menuBuilder.rootMenu('Bug Magnet'),
				additionalMenus = options && options.additionalMenus,
				skipStandard = options && options.skipStandard;
			if (!skipStandard) {
				processMenuObject(standardConfig, menuBuilder, rootMenu, onClick);
			}
			if (additionalMenus) {
				loadAdditionalMenus(additionalMenus, rootMenu);
			}
			addGenericMenus(rootMenu);
		},
		wireStorageListener = function () {
			browserInterface.addStorageListener(() => {
				return menuBuilder.removeAll()
					.then(browserInterface.getOptionsAsync)
					.then(rebuildMenu);
			});
		};
	instance.init = function () {
		return browserInterface.getOptionsAsync()
			.then(rebuildMenu)
			.then(wireStorageListener);
	};
};

