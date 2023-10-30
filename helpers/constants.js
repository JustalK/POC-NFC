const TEST = false;
const TEST_TAG = "21A01575";
const URL_TAG_API =
  "https://omniscient-apimanage-prod.azure-api.net/clone/omniscient/tags/_search";
const API_SUBSCRIPTION_KEY = "48adbc429be54120bfe23b119e7c7cb1";
const CLIENT_ID = "customer-renter-demo_loueur_materiel";
const MINIMUM_BATTERY_LEVEL = 0.3;
const MINIMUM_TIME_DIFFERENCE_IN_MINUTES = 10;

const ID_ENCAP_1 = {
  NAME: "1010",
  IDENTiFIANT_WP: "1010",
  NETWORK_ADDRESS: "1020",
  NETWORK_CHANNEL: "1021",
  NETWORK_CLASS: "1022",
  ENABLE_TAG: "1030",
};

const MAX_MEMORY_ELA = 512;
const SIZE_ADDRESS = 4;
const ELASON_STARTING_BLOCK = 7;
const BUFFER_STARTING_BLOCK = 8;
const BUFFER_STARTING_POINT = SIZE_ADDRESS * ELASON_STARTING_BLOCK;

const SIZE_BUFFER_R7 = 4;
const SIZE_T0 = 3;
const SIZE_L0 = 2;
const SIZE_CRC = 1;

const SIZE_T1 = 2;
const SIZE_L1 = 1;

const SIZE_T2 = 1;
const SIZE_L2 = 1;

const SIZE_T1_L1 = SIZE_T1 + SIZE_L1;
const SIZE_T1_L1_T2 = SIZE_T1_L1 + SIZE_T2;
const SIZE_T1_L1_T2_L2 = SIZE_T1_L1_T2 + SIZE_L2;

const FIRMWARE_VERSION_JSON = "6A736F6E";
const FIRMWARE_VERSION_ESON = "65736F6E";

const HEX_DATA_FORMAT = "hex";
const ASCII_DATA_FORMAT = "ascii";

const RESPONSE_RED = "red";
const RESPONSE_ORANGE = "orange";
const RESPONSE_GREEN = "green";

module.exports = {
  URL_TAG_API,
  API_SUBSCRIPTION_KEY,
  CLIENT_ID,
  MINIMUM_BATTERY_LEVEL,
  ID_ENCAP_1,
  MAX_MEMORY_ELA,
  SIZE_ADDRESS,
  ELASON_STARTING_BLOCK,
  BUFFER_STARTING_BLOCK,
  BUFFER_STARTING_POINT,
  SIZE_T0,
  SIZE_L0,
  SIZE_CRC,
  SIZE_T1,
  SIZE_L1,
  SIZE_T2,
  SIZE_L2,
  SIZE_T1_L1,
  SIZE_T1_L1_T2,
  SIZE_T1_L1_T2_L2,
  TEST,
  TEST_TAG,
  SIZE_BUFFER_R7,
  FIRMWARE_VERSION_JSON,
  FIRMWARE_VERSION_ESON,
  HEX_DATA_FORMAT,
  ASCII_DATA_FORMAT,
  RESPONSE_RED,
  RESPONSE_ORANGE,
  RESPONSE_GREEN,
  MINIMUM_TIME_DIFFERENCE_IN_MINUTES,
};
