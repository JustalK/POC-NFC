const CONSTANTS = require("../helpers/constants");
const Control = require("./Control");
const dns = require("dns");
const { sendEmail } = require("./email");

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

  const timeTenMinutesAgo =
    Date.now() - 1000 * 60 * CONSTANTS.MINIMUM_TIME_DIFFERENCE_IN_MINUTES;
  if (!CONSTANTS.TEST && lastTagUpdate < timeTenMinutesAgo) {
    return {
      code: CONSTANTS.RESPONSE_RED,
      message: `Last tag position updated more than ${CONSTANTS.MINIMUM_TIME_DIFFERENCE_IN_MINUTES} minutes ago`,
    };
  }

  if (batteryLevel < CONSTANTS.MINIMUM_BATTERY_LEVEL) {
    return {
      code: CONSTANTS.RESPONSE_RED,
      message: `Battery level lower than ${parseInt(
        CONSTANTS.MINIMUM_BATTERY_LEVEL * 100
      )}%`,
    };
  }

  if (clientId !== CONSTANTS.CLIENT_ID) {
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
  dns.lookupService(
    CONSTANTS.URL_TEST_DNS,
    CONSTANT.ILANA_DEFAULT_DNS_PORT,
    function (error) {
      if (error) {
        // If the hasInternet is already false, it mean the internet has been checked down one time already
        // The interet has been down for two minutes already
        if (!Control.hasInternet) {
          sendEmail({
            message: "[checkInternet] Impossible to connect to the internet",
          });
        }
        Control.hasInternet = false;
      } else {
        Control.hasInternet = true;
      }
    }
  );
};

module.exports = {
  checkTag,
  checkInternet,
};
