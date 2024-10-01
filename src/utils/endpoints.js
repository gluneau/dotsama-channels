import { prodParasKusama, prodParasKusamaCommon } from "./prodParasKusama";
import { prodParasPolkadot, prodParasPolkadotCommon } from "./prodParasPolkadot";

export function getEndpoints(chain) {
  let endpoints = [];

  switch (chain) {
    case "Kusama":
    case "Rococo":
      endpoints = prodParasKusama + prodParasKusamaCommon;
      break;

    case "Polkadot":
    case "Westend":
      endpoints = prodParasPolkadot + prodParasPolkadotCommon;
      break;
  }

  // Common endpoints for all networks
  // endpoints.push(
  //   {
  //     info: chain + "AssetHub",
  //     isPeopleForIdentity: true,
  //     paraId: 1000,
  //     providers: {
  //       Dwellir: "wss://asset-hub-" + chain.toLowerCase() + "-rpc.dwellir.com",
  //       "Dwellir Tunisia": "wss://statemint-rpc-tn.dwellir.com",
  //       IBP1: "wss://sys.ibp.network/asset-hub-" + chain.toLowerCase(),
  //       IBP2: "wss://asset-hub-" + chain.toLowerCase() + ".dotters.network",
  //       LuckyFriday:
  //         "wss://rpc-asset-hub-" + chain.toLowerCase() + ".luckyfriday.io",
  //       Parity: "wss://" + chain.toLowerCase() + "-asset-hub-rpc.polkadot.io",
  //       Stakeworld:
  //         "wss://" +
  //         (chain === "Polkadot" ? "dot" : "ksm") +
  //         "-rpc.stakeworld.io/assethub",
  //     },
  //     relayName: chain.toLowerCase(),
  //     teleport: [-1],
  //     text: "AssetHub",
  //     ui: {
  //       color: chain === "Polkadot" ? "#86e62a" : "#113911",
  //       logo: chain === "Polkadot" ? nodesAssetHubSVG : chainsAssethubKusamaSVG,
  //     },
  //   },
  //   {
  //     info: chain.toLowerCase() + "BridgeHub",
  //     isPeopleForIdentity: true,
  //     paraId: 1002,
  //     providers: {
  //       Dwellir: "wss://bridge-hub-" + chain.toLowerCase() + "-rpc.dwellir.com",
  //       "Dwellir Tunisia":
  //         "wss://" + chain.toLowerCase() + "-bridge-hub-rpc-tn.dwellir.com",
  //       IBP1: "wss://sys.ibp.network/bridgehub-" + chain.toLowerCase(),
  //       IBP2: "wss://bridge-hub-" + chain.toLowerCase() + ".dotters.network",
  //       LuckyFriday:
  //         "wss://rpc-bridge-hub-" + chain.toLowerCase() + ".luckyfriday.io",
  //       Parity: "wss://" + chain.toLowerCase() + "-bridge-hub-rpc.polkadot.io",
  //       Stakeworld:
  //         "wss://" +
  //         (chain === "Polkadot" ? "dot" : "ksm") +
  //         "-rpc.stakeworld.io/bridgehub",
  //     },
  //     relayName: chain.toLowerCase(),
  //     teleport: [-1],
  //     text: "BridgeHub",
  //     ui: {
  //       logo: chain === "Polkadot" ? nodesBridgeHubSVG : nodesBridgeHubBlackSVG,
  //     },
  //   }
  //   // ... More common endpoints ...
  // );

  return endpoints;
}

export const rocEndpoints = [
  // {
  //   info: "rococoAmplitude",
  //   paraId: 2124,
  //   text: "Amplitude",
  //   providers: {
  //     PendulumChain: "wss://pencol-roc-00.pendulumchain.tech",
  //   },
  // },
  // {
  //   info: "arctic",
  //   paraId: 3015,
  //   text: "Arctic",
  //   providers: {
  //     Arctic: "wss://arctic-rococo-rpc.icenetwork.io",
  //   },
  // },
  // ... More Rococo-specific endpoints ...
];

// You can add more utility functions here if needed
