const cron = require('node-cron');
const { checkInternet } = require("./checker");

  /**
   * Setup the cron of the application
   */
const setup = () => {
  setInterval(function() {
    checkInternet();
  }, 1000)
  //cron.schedule("* * * * *", () => {
    
  //});
}

module.exports = {
  setup
};
