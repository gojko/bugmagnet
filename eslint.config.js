module.exports = [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 6,
      sourceType: 'script',
      globals: {
        chrome: 'readonly',
        browser: 'readonly',
        module: 'writable',
        require: 'readonly'
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
      'no-plusplus': 'off',
      quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }]
    }
  }
];
