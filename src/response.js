const Gpio = require("onoff").Gpio;
const ledRed = new Gpio(21, "out");
const ledOrange = new Gpio(20, "out");
const ledGreen = new Gpio(16, "out");
const carousel = new Gpio(4, "out");
const carouselRed = new Gpio(17, "out");
const { info } = require("./logger");
const CONSTANTS = require("../helpers/constants");
const { save } = require("./browser");
let timeoutID = null;
let timeoutBlinkID = null;
let valueOrange = 1;

/**
 * Trigger the effect associated to a certain code
 * @param {string} code The code error Red, Green, Orange
 * @param {string} message The message associated with the code
 */
const triggerCode = ({ code, message = "", message2 = "", message3 = "" }) => {
  resetLeds();
  switch (code) {
    case CONSTANTS.RESPONSE_RED:
      info(`[triggerCode] ${message}`);
      save("RED", message, message2, message3);
      ledRed.writeSync(1);
      carouselRed.writeSync(1);
      break;
    case CONSTANTS.RESPONSE_ORANGE:
      ledOrange.writeSync(1);
      save("ORANGE", message, message2, message3);
      return;
    case CONSTANTS.RESPONSE_BLINK_ORANGE:
      blinkOrange(valueOrange);
      timeoutBlinkID = setInterval(() => {
        blinkOrange(valueOrange === 1 ? 0 : 1);
      }, 300);
      break;
    case CONSTANTS.RESPONSE_GREEN:
      info(`[triggerCode] Tag allowed`);
      save("GREEN", message, message2, message3);
      ledGreen.writeSync(1);
      carousel.writeSync(1);
      break;
  }
  timeoutID = setTimeout(resetLeds, 2000);
};

/**
 * Blink the orange light
 * @param {number} value The value of the orange led
 */
const blinkOrange = (value) => {
  ledOrange.writeSync(value);
  valueOrange = value;
};

/**
 * Reset all the led to 0
 */
const resetLeds = () => {
  clearTimeout(timeoutID);
  clearTimeout(timeoutBlinkID);
  valueOrange = 0;
  ledGreen.writeSync(0);
  ledOrange.writeSync(0);
  ledRed.writeSync(0);
  carousel.writeSync(0);
  carouselRed.writeSync(0);
  save("SCAN", "", "", "");
};

/**
 * Test all the light by lighting them all
 */
const startLeds = () => {
  ledGreen.writeSync(1);
  ledOrange.writeSync(1);
  ledRed.writeSync(1);
  setTimeout(resetLeds, 2000);
};

module.exports = {
  triggerCode,
  resetLeds,
  startLeds,
};
