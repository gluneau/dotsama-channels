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
      <q-page padding class="flex flex-center content-start">
        <q-table
          title="Collators"
          row-key="candidate"
          v-model:pagination="pagination"
          :rows="rows"
          :columns="columns"
          :loading="loading"
        >
          <template v-slot:body-cell-didAddress="cell">
            <q-td :props="cell">
              <a
                :href="'https://dev.uniresolver.io/#did:kilt:' + cell.value"
                target="_blank"
                >{{ cell.value }}</a
              >
            </q-td>
          </template>
          <template v-slot:body-cell-w3n="cell">
            <q-td :props="cell">
              <a :href="'https://w3n.id/' + cell.value" target="_blank">{{
                cell.value
              }}</a>
            </q-td>
          </template>
        </q-table>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { version } from "../../package.json";

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
    console.log("this.rows", this.rows);
  },
  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    async queryInfo(api, candidate) {
      console.log(await api.query.system.number());
      // https://gist.github.com/weichweich/53f21076b7d8c4a6a9374e6bd8ee29ee
      const maybeLinkRecord = await api.query.didLookup.connectedDids(
        candidate
      );

      console.log("Finished query!");
      console.log("maybeLinkRecord", maybeLinkRecord);
      if (maybeLinkRecord.isNone) {
        console.log("No record for this address");
        return;
      }

      const didAddress = maybeLinkRecord.unwrap().did.toString();
      const encodedW3N = await api.query.web3Names.names(didAddress);
      const w3n = encodedW3N.isSome ? encodedW3N.unwrap().toUtf8() : null;

      console.log(`Address ${candidate}`);
      console.log(`  -> did:kilt:${didAddress}`);
      console.log(`    -> w3n:${w3n}`);

      return didAddress, w3n;
    },
    async load() {
      const provider = new WsProvider(this.chain.value);
      const api = await ApiPromise.create({ provider });
      const kiltApi = await ApiPromise.create({
        provider: new WsProvider("wss://spiritnet.api.onfinality.io/public-ws"),
      });
      await kiltApi.isReady;
      const [candidates, invulnerables] = await Promise.all([
        api.query.collatorSelection.candidates(),
        api.query.collatorSelection.invulnerables(),
      ]);

      candidates.push(...invulnerables);
      console.log("invulnerables", invulnerables[0].toHuman()); // .types.entries());

      console.log(candidates.map((c) => c.toHuman()));
      await candidates.map(async (e) => {
        const candidate = e.toHuman();
        console.log("candidate", candidate);

        let [didAddress, w3n] = await this.queryInfo(kiltApi, candidate);

        console.log(`Address ${candidate} -> Did ${didAddress} -> W3N ${w3n}`);

        this.rows.push({
          candidate,
          didAddress,
          w3n,
          role: invulnerables.find((e) => e.toHuman() === candidate)
            ? "Invulnerable"
            : "Candidate",
        });
      });

      await api.disconnect();
      await kiltApi.disconnect();
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
