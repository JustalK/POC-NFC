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
const checkTag = (tagInformation) => {
  if (!tagInformation) {
    return {
      code: CONSTANTS.RESPONSE_RED,
      message: "Tag Not linked to a customer",
    };
  }

  const {
    tagId,
    clientId,
    batteryLevel,
    lastTagUpdate,
    assetId,
    hasBeenUpdateMinuteAgo,
  } = tagInformation;

  info(`[handleNewCard] Client Id: ${clientId}`);
  info(`[handleNewCard] Asset Id: ${assetId}`);
  info(`[handleNewCard] Battery Level: ${batteryLevel}`);
  info(`[handleNewCard] Tagged less than a minute: ${hasBeenUpdateMinuteAgo}`);

  if (!tagId) {
    return {
      code: CONSTANTS.RESPONSE_RED,
      message: "Tag Not Found",
    };
  }

  if (!clientId) {
    return {
      code: CONSTANTS.RESPONSE_RED,
      message: "Tag does not belong to any client",
    };
  }

  if (!batteryLevel) {
    return {
      code: CONSTANTS.RESPONSE_RED,
      message: "Battery level is missing",
    };
  }

  if (!lastTagUpdate) {
    return {
      code: CONSTANTS.RESPONSE_RED,
      message: "Last update is missing",
    };
  }

  if (!assetId) {
    return {
      code: CONSTANTS.RESPONSE_RED,
      message: "Tag has not been associated to an asset",
    };
  }

  if (!hasBeenUpdateMinuteAgo && Control.inOut === "In") {
    return {
      code: CONSTANTS.RESPONSE_RED,
      message: "Tag has been scanned less than a minute ago",
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
        Control.minimumBatteryLevel * 100
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
