const { save } = require("./src/browser");
const { info } = require("./logger");
//const Gpio = require("onoff").Gpio;
//const ledGreen = new Gpio(16, "out");
//const ledOrange = new Gpio(20, "out");
//const ledRed = new Gpio(21, "out");

module.exports = {
  triggerGreen: () => {
    //ledGreen.writeSync(1);
    info("GREEN");
  },
  triggerRed: (reason) => {
    //ledRed.writeSync(1);
    info("RED: " + reason);
  },
  triggerOrange: () => {
    ledOrange.writeSync(1);
    save("ORANGE", "Scan error");
    info("ORANGE");
  },
  resetLeds: () => {
    //ledGreen.writeSync(0);
    //ledOrange.writeSync(0);
    //ledRed.writeSync(0);
  },
  startLeds: () => {
    //ledGreen.writeSync(1);
    //ledOrange.writeSync(1);
    //ledRed.writeSync(1);
    //setTimeout(resetLeds, 1000);
  },
};
