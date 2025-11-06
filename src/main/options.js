/*global chrome */
'use strict';
const ChromeConfigInterface = require('../lib/chrome-browser-interface'),
	initConfigWidget = require('../lib/init-config-widget');
document.addEventListener('DOMContentLoaded', () => {
	initConfigWidget(document.getElementById('main'), new ChromeConfigInterface(chrome));
});
