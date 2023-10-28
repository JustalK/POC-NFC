const CONSTANTS = require("./constants");

const get = (data, cursor, offset, size) => {
  const cursorOffset = cursor + offset;
  return data.slice(cursorOffset, cursorOffset + size);
};

module.exports = {
  getT1: (data, cursor) => {
    return get(data, cursor, 0, CONSTANTS.SIZE_T1);
  },
  getL1: (data, cursor) => {
    return get(data, cursor, cursor + CONSTANTS.SIZE_T1, CONSTANTS.SIZE_L1);
  },
  getT2: (data, cursor) => {
    return get(data, cursor, cursor + CONSTANTS.SIZE_T1_L1, CONSTANTS.SIZE_T2);
  },
  getL2: (data, cursor) => {
    const cursorOffset = cursor + CONSTANTS.SIZE_T1_L1_T2;
    return data.slice(cursorOffset, cursorOffset + CONSTANTS.SIZE_L2);
  },
  getV2: (data, cursor, size) => {
    const cursorOffset = cursor + CONSTANTS.SIZE_T1_L1_T2_L2;
    return data.slice(cursorOffset, cursorOffset + size);
  },
  getDecimalFromBuff: (buff) => {
    return parseInt(buff.toString("hex"), 16);
  },
};
