module.exports = {
  env: {
    node: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  ignorePatterns: ['/*.js', '/*.ts'],
  parser: '@typescript-eslint/parser',
  settings: {
    'import/resolver': { typescript: true },
  },
  plugins: ['@typescript-eslint', 'no-autofix', 'no-loops'],
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 11,
    sourceType: 'module',
  },
  rules: {
    eqeqeq: 'warn',
    'import/default': 'off',
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    'import/order': [
      'warn',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        alphabetize: { order: 'asc' },
      },
    ],
    'no-loops/no-loops': 'warn',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-undef': 'off',
    'no-var': 'warn',
    'no-autofix/prefer-const': 'warn',
    'prefer-arrow-callback': 'warn',
    'prefer-template': 'warn',
    'no-autofix/quotes': ['warn', 'single', { avoidEscape: true }],
    'require-await': 'warn',
    '@typescript-eslint/no-misused-promises': 'warn',
  },
};
