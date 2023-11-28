const { checkInternet } = require("./checker");

module.exports = {
  /**
   * Setup the cron of the application
   */
  setup: async () => {
    cron.schedule("* * * * *", () => {
      checkInternet();
    });
  },
};
