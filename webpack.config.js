const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: "source-map",
  entry: [
    'babel-polyfill',
    'react-hot-loader/patch',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/public/'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,         // Match both .js and .jsx files
        exclude: /node_modules/,
        loader: "babel-loader",
        query:
          {
            presets:["react", "es2015", "stage-0"],
            plugins: ["react-html-attrs", "transform-class-properties", "transform-decorators-legacy"]
          }
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          //resolve-url-loader may be chained before sass-loader if necessary
          use: ['css-loader', 'sass-loader']
        })
      }

    ]
  },
  plugins: [
    new ExtractTextPlugin("style.css"),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
};
