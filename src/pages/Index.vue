<template>
  <q-layout view="hHh lpR fFf">
    <app-header
      :chain="chain"
      :chainOptions="chainOptions"
      :mode="mode"
      @toggleLeftDrawer="toggleLeftDrawer"
      @toggleRightDrawer="toggleRightDrawer"
      @updateChain="updateChain"
      @updateMode="updateMode"
    />

    <q-page-container>
      <q-page class="flex flex-center">
        <network-graph
          :nodes="nodes"
          :edges="edges"
          :configs="configs"
          :zoom-level="2.0"
          :layers="layers"
          :event-handlers="eventHandlers"
          :chain="chain.label"
          :endpoints="endpoints"
        />
        <parachain-dialog
          v-model="dialog"
          :para="para"
          :assets="assets"
          :chain="chain.label"
        />
      </q-page>
    </q-page-container>

    <left-drawer
      v-model="leftDrawerOpen"
      :items="items"
      :chain="chain.label"
      @getCurrencies="getCurrencies"
    />

    <right-drawer v-model="rightDrawerOpen" />
  </q-layout>
</template>

<script>
import { defineComponent, reactive, ref, computed, watch } from "vue";
import { useQuasar } from "quasar";
import { Loading, QSpinnerGears } from "quasar";
import { version } from "../../package.json";
import { ApiPromise, WsProvider } from "@polkadot/api";

import AppHeader from "components/AppHeader.vue";
import NetworkGraph from "components/NetworkGraph.vue";
import ParachainDialog from "components/ParachainDialog.vue";
import LeftDrawer from "components/LeftDrawer.vue";
import RightDrawer from "components/RightDrawer.vue";

import { getEndpoints } from "../utils/endpoints";
import { setupConfigs } from "../utils/graphConfigs";
import { setupEventHandlers } from "../utils/eventHandlers";
import { getCurrencies } from "../utils/currencies";

