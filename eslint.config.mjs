import js from '@eslint/js';
import globals from 'globals';

export default [
	js.configs.recommended,
	{
		files: ['**/*.js'],
		languageOptions: {
			ecmaVersion: 6,
			sourceType: 'script',
			globals: {
				...globals.browser,
				...globals.node
			}
		},
		rules: {
			semi: ['error', 'always'],
			strict: ['error', 'function'],
			'no-unused-vars': 'error',
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
			'no-prototype-builtins': 'off'
		}
	},
	{
		files: ['test/**/*.js'],
		languageOptions: {
			globals: {
				...globals.jasmine
			}
		},
		rules: {
			'one-var': 'off',
			'no-redeclare': 'off',
			'no-unused-vars': 'off'
		}
	}
];
