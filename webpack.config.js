const path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");

/**@type {import("webpack").Configuration} */
const config = {
  mode: "development",
  target: "node",
  plugins: [
    new webpack.ProvidePlugin({
      TextDecoder: ['text-encoding', 'TextDecoder'],
      TextEncoder: ['text-encoding', 'TextEncoder']
    }),
    // FIXME: ensure that we clean crate/pkg too
    new CleanWebpackPlugin(),
    new WasmPackPlugin({
      crateDirectory: path.resolve(__dirname, "crate"),
      withTypeScript: true,
    }),
  ],
  devtool: "source-map",
  entry: "./extension/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    libraryTarget: "commonjs2",
    devtoolModuleFilenameTemplate: "../[resource-path]",
  },
  externals: {
    vscode: "commonjs vscode",
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".wasm"]
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: "ts-loader"
    }]
  },
};

module.exports = config;
