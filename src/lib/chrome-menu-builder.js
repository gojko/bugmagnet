export function ChromeMenuBuilder(chrome) {
	let itemValues = {},
		itemHandlers = {},
		menuIdCounter = 0;
	const instance = this,
		contexts = ['editable'],
		getNextId = () => `menu-${menuIdCounter++}`;
	instance.rootMenu = function (title) {
		const id = getNextId();
		return chrome.contextMenus.create({id, 'title': title, 'contexts': contexts});
	};
	instance.subMenu = function (title, parentMenu) {
		const id = getNextId();
		return chrome.contextMenus.create({id, 'title': title, 'parentId': parentMenu, 'contexts': contexts});
	};
	instance.separator = function (parentMenu) {
		const id = getNextId();
		return chrome.contextMenus.create({id, 'type': 'separator', 'parentId': parentMenu, 'contexts': contexts});
	};
	instance.menuItem = function (title, parentMenu, clickHandler, value) {
		const id = getNextId();
		chrome.contextMenus.create({id, 'title': title, 'parentId': parentMenu, 'contexts': contexts});
		itemValues[id] = value;
		itemHandlers[id] = clickHandler;
		return id;
	};
	instance.choice  = function (title, parentMenu, clickHandler, value) {
		const id = getNextId();
		chrome.contextMenus.create({id, type: 'radio', checked: value, title: title, parentId: parentMenu, 'contexts': contexts});
		itemHandlers[id] = clickHandler;
		return id;
	};
	instance.removeAll = function () {
		itemValues = {};
		itemHandlers = {};
		menuIdCounter = 0;
		return new Promise(resolve => chrome.contextMenus.removeAll(resolve));
	};
	chrome.contextMenus.onClicked.addListener((info, tab) => {
		const itemId = info && info.menuItemId;
		if (itemHandlers[itemId]) {
			itemHandlers[itemId](tab.id, itemValues[itemId]);
		}
	});
	instance.selectChoice = function (menuId) {
		return chrome.contextMenus.update(menuId, {checked: true});
	};
};
