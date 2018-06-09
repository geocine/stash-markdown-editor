const ClosureCompilerPlugin = require('webpack-closure-compiler');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

module.exports = {
  mode: 'production',
  entry: ['./js/script.js'],
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      inject: 'body',
      inlineSource: '.(js|css)$' // embed all javascript and css inline
    }),
    new ClosureCompilerPlugin({
      compiler: {
        language_in: 'ECMASCRIPT6',
        language_out: 'ECMASCRIPT5',
        compilation_level: 'ADVANCED',
        externs: ['./js/externs.js']
      },
      concurrency: 3,
    }),
    new HtmlWebpackInlineSourcePlugin()
  ]
}