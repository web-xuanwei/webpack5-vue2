const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackBar = require('webpackbar');
const CompressionPlugin = require("compression-webpack-plugin");
const { getConditionalLoader, readEnv } = require("./utils.js");
const config = readEnv("./.env.production");

module.exports = merge(webpackBaseConfig, {
  mode: "production",
  devtool: false,
  module: {
    rules: [
      {
        test: /\.less$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: false,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: false,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: false,
            },
          },
          getConditionalLoader(),
        ],
      },
    ]
  },
  plugins: [
    new DefinePlugin({
      BASE_URL: JSON.stringify("/"),
      "process.env": config,
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name]_[contenthash:8].css",
    }),
    new CleanWebpackPlugin(),
    new WebpackBar({
      reporters: ["fancy", "profile"],
      profile: true,
    }),
    ...(process.env.APP_GZIP === "ON"
      ? [
        new CompressionPlugin({
          filename: "[path][base].gz",
          threshold: 10240,
          minRatio: 0.8,
        }),
      ]
      : []),
  ],
  optimization: {
    moduleIds: "deterministic",
    runtimeChunk: true,
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            "default",
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
    splitChunks: {
      chunks: "all",
      minChunks: 3,
      maxAsyncRequests: 5,
      maxInitialRequests: 5,
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: "all",
          priority: 10, // 优先级
          enforce: true,
        },
        main: {
          test: /src/,
          name: "main",
          enforce: true,
        },
      },
    },
  },
})