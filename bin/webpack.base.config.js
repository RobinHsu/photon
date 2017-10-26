const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const base = path.join(__dirname, '../www/static');

module.exports = {
  devtool: 'source-map',
  entry: {
    admin: `${base}/src/admin/main.js`,
    vendor: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-redux',
      'redux',
      'redux-saga',
      'classnames',
      'antd'
    ]
  },
  output: {
    path: `${base}/dist`,
    filename: 'js/[name].js',
    publicPath: '/static/dist/',
    chunkFilename: 'js/[name].js'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      'components': `${base}/src/admin/components`,
      'api': `${base}/src/admin/api`
    }
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
        presets: ['react', ['env', {
          loose: true,
          module: false
        }], 'stage-0'],
        plugins: [
          'transform-runtime',
          'transform-decorators-legacy',
          ['import', {
            'libraryName': 'antd',
            'style': 'css'
          }]
        ]
      },
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        use: [
          'css-loader',
          'postcss-loader'
        ]
      })
    }, {
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        use: 'css-loader!sass-loader?precision=8!postcss-loader'
      })
    }, {
      test: /\.((woff2?svg)(\?v=[0-9]\.[0-9]\.[0-9]))|(woff2?|svg|eot|ttf)$/,
      loader: 'url-loader',
      options: {
        limit: 10240,
        name: 'fonts/[name].[hash:8].[ext]'
      }
    }, {
      test: /\.(jpe?g|png|gif|ico)$/,
      loader: 'url-loader',
      options: {
        limit: 10240,
        name: 'img/[name].[hash:8].[ext]'
      }
    }]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'css/[name].css',
      allChunks: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      chunks: ['admin', 'verdor']
    })
  ]
};
