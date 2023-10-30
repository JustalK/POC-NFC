const Control = require("./Control");
const { info } = require("./logger");
const { save } = require("./browser");
const { getR7, getData, getIdFromFirmwareVersionUnder4 } = require("./reader");
const { getTag } = require("./call");
const { checkTag } = require("./checker");
const { triggerCode, resetLeds } = require("./response");
const CONSTANTS = require("../helpers/constants");

module.exports = {
  handleNewCard: async ({ id }) => {
    info(`=========================================`);
    resetLeds();
    triggerCode({ code: CONSTANTS.RESPONSE_ORANGE });
    save("DETECTED", "");
    info(`[handleNewCard] Tag scanned: ${id}`);
    const firmwareVersion = await getR7();

    if (Control.isProcessAbandonned(id)) {
      return;
    }

    // If I dont have the right firmware version
    if (!firmwareVersion) {
      triggerCode({ code: CONSTANTS.RESPONSE_BLINK_ORANGE });
      return;
    }

    const buffer = await getData();

    if (Control.isProcessAbandonned(id)) {
      return;
    }

    // If I dont have the buffer
    if (!buffer) {
      triggerCode({ code: CONSTANTS.RESPONSE_BLINK_ORANGE });
      return;
    }

    const tagID = getIdFromFirmwareVersionUnder4(buffer);

    if (Control.isProcessAbandonned(id)) {
      return;
    }

    // If I dont have the id
    if (!tagID) {
      triggerCode({ code: CONSTANTS.RESPONSE_BLINK_ORANGE });
      return;
    }

    info(`[handleNewCard] ID found in tag: ${tagID}`);

    const tagInformation = await getTag(tagID);

    if (Control.isProcessAbandonned(id)) {
      return;
    }

    // If I dont have the information for my tag
    if (!tagInformation) {
      return;
    }

    info(`[handleNewCard] Client Id: ${tagInformation.clientId}`);
    info(`[handleNewCard] Battery Level: ${tagInformation.batteryLevel}`);
    info(`[handleNewCard] Last tag update: ${tagInformation.lastTagUpdate}`);

    const result = checkTag(tagInformation);

    if (Control.isProcessAbandonned(id)) {
      return;
    }

    // If I dont have the result (should never happend)
    if (!result) {
      return;
    }

    triggerCode(result);
  },
};
