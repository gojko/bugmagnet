/*global module*/
/*
Installing Grunt and associated contributions

- once only per machine
install node and npm:
	http://nodejs.org/download/
install grunt cli:
	npm install -g grunt-cli

- per project
npm install grunt-contrib-jasmine --save-dev

*/

module.exports = function (grunt) {
	'use strict';
	grunt.initConfig({
		jasmine: {
			all: {
				src: ['src/*.js'],
				options: {
					template: 'test-lib/grunt.tmpl',
					outfile: 'SpecRunner.html',
					summary: true,
					display: 'short',
					keepRunner: true,
					specs: [
						'test/*.js',
					],
					helpers: [
						'test-lib/fake-chrome-api.js',
					]
				}
			}
		}
	});
	// Load local tasks.
	grunt.loadNpmTasks('grunt-contrib-jasmine');
};
