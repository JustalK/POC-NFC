const CONSTANTS = require("../helpers/constants");
const { triggerGreen, triggerRed } = require("./diode");
const { save } = require("./browser");

module.exports = {
  checkTag: (tag) => {
    if (!tag) {
      save("RED", "Tag not found");
      triggerRed("Tag Not Found");
      return;
    }

    const { tagId, clientId, batteryLevel, lastPositionUpdate } = tag;

    // TEST 1 - ID Tag does not exist or found
    if (!tagId) {
      save("RED", "Tag not found");
      triggerRed("TEST 1");
      return;
    }

    // TEST 4 - Last Position Update over 10 minutes
    const timeTenMinutesAgo = Date.now() - 1000 * 60 * 10;
    if (!CONSTANTS.TEST && lastPositionUpdate < timeTenMinutesAgo) {
      save("RED", "Last tag position updated more than 10 minutes ago");
      triggerRed("TEST 4");
      return;
    }

    // TEST 5 - Battery level check over 30%
    if (batteryLevel < CONSTANTS.MINIMUM_BATTERY_LEVEL) {
      save("RED", "Battery level lower than 30%");
      triggerRed("TEST 5");
      return;
    }

    // TEST 6 - Tag belong to the right client
    if (clientId !== CONSTANTS.CLIENT_ID) {
      save("RED", "Tag belong to another client");
      triggerRed("TEST 6");
      return;
    }

    save("GREEN", "");
    triggerGreen();
  },
};
