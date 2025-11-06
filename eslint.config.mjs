import js from '@eslint/js';
import globals from 'globals';

export default [
	js.configs.recommended,
	{
		files: ['**/*.js'],
		languageOptions: {
			ecmaVersion: 2020,
			sourceType: 'script',
			globals: {
				...globals.browser,
				...globals.node
			}
		},
		rules: {
			semi: ['error', 'always'],
			strict: ['error', 'global'],
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
				builtinGlobals: true
			}]
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
