console { resolve } = require("./utils.js")

module.exports = {
  entry: {
    app: resolve("src/main.js")
  },
  output: {
    filename: "js/[name].[fullhash:8].js",
    path: path.resolve("dist"),
    publicPath: "/"
  },
  cache: {
    type: "filesystem",
    buildDependencies: {
      config: [resolve(".env.development"), resolve(".env.production")],
    },
  },
}