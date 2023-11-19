const cp = require("child_process");
const fs = require("fs");
const decompress = require("decompress");

const PROJECT_NAME = "POC-NFC";

/**
 * Download the zip file from the url
 */
const download = function () {
  cp.execSync(
    `curl -L -O https://github.com/JustalK/${PROJECT_NAME}/archive/refs/heads/master.zip`
  );
};

/**
 * Get the actual sha from the project on gihtub
 * @returns {String} The actual sha
 */
const getSha = function () {
  const data = cp
    .execSync(
      `curl https://api.github.com/repos/justalk/${PROJECT_NAME}/commits/master`
    )
    .toString();
  const info = JSON.parse(data);
  const { sha } = info;
  return sha;
};

/**
 * Get the previous sha from the file containing the latest version
 * @returns {String} The latest sha
 */
const getPreviousSha = function () {
  const previousResult = fs.readFileSync("./sha.json");
  const previousInfo = JSON.parse(previousResult);
  return previousInfo.sha;
};

/**
 * Update the project if the sha version are different bewteen actual project and the version on the server
 */
async function update() {
  const sha = getSha();
  const previousSha = getPreviousSha();

  if (sha !== previousSha) {
    fs.writeFileSync("sha.json", JSON.stringify({ sha }));
    download();
    await decompress("master.zip", ".");
    fs.unlinkSync("master.zip");
  }
}

update();
