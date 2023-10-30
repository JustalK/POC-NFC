// without Babel in ES2015
const { NFC } = require("nfc-pcsc");
const { info } = require("./src/logger");
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const CONSTANTS = require("./helpers/constants");
const { getTag } = require("./src/call");
const { handleNewCard } = require("./src/process");
const { getData } = require("./src/reader");
const { checkTag } = require("./src/checker");
const { openBrowser, save } = require("./src/browser");
const Control = require("./src/Control");
const nfc = new NFC();

info("Start of the program");

nfc.on("reader", async (reader) => {
  Control.reader = reader;
  reader.autoProcessing = false;

  info(`Tag reader plugged`);

  reader.on("card", async () => {
    const id = uuidv4();
    Control.id = id;
    handleNewCard({
      id,
    });
  });

  reader.on("card.off", () => {
    info(`Tag removed`);
  });

  reader.on("error", (err) => {
    info(`${reader.reader.name}  an error occurred`, err);
  });

  reader.on("end", () => {
    info(`Tag reader removed`);
  });
});

/**
openBrowser();
startLeds();

nfc.on("reader", async (reader) => {
  Control.reader = reader
  reader.autoProcessing = false;

  console.log(`${reader.reader.name}  device attached`);
  save("SCAN", "");

  reader.on("card", async (card) => {
    const id = uuidv4();
    Control.id = id
    handleNewCard({
      id
    });
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
**/
