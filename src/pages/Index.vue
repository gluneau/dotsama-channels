<template>
  <q-page class="flex flex-center">
    <v-network-graph :nodes="nodes" :edges="edges" :configs="configs" />
  </q-page>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { ForceLayout } from "v-network-graph/lib/force-layout";
import * as vNG from "v-network-graph";

export default defineComponent({
  name: "PageIndex",
  data() {
    return {
      layouts: {},
      configs: {},
      nodes: {},
      edges: {},
    };
  },
  async mounted() {
    const provider = new WsProvider("wss://kusama.api.onfinality.io/public-ws");
    console.log("provider", provider);
    const api = await ApiPromise.create({ provider });
    const hrmpChannels = await Promise.all([
      api.query.hrmp.hrmpChannels.entries(),
    ]);

    function t() {}

    // https://github.com/polkadot-js/apps/blob/master/packages/apps-config/src/endpoints/productionRelayKusama.ts
    const chain = [
      // (1) all system parachains (none available yet)
      // ...
      // (2) all common good parachains
      {
        info: "statemine",
        paraId: 1000,
        text: t("rpc.kusama.statemine", "Statemine", { ns: "apps-config" }),
        providers: {
          Parity: "wss://statemine-rpc.polkadot.io",
          OnFinality: "wss://statemine.api.onfinality.io/public-ws",
        },
        teleport: [-1],
      },
      {
        info: "encointer",
        homepage: "https://encointer.org/",
        paraId: 1001,
        text: t("rpc.kusama.encointer", "Encointer Network", {
          ns: "apps-config",
        }),
        providers: {
          "Encointer Association": "wss://api.kusama.encointer.org",
        },
        teleport: [-1],
      },
      /// (3) parachains with id, see Rococo (info here maps to the actual "named icon")
      //
      // NOTE: Added alphabetical based on chain name
      {
        info: "altair",
        homepage: "https://centrifuge.io/altair",
        paraId: 2088,
        text: t("rpc.kusama.altair", "Altair", { ns: "apps-config" }),
        providers: {
          Centrifuge: "wss://fullnode.altair.centrifuge.io",
          OnFinality: "wss://altair.api.onfinality.io/public-ws",
        },
      },
      {
        info: "basilisk",
        homepage: "https://bsx.fi",
        paraId: 2090,
        text: t("rpc.kusama.basilisk", "Basilisk", { ns: "apps-config" }),
        providers: {
          HydraDX: "wss://rpc-01.basilisk.hydradx.io",
          OnFinality: "wss://basilisk.api.onfinality.io/public-ws",
        },
      },
      {
        info: "bifrost",
        homepage: "https://ksm.vtoken.io/?ref=polkadotjs",
        paraId: 2001,
        text: t("rpc.kusama.bifrost", "Bifrost (Kusama)", {
          ns: "apps-config",
        }),
        providers: {
          "Liebi 0": "wss://bifrost-rpc.liebi.com/ws",
          "Liebi 1": "wss://us.bifrost-rpc.liebi.com/ws",
          "Liebi 2": "wss://eu.bifrost-rpc.liebi.com/ws",
          OnFinality: "wss://bifrost-parachain.api.onfinality.io/public-ws",
        },
      },
      {
        info: "bitcountryPioneer",
        homepage: "https://bit.country/?ref=polkadotjs",
        paraId: 2096,
        text: t("rpc.kusama.pioneerNetwork", "Bit.Country Pioneer", {
          ns: "apps-config",
        }),
        providers: {
          "Bit.Country": "wss://pioneer-1-rpc.bit.country",
          OnFinality: "wss://pioneer.api.onfinality.io/public-ws",
        },
      },
      {
        info: "calamari",
        homepage: "https://www.calamari.network/",
        paraId: 2084,
        text: t("rpc.calamari.systems", "Calamari", { ns: "apps-config" }),
        providers: {
          "Manta Network": "wss://ws.calamari.systems/",
          OnFinality: "wss://calamari.api.onfinality.io/public-ws",
        },
      },
      {
        info: "shadow",
        homepage: "https://crust.network/",
        paraId: 2012,
        text: t("rpc.kusama.shadow", "Crust Shadow", { ns: "apps-config" }),
        providers: {
          Crust: "wss://rpc-shadow.crust.network/",
        },
      },
      {
        info: "crab",
        homepage: "https://crab.network",
        paraId: 2105,
        text: t("rpc.kusama.crab", "Darwinia Crab Parachain", {
          ns: "apps-config",
        }),
        providers: {
          Crab: "wss://crab-parachain-rpc.darwinia.network/",
        },
      },
      {
        info: "genshiro",
        homepage: "https://genshiro.equilibrium.io",
        isUnreachable: true, // https://github.com/polkadot-js/apps/pull/6761
        paraId: 2024,
        text: t("rpc.kusama.genshiro", "Genshiro", { ns: "apps-config" }),
        providers: {
          Equilibrium: "wss://node.genshiro.io",
        },
      },
      {
        info: "integritee",
        homepage: "https://integritee.network",
        paraId: 2015,
        text: t("rpc.kusama.integritee", "Integritee Network", {
          ns: "apps-config",
        }),
        providers: {
          Integritee: "wss://kusama.api.integritee.network",
        },
      },
      {
        info: "karura",
        homepage: "https://acala.network/karura/join-karura",
        paraId: 2000,
        text: t("rpc.kusama.karura", "Karura", { ns: "apps-config" }),
        providers: {
          "Acala Foundation 0": "wss://karura-rpc-0.aca-api.network",
          "Acala Foundation 1": "wss://karura-rpc-1.aca-api.network",
          "Acala Foundation 2": "wss://karura-rpc-2.aca-api.network/ws",
          "Acala Foundation 3": "wss://karura-rpc-3.aca-api.network/ws",
          "Polkawallet 0": "wss://karura.polkawallet.io",
          OnFinality: "wss://karura.api.onfinality.io/public-ws",
        },
      },
      {
        info: "khala",
        homepage: "https://phala.network/",
        paraId: 2004,
        text: t("rpc.kusama.khala", "Khala Network", { ns: "apps-config" }),
        providers: {
          Phala: "wss://khala-api.phala.network/ws",
          OnFinality: "wss://khala.api.onfinality.io/public-ws",
        },
      },
      {
        info: "kico",
        homepage: "https://dico.io/",
        paraId: 2107,
        text: t("rpc.kusama.kico", "KICO", { ns: "apps-config" }),
        providers: {
          "DICO FOUNDATION": "wss://rpc.kico.dico.io",
          OnFinality: "wss://rpc.api.kico.dico.io",
        },
      },
      {
        info: "kilt",
        homepage: "https://www.kilt.io/",
        paraId: 2086,
        text: t("rpc.kusama.kilt", "KILT Spiritnet", { ns: "apps-config" }),
        providers: {
          "KILT Protocol": "wss://spiritnet.kilt.io/",
          OnFinality: "wss://spiritnet.api.onfinality.io/public-ws",
          Dwellir: "wss://kilt-rpc.dwellir.com",
        },
      },
      {
        info: "kintsugi",
        homepage: "https://kintsugi.interlay.io/",
        paraId: 2092,
        text: t("rpc.kusama.kintsugi", "Kintsugi BTC", { ns: "apps-config" }),
        providers: {
          "Kintsugi Labs": "wss://api-kusama.interlay.io/parachain",
          OnFinality: "wss://kintsugi.api.onfinality.io/public-ws",
        },
      },
      {
        info: "kpron",
        homepage: "http://apron.network/",
        isUnreachable: true,
        paraId: 2019,
        text: t("rpc.kusama.kpron", "Kpron", { ns: "apps-config" }),
        providers: {
          Kpron: "wss://kusama-kpron-rpc.apron.network/",
        },
      },
      {
        info: "litmus",
        homepage: "https://kusama-crowdloan.litentry.com",
        paraId: 2106,
        isUnreachable: false,
        text: t("rpc.kusama.litmus", "Litmus", { ns: "apps-config" }),
        providers: {
          Litentry: "wss://rpc.litmus-parachain.litentry.io",
        },
      },
      {
        info: "loomNetwork",
        isUnreachable: true, // https://github.com/polkadot-js/apps/issues/5888
        homepage: "https://loomx.io/",
        paraId: 2080,
        text: t("rpc.kusama.loomnetwork", "Loom Network", {
          ns: "apps-config",
        }),
        providers: {
          LoomNetwork: "wss://kusama.dappchains.com",
        },
      },
      {
        info: "mangata",
        isUnreachable: true, // https://github.com/polkadot-js/apps/issues/5888
        homepage: "https://mangata.finance",
        paraId: 2110,
        text: t("rpc.mangata", "Mangata", { ns: "apps-config" }),
        providers: {
          Mangata: "wss://v4-prod-collator-01.mangatafinance.cloud",
        },
      },
      {
        info: "mars",
        homepage: "https://www.aresprotocol.io/mars",
        paraId: 2008,
        text: t("rpc.kusama.mars", "Mars", { ns: "apps-config" }),
        providers: {
          AresProtocol: "wss://wss.mars.aresprotocol.io",
        },
      },
      {
        info: "moonriver",
        homepage: "https://moonbeam.foundation/moonriver-crowdloan/",
        paraId: 2023,
        text: t("rpc.kusama.moonriver", "Moonriver", { ns: "apps-config" }),
        providers: {
          "Moonbeam Foundation": "wss://wss.api.moonriver.moonbeam.network",
          OnFinality: "wss://moonriver.api.onfinality.io/public-ws",
          Dwellir: "wss://moonriver-rpc.dwellir.com",
          // Pinknode: 'wss://rpc.pinknode.io/moonriver/explorer' // https://github.com/polkadot-js/apps/issues/7058
        },
      },
      {
        info: "heiko",
        homepage: "https://parallel.fi",
        paraId: 2085,
        text: t("rpc.kusama.heiko", "Parallel Heiko", { ns: "apps-config" }),
        providers: {
          OnFinality: "wss://parallel-heiko.api.onfinality.io/public-ws",
          Parallel: "wss://heiko-rpc.parallel.fi",
        },
      },
      {
        info: "picasso",
        homepage: "https://picasso.composable.finance/",
        paraId: 2087,
        text: t("rpc.kusama.picasso", "Picasso", { ns: "apps-config" }),
        providers: {
          Composable: "wss://picasso-rpc.composable.finance",
        },
      },
      {
        info: "pichiu",
        homepage: "https://kylin.network/",
        paraId: 2102,
        text: t("rpc.kusama.pichiu", "Pichiu", { ns: "apps-config" }),
        providers: {
          "Kylin Network": "wss://kusama.kylin-node.co.uk",
        },
      },
      {
        info: "polkasmith",
        isUnreachable: true, // https://github.com/polkadot-js/apps/issues/6595
        homepage: "https://polkasmith.polkafoundry.com/",
        paraId: 2009,
        text: t("rpc.kusama.polkasmith", "PolkaSmith by PolkaFoundry", {
          ns: "apps-config",
        }),
        providers: {
          PolkaSmith: "wss://wss-polkasmith.polkafoundry.com",
        },
      },
      {
        info: "quartz",
        homepage: "https://unique.network/",
        paraId: 2095,
        text: t("quartz.unique.network", "QUARTZ by UNIQUE", {
          ns: "apps-config",
        }),
        providers: {
          Unique: "wss://quartz.unique.network",
          OnFinality: "wss://quartz.api.onfinality.io/public-ws",
          "Unique Europe": "wss://eu-ws-quartz.unique.network",
          "Unique US": "wss://us-ws-quartz.unique.network",
        },
      },
      {
        info: "robonomics",
        homepage: "http://robonomics.network/",
        paraId: 2048,
        text: t("rpc.kusama.robonomics", "Robonomics", { ns: "apps-config" }),
        providers: {
          Airalab: "wss://kusama.rpc.robonomics.network/",
        },
      },
      {
        info: "trustbase",
        isUnreachable: true, // no providers (yet)
        homepage: "https://trustbase.network/",
        paraId: 2078,
        text: t("rpc.kusama.trustbase", "TrustBase", { ns: "apps-config" }),
        providers: {},
      },
      {
        info: "sakura",
        homepage: "https://clover.finance/",
        isUnreachable: true,
        paraId: 2016,
        text: t("rpc.kusama.sakura", "Sakura", { ns: "apps-config" }),
        providers: {
          Clover: "wss://api-sakura.clover.finance",
        },
      },
      {
        info: "shiden",
        homepage: "https://shiden.plasmnet.io/",
        paraId: 2007,
        text: t("rpc.kusama.shiden", "Shiden", { ns: "apps-config" }),
        providers: {
          StakeTechnologies: "wss://rpc.shiden.astar.network",
          OnFinality: "wss://shiden.api.onfinality.io/public-ws",
          Pinknode: "wss://rpc.pinknode.io/shiden/explorer",
        },
      },
      {
        info: "sora_ksm",
        homepage: "https://sora.org/",
        paraId: 2011,
        text: t("rpc.kusama.sora_ksm", "SORA Kusama Parachain", {
          ns: "apps-config",
        }),
        providers: {
          Soramitsu: "wss://ws.parachain-collator-1.c1.sora2.soramitsu.co.jp",
        },
      },
      {
        info: "subgame",
        homepage: "http://subgame.org/",
        paraId: 2018,
        text: t("rpc.kusama.subgame", "SubGame Gamma", { ns: "apps-config" }),
        providers: {
          SubGame: "wss://gamma.subgame.org/",
        },
      },
      {
        info: "subsocial",
        homepage: "https://subsocial.network/",
        paraId: 2100,
        text: t("rpc.kusama.subsocial", "Subsocial", { ns: "apps-config" }),
        providers: {
          Dappforce: "wss://para.subsocial.network",
        },
      },
      {
        info: "unorthodox",
        homepage: "https://standard.tech/",
        paraId: 2094,
        text: t("rpc.kusama.standard", "Unorthodox", { ns: "apps-config" }),
        providers: {
          "Standard Protocol": "wss://rpc.kusama.standard.tech",
        },
      },
      {
        info: "zeitgeist",
        homepage: "https://zeitgeist.pm",
        paraId: 2101,
        text: t("rpc.kusama.zeitgeist", "Zeitgeist", { ns: "apps-config" }),
        providers: {
          ZeitgeistPM: "wss://rpc-0.zeitgeist.pm",
        },
      },
    ];

    hrmpChannels[0].map((e) => {
      const h = e[0].toHuman();
      const sender = parseInt(h[0].sender.replace(",", ""), 10);
      const recipient = parseInt(h[0].recipient.replace(",", ""), 10);

      this.nodes["node" + sender] = {
        id: "node" + sender,
        name: chain.find((c) => c.paraId === sender).info,
      };

      this.nodes["node" + recipient] = {
        id: "node" + recipient,
        name: chain.find((c) => c.paraId === recipient).info,
      };

      this.edges["edge" + sender + "-" + recipient] = {
        source: "node" + sender,
        target: "node" + recipient,
      };
    });

    this.configs = reactive(
      vNG.defineConfigs({
        view: {
          layoutHandler: new ForceLayout({
            positionFixedByDrag: false,
            positionFixedByClickWithAltKey: true,
          }),
        },
        node: {
          normal: {
            color: (n) => (n.id === "node2000" ? "#ff0000" : "#4466cc"),
          },
          label: {
            visible: true,
            fontSize: 20,
          },
        },
        edge: {
          selectable: true,
          normal: {
            width: 3,
            color: "#4466cc",
            dasharray: "0",
            linecap: "butt",
            animate: false,
            animationSpeed: 50,
          },
          hover: {
            width: 4,
            color: "#3355bb",
            dasharray: "0",
            linecap: "butt",
            animate: false,
            animationSpeed: 50,
          },
          selected: {
            width: 3,
            color: "#dd8800",
            dasharray: "6",
            linecap: "round",
            animate: false,
            animationSpeed: 50,
          },
          gap: 5,
          type: "straight",
          margin: 2,
          marker: {
            source: {
              type: "none",
              width: 4,
              height: 4,
              margin: -1,
              units: "strokeWidth",
              color: null,
            },
            target: {
              type: "arrow",
              width: 4,
              height: 4,
              margin: -1,
              units: "strokeWidth",
              color: null,
            },
          },
        },
      })
    );

    this.layouts = {
      nodes: {
        node2000: {
          x: 0,
          y: 0,
          fixed: true, // Unaffected by force
        },
      },
    };
    console.log("nodes", this.nodes);
    console.log("edges", this.edges);

    await api.disconnect();
  },
});
</script>
