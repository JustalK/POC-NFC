// without Babel in ES2015
const { NFC } = require("nfc-pcsc");
const express = require("express");
const CONSTANTS = require("./helpers/constants");
const { getTag } = require("./src/call");
const { getData } = require("./src/reader");
const { checkTag } = require("./src/checker");
const { openBrowser, save } = require("./src/browser");
const { triggerOrange, startLeds, resetLeds } = require("./src/diode");
const nfc = new NFC();

openBrowser();
startLeds();

nfc.on("reader", async (reader) => {
  reader.autoProcessing = false;

  console.log(`${reader.reader.name}  device attached`);
  save("SCAN", "");

  reader.on("card", async (card) => {
    resetLeds();
    save("DETECTED", "");
    console.log(`${reader.reader.name}  card inserted`);

    try {
      const data = await reader.read(0, CONSTANTS.MAX_MEMORY_ELA);
      const result = getData(data);
      const id = result[CONSTANTS.ID_ENCAP_1.NAME].value;
      console.log(`TagId: `, id.replace("WP_", ""));
      const tag = await getTag(
        CONSTANTS.TEST ? CONSTANTS.TEST_TAG : id.replace("WP_", "")
      );
      checkTag(tag);
    } catch (err) {
      console.error(`error when reading data`, err);
      save("ORANGE", "Scan error");
      triggerOrange();
    }
  });

  reader.on("card.off", (card) => {
    resetLeds();
    console.log(`${reader.reader.name}  card removed`);
  });

  reader.on("error", (err) => {
    console.log(`${reader.reader.name}  an error occurred`, err);
    triggerOrange();
  });

  reader.on("end", () => {
    console.log(`${reader.reader.name}  device removed`);
  });
});

nfc.on("error", (err) => {
  console.log("an error occurred", err);
});

const app = express();
app.use(express.static(__dirname + "/www"));

app.listen("3000");
console.log("working on 3000");
