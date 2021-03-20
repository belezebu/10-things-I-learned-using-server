const { join } = require("path");
const { sync } = require("glob");
const { resolve, parse} = require("path")
const TerserPlugin = require("terser-webpack-plugin");

const getEntries = filepath => {
  return sync(filepath).reduce((acc, filename) => {
    const name = parse(filename).name;
    acc[name] = ["source-map-support/register", filename];
    return acc;
  }, {});
};

const APP_ENTRY_FILEPATH = resolve(process.cwd(), "src/handlers/*.ts");

/**
 * Generic configuration for Webpack.
 * @type import("webpack").Configurations
 */
module.exports = {
  entry: getEntries(APP_ENTRY_FILEPATH),
  resolve: {
    extensions: [".ts", ".js", ".json"]
  },
  target: "node",
  output: {
    libraryTarget: "commonjs",
    path: join(__dirname, "dist"),
    filename: "[name].js"
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: ["ts-loader"]
      }
    ]
  },
  externals: [/^aws-sdk/i, "@lumigo/tracer"],
  devtool: "inline-source-map",
};