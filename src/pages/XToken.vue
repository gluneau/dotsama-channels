<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <div class="q-ml-md">
          <q-select
            v-model="chain"
            :options="chainOptions"
            label="Chain"
            dense
            dark
          />
        </div>
        <q-toolbar-title> Collators </q-toolbar-title>
        <div>v{{ version }}</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page padding class="flex flex-center content-start"> </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { version } from "../../package.json";
import {
  web3Accounts,
  web3Enable,
  web3FromAddress,
} from "@polkadot/extension-dapp";

export default defineComponent({
  name: "PageIndex",
  data() {
    return {
      version: {},
      loading: true,
      rows: [],
      pagination: {
        rowsPerPage: 25,
        sortBy: "w3n",
        descending: true,
      },
      columns: [
        {
          align: "left",
          field: "candidate",
          name: "candidate",
          label: "Collator",
          sortable: true,
        },
        {
          name: "didAddress",
          field: "didAddress",
          label: "DID",
          sortable: true,
        },
        {
          name: "role",
          field: "role",
          label: "Role",
          sortable: true,
        },
        {
          align: "left",
          field: "w3n",
          name: "w3n",
          label: "Web3Name",
          sortable: true,
        },
      ],
      leftDrawerOpen: false,
      chain: {
        label: "Karura",
        value: "wss://karura.api.onfinality.io/public-ws",
      },
      chainOptions: [
        {
          label: "Karura",
          value: "wss:/karura.api.onfinality.io/public-ws",
        },
        {
          label: "Acala",
          value: "wss://acala-polkadot.api.onfinality.io/public-ws",
        },
        {
          label: "Mandala",
          value: "wss://mandala.polkawallet.io/public-ws",
        },
      ],
    };
  },
  watch: {
    async chain() {
      console.log("loading...");
      this.loading = true;
      this.rows = [];
      await this.load();
      this.loading = false;
    },
  },
  async mounted() {
    this.version = version;
    await this.load();
    this.loading = false;
    console.log("candidates", this.data);
  },
  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    async load() {
      // const provider = new WsProvider(this.chain.value);
      const provider = new WsProvider("wss://kusama.gmordie.com");
      const api = await ApiPromise.create({ provider });

      const DAPP_NAME = "Dotsama HRMP Channel";
      const allInjected = await web3Enable(DAPP_NAME);
      console.log("allInjected", allInjected);

      const SENDER = "gMYGS4ehihnGgsieLWv21yTDpWJJaoiZtkcx4q8kgSPAVsbHq";

      // returns an array of { address, meta: { name, source } }
      // meta.source contains the name of the extension that provides this account
      const allAccounts = await web3Accounts();
      console.log("allAccounts", allAccounts);

      const injector = await web3FromAddress(SENDER);

      let hash = await api.tx.currencies
        .transfer("gMWbcZK8zvwqbtwj5jXxC4yNwwvbXYLC1qrSqAAEm2D74cqhk", "gm", 1)
        .signAndSend(SENDER, { signer: injector.signer }, (status) => {
          console.log("status", status);
        });
      console.log("Transfer sent with hash", hash);

      await api.disconnect();
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
</style>
