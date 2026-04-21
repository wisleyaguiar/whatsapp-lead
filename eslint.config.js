import js from '@eslint/js';

export default [
  {
    ignores: ['node_modules/', 'dist/', 'build/', 'coverage/', 'playwright-report/', 'test-results/']
  },
  js.configs.recommended,
  {
    files: ['src/**/*.js', 'tests/**/*.js', '*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        AbortController: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        console: 'readonly',
        process: 'readonly'
      }
    }
  }
];
