const merge = require('webpack-merge');
const webpackBaseCofnig = require('./webpack.base.config.js');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

module.exports = merge(webpackBaseCofnig, {
  plugins: [
    new FriendlyErrorsPlugin()
  ]
});
