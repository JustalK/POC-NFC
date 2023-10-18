const { info } = require("./logger");

class Control {
  static id;
  static reader;

  static isProcessAbandonned(currentId) {
    const isIdDifferent = Control.id !== currentId;
    if (isIdDifferent) {
      info(`Process abandonned for ${currentId}`);
    }
    return isIdDifferent;
  }
}

module.exports = Control;
