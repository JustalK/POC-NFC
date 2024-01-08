const fs = require("fs");

module.exports = {
  openBrowser: async () => {
    const { default: open } = await import("open");
    await open("http://localhost:3000/");
  },
  save: (page, message, message2, message3) => {
    fs.writeFileSync("www/result.json", JSON.stringify({ page, message, message2, message3 }));
  },
};
