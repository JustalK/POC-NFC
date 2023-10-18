const Control = require("./Control");
const { info } = require("./logger");
const { triggerOrange } = require("./diode");

module.exports = {
  handleNewCard: async ({ id }) => {
    //resetLeds();
    info(`Card inserted: ${id}`);
    setTimeout(() => {
      if (id === Control.id) {
        console.log(id);
      }
    }, 1000);
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
