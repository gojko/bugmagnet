/*global chrome */
const ChromeConfigInterface = require('../lib/chrome-config-interface'),
	initConfigWidget = require('../lib/init-config-widget');
document.addEventListener('DOMContentLoaded', function () {
	'use strict';
	initConfigWidget(document.getElementById('main'), new ChromeConfigInterface(chrome));
});
