const CONSTANTS = require("../helpers/constants");

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

module.exports = {
  checkTag,
};
