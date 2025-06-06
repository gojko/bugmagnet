/*global chrome */
const ChromeConfigInterface = require('../lib/chrome-browser-interface'),
	initConfigWidget = require('../lib/init-config-widget'),
	initCredentialWidget = require('../lib/init-credential-widget');
document.addEventListener('DOMContentLoaded', function () {
	'use strict';
	const iface = new ChromeConfigInterface(chrome);
	initConfigWidget(document.getElementById('main'), iface);
	initCredentialWidget(document.getElementById('credentials'), iface);
});
