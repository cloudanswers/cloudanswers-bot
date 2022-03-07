module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module'
  },
  root: true,
  env: {
    commonjs: true,
    es6: true,
    node: true,
    browser: false
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended'
  ],
  plugins: ['@typescript-eslint', 'prettier', 'simple-import-sort'],
  rules: {
    // Errors
    // To enforce using type for object type definitions, can be type or interface
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'prettier/prettier': 'error',
    // Warnings
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-console': 'warn'
    // Turned Off
    // ...
  }
};