export default defineComponent({
  name: "PageIndex",
  components: {
    AppHeader,
    NetworkGraph,
    ParachainDialog,
    LeftDrawer,
    RightDrawer,
  },

  setup() {
    const $q = useQuasar();
    $q.dark.set(true);

    return {
      version,
      $q,
    };
  },

  data() {
    return {
      chain: {
        label: "Polkadot",
        value: "wss://polkadot.api.onfinality.io/public-ws",
      },
      chainOptions: [
        {
          label: "Polkadot",
          value: "wss://polkadot.api.onfinality.io/public-ws",
        },
        { label: "Kusama", value: "wss://kusama.api.onfinality.io/public-ws" },
        { label: "Rococo", value: "wss://rococo-rpc.polkadot.io/public-ws" },
        { label: "Westend", value: "wss://westend-rpc.polkadot.io/public-ws" },
      ],
      mode: true,
      dialog: false,
      leftDrawerOpen: false,
      rightDrawerOpen: false,
      nodes: {},
      edges: {},
      configs: {},
      layers: {},
      eventHandlers: {},
      items: {},
      para: { info: "Acala", paraId: 2000 },
      assets: [{ chain: "Polkadot", paraId: 2000, asset: [] }],
      endpoints: [],
      rocEndpoints: [],
      nodeOver: null,
    };
  },

  computed: {
    itemsArray() {
      return Object.values(this.items);
    },
  },

  watch: {
    async chain() {
      await this.loadData();
    },
    mode() {
      this.updateDarkMode();
    },
    nodeOver() {
      this.updateConfigs();
    },
  },

  async mounted() {
    if (this.$route.params.chain) {
      this.setInitialChain();
    }

    await this.loadData();

    if (this.$route.params.para) {
      this.handleParaSelection();
    }
  },

  methods: {
    // ... (other methods remain the same) ...

    updateDarkMode() {
      this.$q.dark.set(this.mode);
      this.updateConfigs();
    },

    updateConfigs() {
      this.configs = setupConfigs(
        this.mode,
        this.$q.dark.isActive,
        this.nodeOver
      );
    },

    async loadData() {
      Loading.show({
        spinner: QSpinnerGears,
        message: "Loading data from the parachain. Hang on...",
      });

      this.endpoints = getEndpoints(this.chain.label);

      await this.fetchParachainData();

      this.setupGraphData();
      this.updateConfigs();
      this.eventHandlers = setupEventHandlers(this.nodes, (nodeId) => {
        this.nodeOver = nodeId
          ? parseInt(nodeId.replace("node", ""), 10)
          : null;
      });

      Loading.hide();
    },
    async fetchParachainData() {
      const provider = new WsProvider(this.chain.value);
      const api = await ApiPromise.create({ provider });
      const [hrmpChannels, requestsList] = await Promise.all([
        api.query.hrmp.hrmpChannels.entries(),
        api.query.hrmp.hrmpOpenChannelRequestsList(),
      ]);

      this.processHrmpChannels(hrmpChannels);
      this.processRequestsList(requestsList);

      await api.disconnect();
    },
    processHrmpChannels(hrmpChannels) {
      hrmpChannels.forEach((e) => {
        const h = e[0].toHuman();
        let sender = parseInt(h[0].sender.replace(",", ""), 10);
        let recipient = parseInt(h[0].recipient.replace(",", ""), 10);

        this.addNode(sender);
        this.addNode(recipient);
        this.addEdge(sender, recipient);
      });
    },
    processRequestsList(requestsList) {
      requestsList.forEach((e) => {
        const h = e.toHuman();
        const sender = parseInt(h.sender.replace(",", ""), 10);
        const recipient = parseInt(h.recipient.replace(",", ""), 10);

        this.addNode(sender, "request");
        this.addNode(recipient, "request");
        this.addEdge(sender, recipient, "request");
      });
    },
    addNode(paraId, type = "normal") {
      const info = this.endpoints.find((c) => c.paraId === paraId);
      const name = info
        ? info.info[0].toUpperCase() + info.info.substring(1)
        : paraId;

      this.nodes["node" + paraId] = {
        id: "node" + paraId,
        number: paraId,
        name: name,
        type: type,
      };

      if (
        !this.assets.find(
          (c) => c.paraId === paraId && c.chain === this.chain.label
        )
      ) {
        this.assets.push({
          chain: this.chain.label,
          paraId: paraId,
          asset: [],
        });
      }
    },
    addEdge(sender, recipient, type = "normal") {
      const nameSender = this.nodes["node" + sender].name;
      const nameRecipient = this.nodes["node" + recipient].name;

      this.edges["edge" + sender + "-" + recipient] = {
        source: "node" + sender,
        target: "node" + recipient,
        sender,
        recipient,
        nameSender: nameSender,
        nameRecipient: nameRecipient,
        label: nameSender + " ➔ " + nameRecipient,
        type: type,
      };
    },
    setupGraphData() {
      this.layers = { badge: "nodes" };
      this.items = Object.values(this.edges).sort((a, b) =>
        a.label.localeCompare(b.label)
      );
    },
    async getCurrencies(chain, paraId) {
      const result = await getCurrencies(
        chain,
        paraId,
        this.endpoints,
        this.para
      );
      this.dialog = true;
      this.para = result.para;
      this.assets = result.assets;
    },
    setInitialChain() {
      const selectedChain = this.chainOptions.find(
        (c) => c.label.toLowerCase() === this.$route.params.chain.toLowerCase()
      );
      this.chain = selectedChain || this.chainOptions[0];
    },
    handleParaSelection() {
      const paraId = this.getParaId();
      this.nodeOver = paraId;

      if (
        this.$route.params.action === "assets" &&
        this.endpoints.find((c) => c.paraId === paraId)
      ) {
        this.getCurrencies(this.chain.label, paraId);
      }
    },
    getParaId() {
      if (isNaN(this.$route.params.para)) {
        return +this.endpoints.find(
          (c) => c.info.toLowerCase() === this.$route.params.para.toLowerCase()
        ).paraId;
      }
      return +this.$route.params.para;
    },
  },
});
</script>

<style lang="scss" scoped>
.q-drawer__content {
  .version_app {
    position: absolute;
    width: 100%;
    bottom: 0px;
    left: 0px;
    text-align: center;
    font-size: 14px;
  }
}

.face-circle,
.face-picture {
  transition: all 0.1s linear;
}

.face-picture {
  pointer-events: none;
}
</style>
