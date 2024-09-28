import {
  chainsAbandPNG,
  chainsAcurastPNG,
  chainsAltairSVG,
  chainsAmplitudeSVG,
  chainsAssethubKusamaSVG,
  chainsCoretimeKusamaSVG,
  chainsDorafactoryPNG,
  chainsGenshiroSVG,
  chainsGmJPEG,
  chainsKaruraSVG,
  chainsKicoPNG,
  chainsKintsugiPNG,
  chainsKreivoSVG,
  chainsKusamaSVG,
  chainsListenPNG,
  chainsMangataPNG,
  chainsPeopleKusamaSVG,
  chainsQpnPNG,
  chainsRiodefiPNG,
  chainsShidenPNG,
  chainsTinkerPNG,
  chainsTuringPNG,
  chainsUnorthodoxPNG,
  chainsAcalaSVG,
  chainsBitgreenPNG,
  chainsComposableFinancePNG,
  chainsEquilibriumSVG,
  chainsFrequencySVG,
  chainsGeminisPNG,
  chainsHydrationSVG,
  chainsInvarchJPEG,
  chainsLaosPNG,
  chainsLogionPNG,
  chainsNeurowebPNG,
  chainsOakPNG,
  chainsPeaqPNG,
  chainsPendulumSVG,
  chainsPeoplePolkadotSVG,
  chainsPolkadotCircleSVG,
  chainsTotemSVG,
  chainsWatrPNG,
} from "../assets/chains/index.ts";

import {
  nodesApronPNG,
  nodesAresMarsPNG,
  nodesBajunPNG,
  nodesBasiliskPNG,
  nodesBitcountryPNG,
  nodesBridgeHubBlackSVG,
  nodesCalamariPNG,
  nodesCrabSVG,
  nodesCurioSVG,
  nodesDatahighwayPNG,
  nodesEncointerBlueSVG,
  nodesImbuePNG,
  nodesIpciSVG,
  nodesKabochaSVG,
  nodesKhalaSVG,
  nodesKrestPNG,
  nodesLitmusPNG,
  nodesLoomNetworkPNG,
  nodesMoonriverSVG,
  nodesPicassoPNG,
  nodesPichiuPNG,
  nodesPolkasmithSVG,
  nodesQuartzPNG,
  nodesSakuraSVG,
  nodesShadowSVG,
  nodesSnowPNG,
  nodesSubsocialXSVG,
  nodesT1rnPNG,
  nodesTrustbasePNG,
  nodesXodePNG,
  nodesYerbanetworkPNG,
  nodesZeroSVG,
  nodesAjunaPNG,
  nodesAresOdysseySVG,
  nodesAssetHubSVG,
  nodesAstarPNG,
  nodesAventusSVG,
  nodesBifrostSVG,
  nodesBridgeHubSVG,
  nodesCentrifugePNG,
  nodesCloverSVG,
  nodesCoinversationPNG,
  nodesContinuumPNG,
  nodesCrustParachainSVG,
  nodesDarwiniaSVG,
  nodesEfinitySVG,
  nodesEwxSVG,
  nodesHashedPNG,
  nodesHyperbridgePNG,
  nodesIntegriteeSVG,
  nodesInterlaySVG,
  nodesKiltPNG,
  nodesKylinPNG,
  nodesLitentryPNG,
  nodesMantaPNG,
  nodesMoonbeamSVG,
  nodesMoonsamaSVG,
  nodesMythosPNG,
  nodesNodleSVG,
  nodesOmnibtcSVG,
  nodesParallelSVG,
  nodesPhalaSVG,
  nodesPolimecSVG,
  nodesPolkadexSVG,
  nodesRobonomicsSVG,
  nodesSoraSubstrateSVG,
  nodesSubdaoPNG,
  nodesSubgameSVG,
  nodesSubsocialSVG,
  nodesT3rnPNG,
  nodesUniqueSVG,
  nodesZeitgeistPNG,
} from "../assets/nodes/index.ts";

