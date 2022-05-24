const fs = require("fs");
const svg2png = require("svg2png");
const axios = require("axios");
const sharp = require("sharp");

const acala = 2000;
const ateam = 2013;
const ateamname = "novawallet";

const acalaSvg = "https://acala.network/static/media/ACA.0fcdc69c.svg";
const ateamSvg =
  "https://miro.medium.com/fit/c/96/96/1*2w5d0BCSPjlJn_jjEhBAnw.png";

// const ateamSvg =
//   "https://raw.githubusercontent.com/TalismanSociety/chaindata/multi-relay-chain-future/0/parathreads/" +
//   ateam +
//   "/assets/logo.svg";

const main = async () => {
  const acalaBuffer = (await axios.get(acalaSvg)).data;

  await svg2png(acalaBuffer, { width: 512, height: 512 })
    .then((buffer) => {
      sharp(buffer)
        .extract({ left: 0, top: 0, height: 512, width: 256 })
        .extend({ right: 256, background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .toFile("acalahalf.png");
    })
    .catch((e) => console.error(e));

  let ateamBuffer = "";
  if (ateamSvg.startsWith("/")) {
    ateamBuffer = fs.readFileSync(ateamSvg);
  } else {
    try {
      ateamBuffer = (await axios.get(ateamSvg, { responseType: "arraybuffer" }))
        .data;
    } catch (error) {
      console.log("get svg", error);
    }
  }

  if (!ateamBuffer) {
    await svg2png(ateamBuffer, { width: 512, height: 512 })
      .then((buffer) => {
        sharp(buffer)
          .extract({ left: 256, top: 0, height: 512, width: 256 })
          .extend({ left: 256, background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .composite([{ input: "acalahalf.png", gravity: "southwest" }])
          .toFile("acala-" + ateamname + ".png");
      })
      .catch((e) => console.error(e));
  } else {
    try {
      sharp(ateamBuffer)
        .extract({ left: 256, top: 0, height: 512, width: 256 })
        .extend({ left: 256, background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .composite([{ input: "acalahalf.png", gravity: "southwest" }])
        .toFile("acala-" + ateamname + ".png");

      // const metadata = await ateamBuffer.pipe().sharp().metadata();
      // console.log("metadata", metadata);
    } catch (error) {
      console.error(error);
    }

    // await sharp(ateamBuffer)
    //   .extract({ left: 256, top: 0, height: 512, width: 256 })
    //   .extend({ left: 256, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    //   .composite([{ input: "acalahalf.png", gravity: "southwest" }])
    //   .toFile("acala-" + ateamname + ".png");
  }
};

main();
