const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require("webpack");
const path = require('path');
const apiMocker = require('mocker-api');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(common, {
   mode: 'development',
   devtool: 'inline-source-map',
   devServer: {
       contentBase: './dist',
       port: 9000,
       before(ds) {
           apiMocker(ds, path.resolve('./mocker/index.js'), {
               proxy: {
                   '/entities/*': 'http://localhost:8080/'
               },
               changeHost: true
           })
       }
   },
   plugins: [
       //new BundleAnalyzerPlugin(),
       new webpack.EnvironmentPlugin({
       BASE_URL: 'http://localhost:9000/',
       MDQ_URL: 'http://localhost:8000/entities/',
       SEARCH_URL: '/entities/',
       LOGLEVEL: 'warn'
  })]
});
