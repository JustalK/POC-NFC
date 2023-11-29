// without Babel in ES2015
const { NFC } = require("nfc-pcsc");
const express = require("express");
const { info } = require("./src/logger");
const { v4: uuidv4 } = require("uuid");
const { handleNewCard } = require("./src/process");
const { startLeds } = require("./src/response");
const { setup } = require("./src/cron");
const Control = require("./src/Control");
const nfc = new NFC();

info("Start of the program");
startLeds();
setup();

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

const app = express();
app.use(express.static(__dirname + "/www"));

app.listen("3000");
console.log("working on 3000");
