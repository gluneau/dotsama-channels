import { ApiPromise, WsProvider } from "@polkadot/api";
import { BN } from "bn.js";
import { equilibrium, genshiro } from "@equilab/definitions";

export async function getCurrencies(chain, paraId, endpoints, para) {
  const BN = require("bn.js");
  console.log("chain, paraId", chain, paraId);

  para = endpoints.find((c) => c.paraId === paraId);

  if (chain === "Rococo" && rocEndpoints.find((c) => c.paraId === paraId))
    para.providers = rocEndpoints.find((c) => c.paraId === paraId).providers;

  console.log("para", para);

  let assets = [];
  if (
    !assets.find((c) => c.paraId === paraId && c.chain === chain) ||
    !assets.find((c) => c.paraId === paraId && c.chain === chain).asset.length
  ) {
    let types = {};

    if (paraId === 2024 && (chain === "Kusama" || chain === "Rococo")) {
      types = genshiro.types;
    } else if (paraId === 2011 && chain === "Polkadot") {
      types = equilibrium.types;
    }

    console.log("types", types);
    const wss = Object.values(para.providers)[0];
    const provider = new WsProvider(wss);
    const api = await ApiPromise.create({ provider, types });

    const systemProperties = await api.rpc.system.properties();
    const symbol = systemProperties.tokenSymbol.value.toHuman()[0];
    const decimals = systemProperties.tokenDecimals.value.toHuman()[0];
    console.log("systemProperties", systemProperties);

    let asset = [];
    let assetMetadata = [];

    // ... (rest of the getCurrencies logic)

    if (assets.find((c) => c.paraId === paraId && c.chain === chain)) {
      assets.find((c) => c.paraId === paraId && c.chain === chain).asset =
        asset;
    } else {
      assets.push({
        chain,
        paraId,
        asset,
      });
    }

    console.log("assets", assets);
    await api.disconnect();
  }

  return { para, assets };
}
