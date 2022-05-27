const { merge } = require("webpack-merge");
const webpackBaseConfig = require("./webpack.base.js");

module.exports = merge(webpackBaseConfig, {
  mode: "development",
  devtool: 'eval-cheap-module-source-map',
  
})