const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require("webpack");
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(common, {
   mode: 'development',
   devtool: 'inline-source-map',
   plugins: [
       //new BundleAnalyzerPlugin(),
       new webpack.EnvironmentPlugin({
       MDQ_URL: 'http://localhost:8080/entities/',
       SEARCH_URL: '/entities/',
       LOGLEVEL: 'warn'
  })]
});
