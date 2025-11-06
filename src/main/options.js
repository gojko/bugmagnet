import { ChromeBrowserInterface } from '../lib/chrome-browser-interface.js';
import { initConfigWidget } from '../lib/init-config-widget.js';

document.addEventListener('DOMContentLoaded', () => {
	initConfigWidget(document.getElementById('main'), new ChromeBrowserInterface(chrome));
});
