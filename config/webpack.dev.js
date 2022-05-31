const { merge } = require("webpack-merge");
const webpackBaseConfig = require("./webpack.base.js");
const { DefinePlugin } = require("webpack");
const { getConditionalLoader, readEnv } = require("./utils.js");
const config = readEnv("./.env.development");

module.exports = merge(webpackBaseConfig, {
  mode: "development",
  devtool: 'eval-cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.less$/i,
        use: ["style-loader", "css-loader", "postcss-loader", "less-loader", getConditionalLoader()],
      },
    ],
  },
  plugins:[
    new DefinePlugin({
      BASE_URL: JSON.stringify("/"),
      "process.env": config,
    }),
  ],
  devServer: {
    port: "auto",
    hot: true,
    host: "localhost",
    historyApiFallback: true, //history路由错误问题
    client: {
      logging: "warn",
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
  stats: "errors-warnings",
})