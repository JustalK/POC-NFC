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

/**
 * Setup the cron of the application
 */
const setup = async () => {
  Control.entryNumber = getEntryNumber();
  console.log(Control.entryNumber);
  await registerEntryNumber(Control.entryNumber);
  cron.schedule("* * * * *", () => {
    //checkInternet();
  });
};

module.exports = {
  setup,
};
