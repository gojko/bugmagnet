/*global require, module, __dirname, process, console */
const path = require('path'),
	recursiveLs = require('fs-readdir-recursive'),
	entries = {},
	buildEntries = function (dir) {
		'use strict';
		recursiveLs(dir).forEach(function (f) {
			entries[f] = path.join(dir, f);
		});
	};
//buildEntries('core');
buildEntries(path.resolve(__dirname, 'src', 'main'));
module.exports = {
	entry: entries,
	output: {
		path: path.resolve(__dirname, 'pack'),
		filename: '[name]'
	}
};
