// var path = require('path');
// var HtmlWebpackPlugin = require('html-webpack-plugin');

// module.exports = {
//     entry: './src/index.js',
//     devServer: {

//         https: true,
//         historyAPIFallback: true,
//         hot: true,
//         liveReload: true,
//     },
//     publicPath: '/',
//     historyAPIFallback: true,
//     env: {
//         'browser': true,
//         'es2021': true
//     },
//     'extends': [
//         'eslint:recommended',
//         'plugin:react/recommended',
//         'plugin:react-hooks/recommended'
//     ],
//     'parserOptions': {
//         'ecmaFeatures': {
//             'jsx': true
//         },
//         'ecmaVersion': 12,
//         'sourceType': 'module'
//     },
//     'plugins': [
//         'react',
//     ],
//     'rules': {

//     }
// }
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const { Dashboard } = require('webpack-dashboard');
const { webpack } = require('webpack');
var DashboardPlugin = require('webpack-dashboard/plugin');
var HotReloadPlugin = require('webpack-hot-middleware/client');
const { plugins } = require('chart.js');

module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended'
    ],
    'parserOptions': {
        'ecmaFeatures': {
            'jsx': true
        },
        'ecmaVersion': 12,
        'sourceType': 'module'
    },
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'index_bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            { test: /\.(js)$/, use: 'babel-loader' },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] }
        ]
    },
    devTool: true,
    plugins: [new webpack.SourceMapDevToolPlugin({})],
    devServer: {
        historyApiFallback: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: '/index.html'
        }),
        new DashboardPlugin(),
        new webpack.HotModuleReplacementPlugin(),

    ]
};