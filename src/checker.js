const CONSTANTS = require("../helpers/constants");
const Control = require("./Control");
const dns = require("dns");
const { sendEmail } = require("./email");
const { info } = require("./logger");

/**
 * Check that the information from the tag pass all the information
 * @param {Object} The tag with all is information
 * @returns {Object} The code with the message associated
 */
const checkTag = ({ tagId, clientId, batteryLevel, lastTagUpdate }) => {
  if (!tagId) {
    return {
      code: CONSTANTS.RESPONSE_RED,
      message: "Tag Not Found",
    };
  }

  if (Control.minimumTimeDifference) {
    const timeTenMinutesAgo =
      Date.now() - 1000 * 60 * Control.minimumTimeDifference;
    if (lastTagUpdate < timeTenMinutesAgo) {
      return {
        code: CONSTANTS.RESPONSE_RED,
        message: `Last tag position updated more than ${Control.minimumTimeDifference} minutes ago`,
      };
    }
  }

  if (
    Control.minimumBatteryLevel &&
    batteryLevel < Control.minimumBatteryLevel
  ) {
    return {
      code: CONSTANTS.RESPONSE_RED,
      message: `Battery level lower than ${parseInt(
        CONSTANTS.MINIMUM_BATTERY_LEVEL * 100
      )}%`,
    };
  }

  if (Control.customerId !== "ALL" && clientId !== Control.customerId) {
    return {
      code: CONSTANTS.RESPONSE_RED,
      message: "Tag belong to another client",
    };
  }

  return {
    code: CONSTANTS.RESPONSE_GREEN,
    message: null,
  };
};

/**
 * Check that internet is actually on
 */
const checkInternet = () => {
  dns.resolve(CONSTANTS.URL_TEST_DNS, (err) => {
    if (err) {
      if (Control.hasInternet) {
        info("[checkInternet] Impossible to connect to the internet");
        sendEmail({
          message: "[checkInternet] Impossible to connect to the internet",
        });
      }
      Control.hasInternet = false;
    } else {
      Control.hasInternet = true;
    }
  });
};

module.exports = {
  checkTag,
  checkInternet,
};
