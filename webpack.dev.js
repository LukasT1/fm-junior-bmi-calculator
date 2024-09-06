const path = require("path");

module.exports = {
  entry: "./src/scripts/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "src/"), // Output to src/scripts for development
  },
  mode: "development",
  devtool: "inline-source-map", // Helps with debugging
  watch: true, // Watches for changes in files
};
