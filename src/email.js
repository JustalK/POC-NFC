const CONSTANTS = require("../helpers/constants");
const { info } = require("./logger");
const fetch = require("node-fetch");

module.exports = {
  /**
   * Send email
   */
  sendEmail: async (info) => {
    try {
      response = await fetch(CONSTANTS.URL_TAG_API, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...info,
        }),
      });
    } catch (_) {
      info("[sendEmail] The post request has failed");
      return null;
    }
  },
};