const CONSTANTS = require("../helpers/constants");
const { info } = require("./logger");
const fetch = require("node-fetch");
const axios = require("axios");

const apiCall = async (api, body) => {
  console.log(body);
  try {
    const response = await axios.post(api, body, {
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization:
          "Bearer kapikey-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJhZG1pbi1rdXp6bGUtb21uaXNjaWVudCIsImlhdCI6MTY1NDc3NzI0NX0.B68PiWll61k7uZtkfu6LO1o4o6E4uvlHTDQqbIlVWv4",
      },
    });
    return response;
  } catch (e) {
    info(`[ApiCall] The post request has failed: ${api}`);
    return null;
  }
};

module.exports = {
  createTagInTagOut: async (entryNumber, tagId) => {
    return apiCall(
      "http://api.staging.v2.myomniscient.com/_plugin/omniscient/tagInTagOut/create",
      {
        entryNumber,
        tagId: `Wirepas-${tagId}`,
      }
    );
  },
  registerEntryNumber: async (entryNumber) => {
    return apiCall(
      "http://api.staging.v2.myomniscient.com/_plugin/omniscient/tagInTagOut/adminRegister",
      { entryNumber }
    );
  },
  getTag: async (tagId) => {
    const response = await apiCall(
      "http://api.staging.v2.myomniscient.com/_plugin/omniscient/tagInTagOut/scan",
      { tagId: `Wirepas-${tagId}` }
    );

    if (!response || !response.data) {
      return null;
    }

    const result = response.data.result;

    if (!result) {
      return null;
    }

    return {
      tagId,
      ...result,
    };
  },
};
