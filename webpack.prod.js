const path = require("path");

module.exports = {
  entry: "./src/scripts/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist/"), // Output to dist/scripts for production
  },
  mode: "production", // Optimizes for production
};
