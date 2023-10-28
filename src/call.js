const CONSTANTS = require("../helpers/constants");

module.exports = {
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
    } catch (error) {
      console.log(error);
      return null;
    }

    if (!response) {
      return null;
    }

    const responseJSON = await response.json();
    if (!responseJSON) {
      return null;
    }

    const result = responseJSON.result;
    if (!result || !result.hits) {
      return null;
    }

    const hit = result.hits[0];
    if (!hit) {
      return null;
    }

    const _source = hit._source;
    if (!_source) {
      return null;
    }

    const tagId = _source.tagId;
    const clientId = _source.clientId;
    const batteryLevel = _source.batteryLevel;
    const lastPositionUpdate = _source.location?.lastPositionUpdate;

    if (!tagId || !clientId || !batteryLevel || !lastPositionUpdate) {
      return null;
    }

    return {
      tagId,
      clientId,
      batteryLevel,
      lastPositionUpdate,
    };
  },
};
