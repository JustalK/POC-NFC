const cp = require("child_process");
const decompress = require("decompress");

const URL =
  "https://github.com/JustalK/PROJECT-PRESENTATION/archive/refs/heads/master.zip";
const URL_PROJECT =
  "https://api.github.com/repos/justalk/PROJECT-WIPEOUT/commits/master";

const download = async function (url) {
  let command = `curl -L -O ${url}`;
  cp.execSync(command);
};

const getInfo = async function () {
  let command = `curl ${URL_PROJECT} -H "Accept: application/json"`;
  return cp.execSync(command);
};

async function test() {
  const result = await getInfo();
  console.log(result);
  /**
  await download(URL);
  await decompress("master.zip", "dist");
  **/
}

test();
