const Control = require("./Control");
const { info } = require("./logger");
const { save } = require("./browser");
const {
  getR7,
  getData,
  getIdFromFirmwareVersionUnder4,
  getIdFromFirmwareVersionOver4,
} = require("./reader");
const { getTag, createTagInTagOut } = require("./call");
const { checkTag } = require("./checker");
const { triggerCode, resetLeds } = require("./response");
const CONSTANTS = require("../helpers/constants");

module.exports = {
  handleNewCard: async ({ id }) => {
    const startTime = Date.now();
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

    const tagID =
      firmwareVersion === CONSTANTS.FIRMWARE_VERSION_ESON
        ? getIdFromFirmwareVersionOver4(buffer, 0)
        : getIdFromFirmwareVersionUnder4(buffer);

    if (Control.isProcessAbandonned(id)) {
      return;
    }

    // If I dont have the id
    if (!tagID) {
      triggerCode({ code: CONSTANTS.RESPONSE_BLINK_ORANGE });
      return;
    }

    info(`[handleNewCard] Tag reading Time in ms: ${Date.now() - startTime}`);
    info(`[handleNewCard] ID found in tag: ${tagID}`);

    // If we dont have internet
    if (!Control.hasInternet) {
      triggerCode({ code: CONSTANTS.RESPONSE_GREEN });
      info(`[handleNewCard] No Internet`);
      info(`[handleNewCard] Execution Time in ms: ${Date.now() - startTime}`);
      return;
    }

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
    createTagInTagOut(Control.entryNumber, tagID);
    info(`[handleNewCard] Execution Time in ms: ${Date.now() - startTime}`);
  },
};
