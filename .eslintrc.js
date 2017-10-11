module.exports = {
  env: {
    browser: true
  },
  parser: 'babel-eslint',
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-native/all'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  plugins: ['react', 'react-native', 'prettier'],
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],

    'prettier/prettier': ['error', { singleQuote: true }]
  }
};
