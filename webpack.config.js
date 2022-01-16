const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/ts/main.ts',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, './src/*.html'),
          to: path.resolve(__dirname, './dist/[name][ext]'),
        },
        {
          from: path.resolve(__dirname, './src/css/*.css'),
          to: path.resolve(__dirname, './dist/css/[name][ext]'),
        },
      ],
    }),
  ],
  watchOptions: {
    ignored: /node_modules/,
  },
};
