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
      message2: "未找到標籤",
      message3: "ट्याग परेन"
    };
  }

  if (!clientId) {
    return {
      code: CONSTANTS.RESPONSE_RED,
      message: "Tag does not belong to any client",
      message2: "標籤不屬於任何客戶",
      message3: "ट्याग कसै पनि ग्राहकको होइन"
    };
  }

  if (!batteryLevel) {
    return {
      code: CONSTANTS.RESPONSE_RED,
      message: "Battery level is missing",
      message2: "電池電量丟失",
      message3: "ब्याट्री स्तर नेपाइएको छ"
    };
  }

  if (!lastTagUpdate) {
    return {
      code: CONSTANTS.RESPONSE_RED,
      message: "Last update is missing",
      message2: "最後更新丟失",
      message3: "अन्तिम अपडेट नेपाइएको छ"
    };
  }

  if (!assetId) {
    return {
      code: CONSTANTS.RESPONSE_RED,
      message: "Tag has not been associated to an asset",
      message2: "標籤未關聯到任何資產",
      message3: "ट्यागले कुनै पनि सम्पत्ति संलग्न गरेको छैन"
    };
  }

  if (!hasBeenUpdateMinuteAgo && Control.inOut === "In") {
    return {
      code: CONSTANTS.RESPONSE_RED,
      message: "Tag has been scanned less than a minute ago",
      message2: "標籤於一分鐘內掃描過",
      message3: "ट्यागले अघिको एक मिनेट भन्दा कम समयमा स्क्यान गरिएको छ"
    };
  }

  if (Control.minimumTimeDifference) {
    const timeTenMinutesAgo =
      Date.now() - 1000 * 60 * Control.minimumTimeDifference;
    if (lastTagUpdate < timeTenMinutesAgo) {
      return {
        code: CONSTANTS.RESPONSE_RED,
        message: `Last tag position updated more than ${Control.minimumTimeDifference} minutes ago`,
        message2: `最後標籤位置更新於${Control.minimumTimeDifference}分鐘前`,
        message3: `अन्तिम ट्याग पोजिसन अपडेट गरेको ${Control.minimumTimeDifference} मिनेट भन्दा ढिलो`
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
      message2: `電池電量低於${parseInt(
        Control.minimumBatteryLevel * 100
      )}%`,
      message3: `ब्याट्री स्तर ${parseInt(
        Control.minimumBatteryLevel * 100
      )}% भन्दा कम`
    };
  }

  if (Control.customerId !== "ALL" && clientId !== Control.customerId) {
    return {
      code: CONSTANTS.RESPONSE_RED,
      message: "Tag belong to another client",
      message2: "標籤屬於另一客戶",
      message3: "ट्याग कसै अरु ग्राहकको हो"
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
