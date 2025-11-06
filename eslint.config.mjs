import js from '@eslint/js';
import globals from 'globals';

export default [
	js.configs.recommended,
	{
		files: ['src/**/*.js'],
		languageOptions: {
			ecmaVersion: 2024,
			sourceType: 'module',
			globals: {
				...globals.browser,
				chrome: 'readonly',
				browser: 'readonly'
			}
		},
		rules: {
			semi: ['error', 'always'],
			'no-unused-vars': ['error', {
				caughtErrors: 'none'
			}],
			indent: ['error', 'tab'],
			'no-const-assign': 'error',
			'one-var': 'error',
			'prefer-const': 'error',
			'no-var': 'error',
			'no-plusplus': ['off'],
			quotes: ['error', 'single', {
				avoidEscape: true,
				allowTemplateLiterals: true
			}],
			'prefer-arrow-callback': 'error',
			'no-shadow': ['error', {
				builtinGlobals: false
			}]
		}
	},
	{
		files: ['test/**/*.js'],
		languageOptions: {
			ecmaVersion: 2024,
			sourceType: 'module',
			globals: {
				...globals.browser,
				...globals.jasmine
			}
		},
		rules: {
			semi: ['error', 'always'],
			'no-unused-vars': 'off',
			indent: ['error', 'tab'],
			'no-const-assign': 'error',
			'one-var': 'off',
			'prefer-const': 'error',
			'no-var': 'error',
			'no-plusplus': ['off'],
			quotes: ['error', 'single', {
				avoidEscape: true,
				allowTemplateLiterals: true
			}],
			'prefer-arrow-callback': 'error',
			'no-shadow': ['error', {
				builtinGlobals: false
			}],
			'no-redeclare': 'off'
		}
	}
];
