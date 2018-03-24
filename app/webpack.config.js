var path = require('path');
var webpack = require('webpack');

var javascriptEntryPath = path.resolve(__dirname, 'src', 'index.js');
var buildPath = path.resolve(__dirname, 'public', 'build');

module.exports = {
  entry: [
    'webpack-hot-middleware/client?reload=true',
    javascriptEntryPath
  ],
  output: {
    path: buildPath,
    filename: 'bundle.js',
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loaders: ['babel-loader?presets[]=es2015'],
    }, {
      test: /\.html$/,
      loader: 'file?name=[name].[ext]',
    }],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
}
