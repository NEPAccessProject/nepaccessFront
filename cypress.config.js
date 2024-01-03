const { defineConfig } = require("cypress");
const webpackPreprocessor = require('@cypress/webpack-preprocessor');
const { startDevServer } = require('@cypress/webpack-dev-server');
const webpackDevServerConfig = require('@cypress/webpack-dev-server/dist/webpack-dev-server.config.js');

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
  e2e: {
    baseUrl: "https://localhost:3000/",
    //specPattern: "cypress/e2e/*.{js,jsx}",
    testIsolation: true,
    setupNodeEvents(on, config) {
      console.log('Cypress e2e config', config)
      // implement node event listeners here
    },
  }
});
