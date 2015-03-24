/*global module*/

module.exports = function (grunt) {
	'use strict';
	grunt.initConfig({
		clean: ['pack'],
		copy: {
			chrome: {
				files: [
					{expand: true, cwd: 'template/common', src: ['**'], dest: 'pack/chrome/'},
					{expand: true, cwd: 'template/chrome', src: ['**'], dest: 'pack/chrome/'}
				]
			},
			firefox: {
				files: [
					{expand: true, cwd: 'template/common', src: ['**'], dest: 'pack/firefox/data/'},
					{expand: true, cwd: 'template/firefox', src: ['**'], dest: 'pack/firefox/'}
				]
			}
		},
		concat: {
			chrome_extension_js: {
				src: ['template/js/head.txt', 'src/bugmagnet.js', 'src/chrome/chrome-menubuilder.js', 'src/chrome/chrome-extension.js', 'template/js/foot.txt'],
				dest: 'pack/chrome/extension.js'
			},
			chrome_context_js: {
				src: ['template/js/head.txt', 'src/bugmagnet.js', 'src/chrome/chrome-content-script.js', 'template/js/foot.txt'],
				dest: 'pack/chrome/content-script.js'
			},
			firefox_addon_js: {
				src: ['template/js/head.txt', 'src/bugmagnet.js', 'src/firefox/menuBuilder.js', 'src/firefox/firefox-addon.js', 'template/js/foot.txt'],
				dest: 'pack/firefox/lib/main.js'
			},
			firefox_context_js: {
				src: ['template/js/head.txt', 'src/bugmagnet.js', 'src/firefox/context-element.js', 'template/js/foot.txt'],
				dest: 'pack/firefox/data/context-element.js'
			}
		},
		compress: {
			chrome: {
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
				src: ['src/*.js', 'src/*/*.js'],
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
						'test-lib/*.js'
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
	grunt.registerTask('package-chrome', ['jasmine', 'clean', 'copy:chrome', 'concat:chrome_extension_js', 'concat:chrome_context_js', 'compress']);
	grunt.registerTask('package-firefox', ['jasmine', 'clean', 'copy:firefox', 'concat:firefox_addon_js', 'concat:firefox_context_js']);
};
