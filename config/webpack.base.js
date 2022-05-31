const { resolve, getExternals, getConditionalLoader, getCdnConfig } = require("./utils.js");
const CopyPlugin = require("copy-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    index: resolve("src/main.js")
  },
  output: {
    filename: "js/[name].[fullhash:8].js",
    path: resolve("dist"),
    publicPath: "/"
  },
  /**
   * 缓存生成的 webpack 模块和块以提高构建速度
   * 开发环境启用
   * 生产环境禁用
   */
  cache: {
    type: "filesystem",
    buildDependencies: {
      config: [resolve(".env.development"), resolve(".env.production")],
    },
  },
  /**
   * 不打包进代码 在线引用 待验证
   */
  externals: getExternals(),
  module: {
    rules:[
      {
        test: /\.js$/,
        include: resolve("src"),
        use: ["babel-loader", getConditionalLoader()],
      },
      {
        test: /\.(png|gif|jpe?g|svg)$/,
        type: "asset", // webpack5使用内置静态资源模块，且不指定具体，根据以下规则使用
        generator: {
          filename: "img/[name][ext]", // ext本身会附带点，放入img目录下
        },
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 超过10kb的进行复制，不超过则直接使用base64
          },
        },
      },
      {
        test: /\.(ttf|woff2?|eot)$/,
        type: "asset/resource", // 指定静态资源类复制
        generator: {
          filename: "font/[name].[ext]", // 放入font目录下
        },
      },
      {
        test: /\.vue$/,
        use: ["vue-loader", getConditionalLoader()],
      },
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: resolve("public/index.html"),
      inject: "body",
      minify: {
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: true, // 删除空符与换符
        minifyCSS: true, // 压缩内联css
      },
      cdnConfig: getCdnConfig(),
    }),
    // new CopyPlugin({
    //   patterns: [
    //     {
    //       from: resolve("public"),
    //       to: resolve("dist"),
    //       globOptions: {
    //         dot: true,
    //         gitignore: true,
    //         ignore: ["index.html"],
    //       },
    //     },
    //   ],
    // }),
  ],
  resolve: {
    symlinks: false,
    extensions: [".vue", ".js", ".json"],
    alias: {
      vue$: "vue/dist/vue.esm.js",
      "@": resolve("src"),
    },
  },
}