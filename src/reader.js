const CONSTANTS = require("../helpers/constants");
const {
  getT1,
  getL1,
  getT2,
  getL2,
  getV2,
  getDecimalFromBuff,
} = require("../helpers/utils");

const getFromUp4 = (data, cursor) => {
  cursor += CONSTANTS.SIZE_T0;
  console.log(
    `Max Bytes: `,
    getDecimalFromBuff(data.slice(cursor, cursor + CONSTANTS.SIZE_L0))
  );
  const totalBytes =
    getDecimalFromBuff(data.slice(cursor, cursor + CONSTANTS.SIZE_L0)) -
    CONSTANTS.BUFFER_STARTING_POINT;
  cursor += CONSTANTS.SIZE_L0 + CONSTANTS.SIZE_CRC;

  const result = {};
  while (cursor < totalBytes) {
    const t1 = getT1(data, cursor).toString("hex");
    const l1 = getDecimalFromBuff(getL1(data, cursor));

    const t2 = getT2(data, cursor);
    const l2 = getDecimalFromBuff(getL2(data, cursor));
    const v2 = getV2(data, cursor, l2);

    result[t1] = {
      buffer: v2,
      value: v2.toString(),
    };
    cursor += CONSTANTS.SIZE_T1_L1_T2_L2 + l2;
  }

  return result;
};

const getFromLower4 = (data, cursor) => {
  const totalBytes = CONSTANTS.MAX_MEMORY_ELA * CONSTANTS.SIZE_ADDRESS;
  let payload = [];
  while (cursor < totalBytes) {
    payload.push(data.slice(cursor, cursor + CONSTANTS.SIZE_ADDRESS));
    cursor += CONSTANTS.SIZE_ADDRESS;
  }
  const buffer = Buffer.concat(payload);
  const bufferString = buffer.toString("ascii");
  const id = bufferString.match(/(?<="Id":{"init":\d*,"value":)\d*/g);

  const result = {};
  result[CONSTANTS.ID_ENCAP_1.NAME] = {
    buffer: null,
    value: "WP_" + id[0],
  };

  return result;
};

module.exports = {
  getData: (data) => {
    let cursor = CONSTANTS.BUFFER_STARTING_POINT;
    const R7 = data.slice(cursor, cursor + CONSTANTS.SIZE_BUFFER_R7);
    const bufferR7 = R7.toString("hex");
    cursor += CONSTANTS.SIZE_BUFFER_R7;
    if (bufferR7 === "65736f6e") {
      return getFromUp4(data, cursor);
    } else {
      return getFromLower4(data, cursor);
    }
  },
};
