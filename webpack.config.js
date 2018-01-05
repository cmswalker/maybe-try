const path = require('path');
const webpack = require('webpack');

const ENV = process.env.NODE_ENV || 'development';
const isProduction = ENV === 'production';

console.log('BUILDING WEBPACK FOR ENV', ENV, isProduction);

const config = {
  context: __dirname, // string (absolute path!)

  entry: {
    'maybe-try': path.join(__dirname, 'lib', 'maybe-try')
  },

  output: {
    filename: '[name].js',
    path: path.join(__dirname, '/dist/'),
    publicPath: '/',
    chunkFilename: '[id].chunk.js'
  },

  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: [/node_modules/],
        loader: 'babel-loader'
      }
    ]
  },

  target: 'web',
  stats: 'errors-only',

  plugins: [],
  externals: []
};

if (isProduction) {
  config.output = {
    filename: 'maybe-try.js',
    path: path.join(__dirname, '/dist/'),
    publicPath: '/',
    library: 'maybeTry',
    libraryTarget: 'umd',
    umdNamedDefine: true
  };
}

console.log('Wepback Config', config);

module.exports = config;
