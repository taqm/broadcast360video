const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.jsx',
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name]_[fullhash].js',
  },
  module: {
    rules: [
      {
        test: /.jsx?/,
        loader: 'esbuild-loader',
        options: {
          loader: 'jsx',
          target: 'es2015',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.SKYWAY_API_KEY': JSON.stringify(process.env.SKYWAY_API_KEY),
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: 'body',
    }),
  ],
};
