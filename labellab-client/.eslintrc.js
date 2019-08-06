module.exports = {
    env: {
      browser: true,
      commonjs: true,
      es6: true
    },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'react-app',
      'plugin:prettier/recommended',
      'prettier/react'
    ],
    parser: 'babel-eslint',
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module'
    },
    rules: {
      'no-unused-vars': [
        'off',
        { vars: 'all', args: 'after-used', ignoreRestSiblings: false }
      ],
      'no-console': 'off',
      'prettier/prettier': ['warn', { semi: false, singleQuote: true }]
    },
    settings: {
      react: {
        createClass: 'createReactClass',
        pragma: 'React',
        version: 'detect',
        flowVersion: '0.53'
      }
    }
  }