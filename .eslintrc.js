module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        'plugin:react/recommended',
        'plugin:react-hooks/recommended'
    ],
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
        "react/jsx-no-bind": 0,
        "no-unused-vars" : 0,
        "react/prop-types": "off",
        "react/no-unescaped-entities": "off",
        "react/jsx-uses-react" : 2,
        "react/react-in-jsx-scope": 2,
        "react/no-children-prop": 2,

    }
};
