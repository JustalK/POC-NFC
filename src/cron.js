const cron = require('node-cron');
const { checkInternet } = require("./checker");

  /**
   * Setup the cron of the application
   */
const setup = () => {
  cron.schedule("* * * * *", () => {
    checkInternet();
  });
}

module.exports = {
  setup
};
