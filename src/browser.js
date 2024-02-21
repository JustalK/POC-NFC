const fs = require("fs");
const exec = require("child_process").exec;

module.exports = {
  openBrowser: async () => {
    exec(
      "DISPLAY=:0.0 chromium-browser --noerrdialogs --disable-infobars --kiosk http://localhost:3000",
      (err, stdout, stderr) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(stdout);
      }
    );
  },
  save: (page, message, message2, message3) => {
    fs.writeFileSync(
      "www/result.json",
      JSON.stringify({ page, message, message2, message3 })
    );
  },
};
