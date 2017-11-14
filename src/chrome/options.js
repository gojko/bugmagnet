/*global chrome */
const ChromeConfigInterface = require('../chrome-config-interface'),
	initConfigWidget = require('../init-config-widget');
document.addEventListener('DOMContentLoaded', function () {
	'use strict';
	initConfigWidget(document.getElementById('main'), new ChromeConfigInterface(chrome));
});
