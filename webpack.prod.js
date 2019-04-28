const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');


module.exports = merge(common, {
  mode: 'production',
  plugins: [new webpack.EnvironmentPlugin({
    MDQ_URL: "https://md.thiss.io/entities/",
    SEARCH_URL: "https://md.thiss.io/entities/",
    LOGLEVEL: 'error'
  })]
});
