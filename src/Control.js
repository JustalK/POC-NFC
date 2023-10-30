const { info } = require("./logger");

class Control {
  static id;
  static reader;

  /**
   * Check if the tag has been replaced by another one
   * @param {string} currentId The id of the tag if tested
   * @returns {boolean} True if the tag is different or else false
   */
  static isProcessAbandonned(currentId) {
    const isIdDifferent = Control.id !== null && Control.id !== currentId;
    if (isIdDifferent) {
      info(`Process abandonned for ${currentId}`);
    }
    return isIdDifferent;
  }
}

module.exports = Control;
