const Control = require("./Control");
const { info } = require("./logger");
const CONSTANTS = require("../helpers/constants");
const {
  getT1,
  getL1,
  getT2,
  getL2,
  getV2,
  getDecimalFromBuff,
} = require("../helpers/utils");

/**
 * Get the firmware version from the block address 7
 * @returns {string|null} Return the firmware version or null if any error occur
 */
const getR7 = async () => {
  let firmwareVersionBuffer = null;
  try {
    firmwareVersionBuffer = await Control.reader.read(
      CONSTANTS.ELASON_STARTING_BLOCK,
      CONSTANTS.SIZE_ADDRESS
    );
  } catch (err) {
    info("[getR7] Error when reading firmwareVersion");
    return null;
  }

  if (!firmwareVersionBuffer) {
    info("[getR7] FirmwareVersion is null");
    return null;
  }

  const firmwareVersion = firmwareVersionBuffer
    .toString(CONSTANTS.HEX_DATA_FORMAT)
    .toUpperCase();

  switch (firmwareVersion) {
    case CONSTANTS.FIRMWARE_VERSION_ESON:
      info("[getR7] Firmware Version > 4.0.0 - ESON");
      return CONSTANTS.FIRMWARE_VERSION_ESON;
    case CONSTANTS.FIRMWARE_VERSION_JSON:
      info("[getR7] Firmware Version < 4.0.0 - JSON");
      return CONSTANTS.FIRMWARE_VERSION_JSON;
    default:
      info("[getR7] Firmware Version unknown");
      return null;
  }
};

/**
 * Return the data of the tag
 * @returns {buffer} Return the buffer of the configuration data
 */
const getData = async () => {
  try {
    const data = await Control.reader.read(
      CONSTANTS.BUFFER_STARTING_BLOCK,
      CONSTANTS.MAX_MEMORY_ELA
    );
    return data;
  } catch (_) {
    info("[getData] Error when reading configuration data");
    return null;
  }
};

const getIdFromFirmwareVersionOver4 = (data, cursor) => {
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

  if (!result[1010] || !result[1010]?.value) {
    info("[getIdFromFirmwareVersionOver4] Id not found in the data of the tag");
    return null;
  }

  console.log(parseInt(result[1030].buffer.toString("hex")))
  return result[1010].value.replace("WP_", "");
};

/**
 * Search in the data of the tag for the id and return it
 * @param {buffer} data
 * @returns {string|null} The id of the tag or null if any error
 */
const getIdFromFirmwareVersionUnder4 = (buffer) => {
  const totalBytes = CONSTANTS.MAX_MEMORY_ELA * CONSTANTS.SIZE_ADDRESS;
  let payload = [];
  let cursor = 0;
  while (cursor < totalBytes) {
    payload.push(buffer.slice(cursor, cursor + CONSTANTS.SIZE_ADDRESS));
    cursor += CONSTANTS.SIZE_ADDRESS;
  }

  let bufferString = null;
  try {
    const buffer = Buffer.concat(payload);
    bufferString = buffer.toString(CONSTANTS.ASCII_DATA_FORMAT);
  } catch (_) {
    info("[getIdFromFirmwareVersionUnder4] Error when reading buffer");
    return null;
  }
  let id = bufferString.match(/(?<="Id":{"init":\d*,"value":)\d*/g);

  if (!id || id.length === 0) {
    // Try if it's a Blue Lite Id without Mesh
    id = bufferString.match(/(?<="Name":{"init":.*,"value":")[^"]*/g);
    if (id) {
      id[0] = `Ble-210A${id[0].replace("L ID ", "")}`;
    }
  } else {
    id[0] = `Wirepas-${id[0]}`
  }

  if (!id || id.length === 0) {
    info(
      "[getIdFromFirmwareVersionUnder4] Id not found in the data of the tag"
    );
    return null;
  }


  return id[0];
};

module.exports = {
  getR7,
  getData,
  getIdFromFirmwareVersionOver4,
  getIdFromFirmwareVersionUnder4,
};
