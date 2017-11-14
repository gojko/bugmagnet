/*global require, module, __dirname, process, console */
const path = require('path'),
	recursiveLs = require('fs-readdir-recursive'),
	entries = {},
	testFilter = process.env.npm_package_config_test_filter,
	buildEntries = function (dir) {
		'use strict';
		recursiveLs(dir).filter(name => /.+-spec\.js/.test(name)).forEach(function (f) {
			if (!testFilter || f.indexOf(testFilter) >= 0) {
				entries[f] = path.join(dir, f);
			}
		});

	};
console.log('testFilter', testFilter);
//buildEntries('core');
buildEntries(path.resolve(__dirname, 'test'));
console.log('entries', entries);
module.exports = {
	entry: entries,
	devtool: 'source-map',
	output: {
		path: path.resolve(__dirname, 'testem', 'compiled'),
		filename: '[name]'
	}
};