export function getEndpoints(chain) {
  let endpoints = [];

  switch (chain) {
    case "Kusama":
    case "Rococo":
      endpoints = [
        {
          homepage: "https://a.band",
          info: "aband",
          paraId: 2257,
          providers: {
            // 'Aband DAO': 'wss://rpc-parachain.a.band' // https://github.com/polkadot-js/apps/issues/9334
          },
          text: "Aband",
          ui: {
            color: "#7358ff",
            logo: chainsAbandPNG,
          },
        },
        {
          homepage: "https://acurast.com",
          info: "acurast",
          paraId: 2239,
          providers: {
            Acurast: "wss://public-rpc.canary.acurast.com",
          },
          text: "Acurast Canary",
          ui: {
            color: "#000000",
            logo: chainsAcurastPNG,
          },
        },
        {
          homepage: "https://centrifuge.io/altair",
          info: "altair",
          paraId: 2088,
          providers: {
            Centrifuge: "wss://fullnode.altair.centrifuge.io",
            OnFinality: "wss://altair.api.onfinality.io/public-ws",
          },
          text: "Altair",
          ui: {
            color: "#ffb700",
            logo: chainsAltairSVG,
          },
        },
        // ... More Kusama/Rococo endpoints ...
      ];
      break;

    case "Polkadot":
    case "Westend":
      endpoints = [
        {
          homepage: "https://acala.network/",
          info: "acala",
          paraId: 2000,
          providers: {
            "Acala Foundation 0": "wss://acala-rpc-0.aca-api.network",
            "Acala Foundation 1": "wss://acala-rpc-1.aca-api.network",
            "Acala Foundation 3": "wss://acala-rpc-3.aca-api.network/ws",
            Dwellir: "wss://acala-rpc.dwellir.com",
            OnFinality: "wss://acala-polkadot.api.onfinality.io/public-ws",
          },
          text: "Acala",
          ui: {
            color: "#645AFF",
            logo: chainsAcalaSVG,
          },
        },
        {
          homepage: "https://ajuna.io",
          info: "ajuna",
          paraId: 2051,
          providers: {
            AjunaNetwork: "wss://rpc-para.ajuna.network",
            IBP1: "wss://ajuna.ibp.network",
            IBP2: "wss://ajuna.dotters.network",
            OnFinality: "wss://ajuna.api.onfinality.io/public-ws",
            RadiumBlock: "wss://ajuna.public.curie.radiumblock.co/ws",
          },
          text: "Ajuna Network",
          ui: {
            color: "#161212",
            logo: nodesAjunaPNG,
          },
        },
        // ... More Polkadot/Westend endpoints ...
      ];
      break;
  }

  // Common endpoints for all networks
  endpoints.push(
    {
      info: chain + "AssetHub",
      isPeopleForIdentity: true,
      paraId: 1000,
      providers: {
        Dwellir: "wss://asset-hub-" + chain.toLowerCase() + "-rpc.dwellir.com",
        "Dwellir Tunisia": "wss://statemint-rpc-tn.dwellir.com",
        IBP1: "wss://sys.ibp.network/asset-hub-" + chain.toLowerCase(),
        IBP2: "wss://asset-hub-" + chain.toLowerCase() + ".dotters.network",
        LuckyFriday:
          "wss://rpc-asset-hub-" + chain.toLowerCase() + ".luckyfriday.io",
        Parity: "wss://" + chain.toLowerCase() + "-asset-hub-rpc.polkadot.io",
        Stakeworld:
          "wss://" +
          (chain === "Polkadot" ? "dot" : "ksm") +
          "-rpc.stakeworld.io/assethub",
      },
      relayName: chain.toLowerCase(),
      teleport: [-1],
      text: "AssetHub",
      ui: {
        color: chain === "Polkadot" ? "#86e62a" : "#113911",
        logo: chain === "Polkadot" ? nodesAssetHubSVG : chainsAssethubKusamaSVG,
      },
    },
    {
      info: chain.toLowerCase() + "BridgeHub",
      isPeopleForIdentity: true,
      paraId: 1002,
      providers: {
        Dwellir: "wss://bridge-hub-" + chain.toLowerCase() + "-rpc.dwellir.com",
        "Dwellir Tunisia":
          "wss://" + chain.toLowerCase() + "-bridge-hub-rpc-tn.dwellir.com",
        IBP1: "wss://sys.ibp.network/bridgehub-" + chain.toLowerCase(),
        IBP2: "wss://bridge-hub-" + chain.toLowerCase() + ".dotters.network",
        LuckyFriday:
          "wss://rpc-bridge-hub-" + chain.toLowerCase() + ".luckyfriday.io",
        Parity: "wss://" + chain.toLowerCase() + "-bridge-hub-rpc.polkadot.io",
        Stakeworld:
          "wss://" +
          (chain === "Polkadot" ? "dot" : "ksm") +
          "-rpc.stakeworld.io/bridgehub",
      },
      relayName: chain.toLowerCase(),
      teleport: [-1],
      text: "BridgeHub",
      ui: {
        logo: chain === "Polkadot" ? nodesBridgeHubSVG : nodesBridgeHubBlackSVG,
      },
    }
    // ... More common endpoints ...
  );

  return endpoints;
}

export const rocEndpoints = [
  {
    info: "rococoAmplitude",
    paraId: 2124,
    text: "Amplitude",
    providers: {
      PendulumChain: "wss://pencol-roc-00.pendulumchain.tech",
    },
  },
  {
    info: "arctic",
    paraId: 3015,
    text: "Arctic",
    providers: {
      Arctic: "wss://arctic-rococo-rpc.icenetwork.io",
    },
  },
  // ... More Rococo-specific endpoints ...
];

// You can add more utility functions here if needed
