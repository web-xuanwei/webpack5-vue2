const path = require("path");
const cdn = require("../dependencies.cdn");

module.exports = {
  resolve: (dir) => {
    return path.join(__dirname, "..", dir);
  },
  readEnv: (file) => {
    let { parsed } = require("dotenv").config({ path: file });
    Object.keys(parsed).forEach((key) => (parsed[key] = JSON.stringify(parsed[key])));
    return parsed;
  },
  getExternals: () => {
    let externals = {};
    if (process.env.APP_CDN === "ON") {
      cdn.forEach((config) => {
        externals[config.name] = config.library;
      });
    }
    return externals;
  },
  getConditionalLoader: () => {
    return {
      loader: "js-conditional-compile-loader",
      // 插件提供了IFDEBUG和IFTRUE两个条件编译指令。
      // 用法是：在js代码的任意地方以/*IFDEBUG或/*IFTRUE_xxx开头，以FIDEBUG*/或FITRUE_xxx*/结尾，中间是被包裹的js代码。
      // xxx是在webpack中指定的options条件属性名，比如myFlag。
      options: {
        isDebug: process.env.NODE_ENV === "development", 
        // 如果isDebug === false，则所有/\*IFDEBUG 和 FIDEBUG\*/之间的代码都会被移除。 其他情况，这些代码则会被保留。
        // 示例如下
        /*IFDEBUG
        let tsFunc = function(arr: number[]) : string {
            alert('Hi~');
            return arr.length.toString()
        }
        FIDEBUG*/
        offCDN: process.env.APP_CDN === "OFF", // any prop name you want, used for /* FITRUE_OFFCDN ...js code... FITRUE_OFFCDN */
      },
    }
  },
  getCdnConfig: () => {
    let cdnConfig = {
      js: [],
      css: [],
    };
    if (process.env.APP_CDN === "ON") {
      cdn.forEach((config) => {
        if (config.js) cdnConfig.js.push(config.js);
        if (config.css) cdnConfig.css.push(config.css);
      });
    }
    return cdnConfig;
  },
}