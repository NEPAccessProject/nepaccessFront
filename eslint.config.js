const reactRecommended = require('eslint-plugin-react/configs/recommended');
const globals = require('globals');

module.exports = {
  ...reactRecommended,
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  "globals": {
    ...globals.browser
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "plugins": [
    "react",
  ],
  "rules": {
    "react/no-deprecated": "warn",
    "react/jsx-no-bind": "warn",
    "no-unused-vars": 0,//[TODO] Set to error prior to merging to remove kruft
    "react/no-unused-vars": 0,
    "react/prop-types": 0,
    "react/no-unescaped-entities": 0,
    "react/jsx-uses-react": "error",
    "react/react-in-jsx-scope": "error",
    "react/no-children-prop": 0,

  }
};
