const fs = require("fs");
const svg2png = require("svg2png");
const axios = require("axios");
const sharp = require("sharp");

const acala = 2000;
const ateam = 2123;
const network = 2; // 2 for Kusama, 0 for Polkadot
const ateamname = "gm";

const acalaSvg = "https://acala.network/static/media/ACA.0fcdc69c.svg";
// const ateamSvg = "/home/gluneau/Downloads/zeitgeist.svg";

const ateamSvg =
  "https://raw.githubusercontent.com/TalismanSociety/chaindata/multi-relay-chain-future/" +
  network +
  "/parathreads/" +
  ateam +
  "/assets/logo.svg";

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
      console.log("got svg");
    } catch (error) {
      console.log("get svg", error);
    }
  }

  if (ateamBuffer) {
    console.log("convert to png");
    await svg2png(ateamBuffer, { width: 512, height: 512 })
      .then((buffer) => {
        console.log("got buffer");
        sharp(buffer)
          .extract({ left: 256, top: 0, height: 512, width: 256 })
          .extend({ left: 256, background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .composite([{ input: "acalahalf.png", gravity: "southwest" }])
          .toFile("acala-" + ateamname + ".png");
      })
      .catch((e) => console.error(e));
  } else {
    console.log("going to extract");
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
