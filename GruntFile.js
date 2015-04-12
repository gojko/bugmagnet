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
					{expand: true, cwd: 'template/firefox', src: ['**'], dest: 'pack/firefox/'},
					{expand: true, cwd: 'test/firefox', src: ['**'], dest: 'pack/firefox/test/'}
				]
			}
		},
		concat: {
			chrome_extension_js: {
				src: ['template/js/head.txt', 'src/chrome/bugmagnet.js', 'src/common/processConfig.js', 'src/chrome/chrome-menubuilder.js', 'src/chrome/chrome-extension.js', 'template/js/foot.txt'],
				dest: 'pack/chrome/extension.js'
			},
			chrome_context_js: {
				src: ['template/js/head.txt', 'src/chrome/bugmagnet.js', 'src/common/executeRequest.js', 'src/chrome/chrome-content-script.js', 'template/js/foot.txt'],
				dest: 'pack/chrome/content-script.js'
			},
			firefox: {
				files: {
					'pack/firefox/lib/common.js': ['src/firefox/bugmagnet.js', 'src/common/processConfig.js', 'src/firefox/common.js'],
					'pack/firefox/lib/main.js': ['src/firefox/menuBuilder.js', 'src/firefox/firefox-addon.js'],
					'pack/firefox/data/context-element.js': ['src/firefox/bugmagnet.js', 'src/common/executeRequest.js', 'src/firefox/context-element.js']
				}
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
				src: ['src/*.js', 'src/chrome/*.js'],
				options: {
					template: 'test-lib/grunt.tmpl',
					outfile: 'SpecRunner.html',
					summary: true,
					display: 'short',
					keepRunner: true,
					specs: [
						'test/chrome/*.js'
					],
					helpers: [
						'test-lib/*.js'
					]
				}
			}
		},
		jasmine_firefoxaddon: {
			all: {
				src: ['test/*.js', 'test-lib/*.js'],
				options: {
					paths: ['test/process-config-text-spec.js'],
					keepRunner: true
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
	grunt.loadNpmTasks('grunt-jasmine-firefoxaddon');
	grunt.registerTask('package-chrome', ['jasmine', 'clean', 'copy:chrome', 'concat:chrome_extension_js', 'concat:chrome_context_js', 'compress']);
	grunt.registerTask('package-firefox', ['clean', 'copy:firefox', 'concat:firefox']);
};
