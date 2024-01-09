const { defineConfig } = require("cypress");
//const getCompareSnapshotsPlugin = require('.js');

module.exports = defineConfig({
  screenshotsFolder: "./cypress/snapshots/actual",
  trashAssetsBeforeRuns: true,
  video: false,

  e2e: {
    setupNodeEvents(on, config) {
      //    getCompareSnapshotsPlugin(on, config);
    },
  },

  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
  },
});
