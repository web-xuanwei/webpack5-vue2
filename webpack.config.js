const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require("vue-loader");
const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  entry: './src/main.js',
  output: {
    path: resolve('./dist'),
    filename: 'index_bundle.js',
    publicPath: '/'
  },
  resolve: {
    symlinks: false,
    extensions: [".vue", ".js", ".json"],
    alias: {
      vue$: "vue/dist/vue.esm.js",
      "@": resolve("src"),
    },
  },
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
  module:{
    rules:[
      {
        test: /\.js$/,
        include: resolve("src"),
        use: ["babel-loader"],
      },
      {
        test: /\.vue$/,
        use: ["vue-loader"],
      },
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: resolve('public/index.html'),
      title: 'w5v2',
      inject: "body",
      minify: {
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: true, // 删除空符与换符
        minifyCSS: true, // 压缩内联css
      },
    })
  ],
};