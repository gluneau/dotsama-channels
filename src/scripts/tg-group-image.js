const fs = require("fs");
const svg2png = require("svg2png");
const axios = require("axios");
const sharp = require("sharp");
const mergeImages = require("merge-images");

const acala = 2000;
const ateam = 2004;

const acalaSvg = "https://acala.network/static/media/ACA.0fcdc69c.svg";
// const acalaSvg =
//   "https://raw.githubusercontent.com/TalismanSociety/chaindata/multi-relay-chain-future/0/parathreads/" +
//   acala +
//   "/assets/logo.svg";

const transform = async (sourceBuffer, size, name) => {
  return svg2png(sourceBuffer, { width: size, height: size })
    .then((buffer) => {
      fs.writeFileSync(`${name}.png`, buffer);
    })
    .catch((e) => console.error(e));
};

const main = async () => {
  const promises = [];
  const acalaBuffer = (await axios.get(acalaSvg)).data;

  const ateamBuffer = (
    await axios.get(
      "https://raw.githubusercontent.com/TalismanSociety/chaindata/multi-relay-chain-future/0/parathreads/" +
        ateam +
        "/assets/logo.svg"
    )
  ).data;

  sharp(svg2png(acalaBuffer, { width: 512, height: 512 }))
    .resize(512, 256)
    .toFile("acalaresize.png");

  promises.push(transform(acalaBuffer, 512, "acala"));
  promises.push(transform(ateamBuffer, 512, "moonbeam"));

  await Promise.all(promises);
};

main();
