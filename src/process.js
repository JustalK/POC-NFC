const Control = require("./Control");
const { info } = require("./logger");
const { getR7, getData, getIdFromFirmwareVersionUnder4 } = require("./reader");
const { getTag } = require("./call");
const { checkTag } = require("./checker");
const { triggerCode, resetLeds } = require("./response");
const CONSTANTS = require("../helpers/constants");

module.exports = {
  handleNewCard: async ({ id }) => {
    info(`=========================================`);
    resetLeds();
    info(`[handleNewCard] Tag scanned: ${id}`);
    const firmwareVersion = await getR7();

    if (Control.isProcessAbandonned(id)) {
      return;
    }

    // If I dont have the right firmware version
    if (!firmwareVersion) {
      triggerCode({ code: CONSTANTS.RESPONSE_ORANGE });
      return;
    }

    const buffer = await getData();

    if (Control.isProcessAbandonned(id)) {
      return;
    }

    // If I dont have the buffer
    if (!buffer) {
      triggerCode({ code: CONSTANTS.RESPONSE_ORANGE });
      return;
    }

    const tagID = getIdFromFirmwareVersionUnder4(buffer);

    if (Control.isProcessAbandonned(id)) {
      return;
    }

    // If I dont have the id
    if (!tagID) {
      triggerCode({ code: CONSTANTS.RESPONSE_ORANGE });
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

module.exports = {
  handleNewCard: async ({ id }) => {
    //resetLeds();
    info(`Card inserted: ${id}`);
    //save("DETECTED", "");

    let data = null;
    try {
      data = await Control.reader.read(0, CONSTANTS.MAX_MEMORY_ELA);
    } catch (err) {
      info("Error when reading data");
      triggerOrange();
    }

    if (!data) {
      info("Data is null");
      triggerOrange();
    }

    if (Control.isProcessAbandonned(id)) {
      return;
    }

    const result = getData(data);

    if (Control.isProcessAbandonned(id)) {
      return;
    }

    const id = result[CONSTANTS.ID_ENCAP_1.NAME].value;

    if (Control.isProcessAbandonned(id)) {
      return;
    }

    info(`TagId: `, id.replace("WP_", ""));
    const tag = await getTag(
      CONSTANTS.TEST ? CONSTANTS.TEST_TAG : id.replace("WP_", "")
    );

    if (Control.isProcessAbandonned(id)) {
      return;
    }

    checkTag(tag);
  },
};
