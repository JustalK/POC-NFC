const cron = require("node-cron");
const Control = require("./Control");
const fs = require("fs");
const { registerEntryNumber } = require("./call");
const { checkInternet } = require("./checker");

const makeEntryNumber = (length) => {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

const getEntryNumber = function () {
  if (fs.existsSync("config.json")) {
    const previousResult = fs.readFileSync("config.json");
    const previousInfo = JSON.parse(previousResult);
    return previousInfo.entryNumber;
  } else {
    const entryNumber = makeEntryNumber(10);
    fs.writeFileSync("config.json", JSON.stringify({ entryNumber }));
    return entryNumber;
  }
};

const setupControl = async function () {
  Control.entryNumber = getEntryNumber();
  const response = await registerEntryNumber(Control.entryNumber);
  const config = response.data.result._source;
  Control.customerId = "customer-" + config.customerId;
  Control.minimumBatteryLevel = config.minimumBatteryLevel;
  Control.inOut = config.inOut;
  Control.minimumTimeDifference = config.minimumTimeDifference;
  Control.apiSubscriptionKey = config.apiSubscriptionKey;
};

/**
 * Setup the cron of the application
 */
const setup = async () => {
  cron.schedule("* * * * *", () => {
    setupControl();
  });
};

module.exports = {
  setup,
};
