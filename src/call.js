const CONSTANTS = require("../helpers/constants");
const { info } = require("./logger");
const fetch = require("node-fetch");
const axios = require("axios");

module.exports = {
  registerEntryNumber: async (entryNumber) => {
    try {
      const response = await axios.post(
        "http://api.uat.v2.myomniscient.com/_plugin/omniscient/tagInTagOut/adminRegister",
        { entryNumber },
        {
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Authorization:
              "Bearer kapikey-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJhZG1pbi1rdXp6bGUtb21uaXNjaWVudCIsImlhdCI6MTY1NDc3NzI0NX0.B68PiWll61k7uZtkfu6LO1o4o6E4uvlHTDQqbIlVWv4",
          },
        }
      );
      return response;
    } catch (e) {
      console.log(e);
      info("[getTag] The post request has failed");
      return null;
    }
  },
  getTag: async (id) => {
    let response = null;
    try {
      response = await fetch(CONSTANTS.URL_TAG_API, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": CONSTANTS.API_SUBSCRIPTION_KEY,
        },
        body: JSON.stringify({
          query: { term: { "manufacturerId.raw": id } },
        }),
      });
    } catch (_) {
      info("[getTag] The post request has failed");
      return null;
    }

    if (!response) {
      info("[getTag] The response is empty");
      return null;
    }

    const responseJSON = await response.json();

    if (!responseJSON) {
      info("[getTag] The translated response is empty");
      return null;
    }

    const result = responseJSON.result;

    if (!result || !result.hits) {
      info("[getTag] The result is empty");
      return null;
    }

    const hit = result.hits[0];

    if (!hit) {
      info("[getTag] No result found for this tag");
      return null;
    }

    const _source = hit._source;
    if (!_source) {
      info("[getTag] The tag has no data");
      return null;
    }

    const tagId = _source.tagId;
    const clientId = _source.clientId;
    const batteryLevel = _source.batteryLevel;
    const lastTagUpdate = _source.lastTagUpdate;

    if (!tagId) {
      info("[getTag] The tag has no tagId");
      return null;
    }

    if (!clientId) {
      info("[getTag] The tag has no clientId");
      return null;
    }

    if (!batteryLevel) {
      info("[getTag] The tag has no battery level");
      return null;
    }

    if (!lastTagUpdate) {
      info("[getTag] The tag has no date for last update");
      return null;
    }

    return {
      tagId,
      clientId,
      batteryLevel,
      lastTagUpdate,
    };
  },
};
