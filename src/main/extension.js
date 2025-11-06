import { ContextMenu } from '../lib/context-menu.js';
import { ChromeMenuBuilder } from '../lib/chrome-menu-builder.js';
import { ChromeBrowserInterface } from '../lib/chrome-browser-interface.js';
import { processMenuObject } from '../lib/process-menu-object.js';
import standardConfig from '../../template/config.json';

const isFirefox = (typeof browser !== 'undefined');
new ContextMenu(
	standardConfig,
	new ChromeBrowserInterface(chrome),
	new ChromeMenuBuilder(chrome),
	processMenuObject,
	!isFirefox
).init();

