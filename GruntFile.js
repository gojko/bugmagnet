/*global module*/

module.exports = function (grunt) {
	'use strict';
	grunt.initConfig({
		clean: ['pack'],
		copy: {
			main: {
				files: [
					{expand: true, cwd: 'template/common', src: ['**'], dest: 'pack/chrome/'},
					{expand: true, cwd: 'template/chrome', src: ['**'], dest: 'pack/chrome/'}
				]
			}
		},
		concat: {
			chrome_extension_js: {
				src: ['src/bugmagnet.js', 'src/chrome-menubuilder.js', 'src/chrome-extension.js'],
				dest: 'pack/chrome/extension.js'
			},
			chrome_context_js: {
				src: ['src/bugmagnet.js', 'src/chrome-content-script.js'],
				dest: 'pack/chrome/content-script.js'
			}
		},
		compress: {
			main: {
				options: {
						archive: function () {
							var cfg = grunt.file.readJSON('template/chrome/manifest.json');
							return 'pack/chrome-' + cfg.version + '.zip';
						}
				},
				files: [
					{expand:true, cwd: 'pack/chrome/', src: ['**'], dest: ''}
				]
			}
		},
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
						'test/*.js'
					],
					helpers: [
						'test-lib/fake-chrome-api.js'
					]
				}
			}
		}
	});
	// Load local tasks.
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.registerTask('package', ['jasmine', 'clean', 'copy', 'concat:chrome_extension_js', 'concat:chrome_context_js', 'compress']);
};
