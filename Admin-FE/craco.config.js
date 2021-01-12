const path = require("path");

module.exports = () => ({
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  // Add jest config resolve alias path
  jest: {
    configure: {
      moduleNameMapper: {
        // resolve @/constants path
        "^@/(.+)$": "<rootDir>/src/$1",
      },
    },
  },
});