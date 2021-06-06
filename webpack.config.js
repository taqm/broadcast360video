const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    streamer: './src/streamer.ts',
    listener: './src/listener.ts',
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name]_[fullhash].js',
  },
  module: {
    rules: [
      {
        test: /.ts/,
        loader: 'esbuild-loader',
        options: {
          loader: 'ts',
          target: 'es2015',
          tsconfigRaw: require('./tsconfig.json'),
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.SKYWAY_API_KEY': JSON.stringify(process.env.SKYWAY_API_KEY),
    }),
    new HtmlWebpackPlugin({
      template: 'src/pages/index.html',
      chunks: ['streamer'],
      inject: 'body',
    }),
    new HtmlWebpackPlugin({
      template: 'src/pages/listener.html',
      chunks: ['listener'],
      inject: 'body',
      filename: 'listener.html',
    }),
  ],
};
