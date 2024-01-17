const path = require("path");

module.exports = {
  entry: {
    coursera: "./coursera.ts",
    all_websites: "./all_websites.ts",
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname,"..","src", "content-scripts"),
  },
};
