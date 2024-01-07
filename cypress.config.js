const { defineConfig } = require("cypress");

// https://github.com/cypress-visual-regression/cypress-visual-regression
const getCompareSnapshotsPlugin = require('cypress-visual-regression/dist/plugin');

//const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = defineConfig({
  projectId: "7x4r9s",
  key: "a42c44b4-bbb3-40c5-9605-22fc2bedb05f",
  screenshotOnRunFailure: true,
  video: true,
  chromeWebSecurity: false,
  experimentalStudio: true,
  screenshotOnRunFailure: true,
  screenshotsFolder: "cypress/screenshots",
  videosFolder: "cypress/videos",
  env: {
    "ALWAYS_GENERATE_DIFF": true,
    "ALLOW_VISUAL_REGRESSION_TO_FAIL": true
  },
  e2e: {
    setupNodeEvents(on, config) {
      console.log("Cypress e2e config", config);
      getCompareSnapshotsPlugin(on, config);

      // implement node event listeners here
    },
  },

  component: {
    webpackConfig: {
      
    },
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
  },
});
