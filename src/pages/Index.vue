<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated style="background-color: #e6007a">
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
        <q-toolbar-title> Channels </q-toolbar-title>
        <div>
          <q-toggle
            v-model="mode"
            checked-icon="dark_mode"
            color="#40E0D0"
            unchecked-icon="light_mode"
          />
          About
          <q-btn flat @click="toggleRightDrawer" round dense icon="help" />
          v{{ version }}
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="flex flex-center">
        <v-network-graph
          :nodes="nodes"
          :edges="edges"
          :configs="configs"
          :zoom-level="2.0"
          :layers="layers"
          :event-handlers="eventHandlers"
        >
          <defs>
            <clipPath id="faceCircle" clipPathUnits="objectBoundingBox">
              <circle cx="0.5" cy="0.5" r="0.5" />
            </clipPath>
          </defs>

          <!-- Replace the node component -->
          <template #override-node="{ nodeId, scale, config, ...slotProps }">
            <!-- circle for filling background -->
            <circle
              class="face-circle"
              :r="config.radius * scale"
              fill="#ffffff"
              v-bind="slotProps"
            />
            <!--
            The base position of the <image /> is top left. The node's
            center should be (0,0), so slide it by specifying x and y.
          -->
            <image
              class="face-picture"
              :x="-config.radius * scale * 2"
              :y="-config.radius * scale * 2"
              :width="config.radius * scale * 4"
              :height="config.radius * scale * 4"
              :xlink:href="image(chain.label, nodes[nodeId].number)"
              clip-path="url(#faceCircle)"
            />
            <!-- circle for drawing stroke -->
            <circle
              class="face-circle"
              :r="config.radius * scale * 2"
              fill="none"
              :stroke="nodes[nodeId].type === 'request' ? '#e6007a' : '#40E0D0'"
              :stroke-width="1 * scale * 2"
              v-bind="slotProps"
            />
          </template>
        </v-network-graph>
        <q-dialog v-model="dialog">
          <q-card>
            <q-toolbar>
              <q-avatar>
                <img :src="image(chain.label, para.paraId)" />
              </q-avatar>

              <q-toolbar-title
                ><span class="text-weight-bold text-capitalize">{{
                  para.info
                }}</span>
                Registered Assets
              </q-toolbar-title>

              <q-btn flat round dense icon="close" v-close-popup />
            </q-toolbar>

            <q-card-section>
              <q-list
                v-if="
                  assets.find(
                    (c) => c.paraId === para.paraId && c.chain === chain.label
                  ).asset.length === 0
                "
                bordered
              >
                <q-item>
                  <q-item-section avatar>
                    <q-avatar>
                      <q-skeleton type="QAvatar" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section><q-skeleton type="text" /></q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar>
                    <q-avatar>
                      <q-skeleton type="QAvatar" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section><q-skeleton type="text" /></q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar>
                    <q-avatar>
                      <q-skeleton type="QAvatar" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section><q-skeleton type="text" /></q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar>
                    <q-avatar>
                      <q-skeleton type="QAvatar" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section><q-skeleton type="text" /></q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar>
                    <q-avatar>
                      <q-skeleton type="QAvatar" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section><q-skeleton type="text" /></q-item-section>
                </q-item>
              </q-list>
              <q-list v-else bordered>
                <q-item
                  v-for="asset in assets.find(
                    (c) => c.paraId === para.paraId && c.chain === chain.label
                  ).asset"
                  v-bind:key="asset.symbol"
                  clickable
                  v-ripple
                >
                  <q-item-section avatar>
                    <q-avatar>
                      <img :src="asset.image" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ asset.name }}</q-item-label>
                    <q-item-label caption lines="1">{{
                      asset.symbol
                    }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn dense round icon="mdi-decimal" class="q-ml-md">
                      <q-badge color="red" floating>{{
                        asset.decimals
                      }}</q-badge>
                    </q-btn>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </q-dialog>
      </q-page>
    </q-page-container>

    <q-drawer v-model="leftDrawerOpen" overlay side="left" bordered class="">
      <div class="row text-h5 justify-center">HRMP Channel List</div>
      <q-list dense bordered>
        <q-item v-for="item in items" v-bind:key="item.label">
          <q-item-section
            header
            :class="item.type === 'request' ? `text-red` : `text-grey-8`"
          >
            <div class="row items-center">
              <div class="col column reverse">
                <q-btn
                  :color="item.type === 'request' ? `negative` : `primary`"
                  :label="item.nameSender"
                  size="sm"
                  push
                  @click="getCurrencies(chain.label, item.sender)"
                />
              </div>
              <div class="col">
                <q-linear-progress
                  class=""
                  indeterminate
                  :color="item.type === 'request' ? `negative` : `primary`"
                />
              </div>
              <div class="col column reverse">
                <q-btn
                  :color="item.type === 'request' ? `negative` : `primary`"
                  :label="item.nameRecipient"
                  size="sm"
                  push
                  @click="getCurrencies(chain.label, item.recipient)"
                />
              </div>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-drawer
      ref="right"
      side="right"
      v-if="rightDrawerOpen"
      v-model="rightDrawerOpen"
      bordered
      overlay
      :width="600"
      class=""
    >
      <timeline />
    </q-drawer>
  </q-layout>
</template>

<script>
import { defineComponent, reactive, ref } from "vue";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { ForceLayout } from "v-network-graph/lib/force-layout";
import { version } from "../../package.json";
import * as vNG from "v-network-graph";
import { Loading, QSpinnerGears } from "quasar";
import { Buffer } from "buffer";
import { equilibrium, equilibriumNext } from "@equilab/definitions";
import { genshiro } from "@equilab/definitions";
import Timeline from "components/Timeline.vue";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "PageIndex",
  components: {
    Timeline,
  },
  data() {
    return {
      layouts: {},
      configs: {},
      nodes: {},
      edges: {},
      layers: {},
      nodeOver: 2000,
      eventHandlers: {
        "node:click": ({ node }) => {
          let paraId = +node.replace("node", "");
          this.getCurrencies(this.chain.label, paraId);
          console.log(node);
        },
        "node:pointerover": ({ node }) => {
          this.nodeOver = +node.replace("node", "");
          console.log(node);
        },
        "node:pointerout": ({ node }) => {
          this.nodeOver = null;
          console.log(node);
        },
      },
      endpoints: [],
      rocEndpoints: [],
      version: {},
      items: {},
      para: {
        info: "Karura",
        paraId: 2000,
      },
      assets: [
        {
          chain: "Kusama",
          paraId: 2000,
          asset: [],
        },
      ],
      mode: true,
      dialog: false,
      leftDrawerOpen: false,
      rightDrawerOpen: false,
      chain: {
        label: "Kusama",
        value: "wss://kusama.api.onfinality.io/public-ws",
      },
      chainOptions: [
        {
          label: "Kusama",
          value: "wss://kusama.api.onfinality.io/public-ws",
        },
        {
          label: "Rococo",
          value: "wss://rococo-rpc.polkadot.io/public-ws",
        },
        {
          label: "Polkadot",
          value: "wss://rpc.polkadot.io/public-ws",
        },
        {
          label: "Westend",
          value: "wss://westend-rpc.polkadot.io/public-ws",
        },
      ],
    };
  },
  computed: {},
  watch: {
    async chain() {
      console.log("loading...");
      Loading.show({
        spinner: QSpinnerGears,
        message: "Loading data from the parachain.  Hang on...",
      });
      await this.load();
      Loading.hide();
    },
    mode() {
      this.node = !this.mode;
      this.$q.dark.set(this.mode);

      this.configs.node.label.color = this.mode ? "#ffffff" : "#000000";
    },
  },
  async mounted() {
    this.version = version;
    const $q = useQuasar();
    $q.dark.set(true);

    if (this.$route.params.chain) {
      console.log("specific chain selected");
      this.chain = this.chainOptions.find(
        (c) => c.label.toLowerCase() === this.$route.params.chain.toLowerCase()
      )
        ? this.chainOptions.find(
            (c) =>
              c.label.toLowerCase() === this.$route.params.chain.toLowerCase()
          )
        : this.chainOptions[0];
    }

    Loading.show({
      spinner: QSpinnerGears,
      message: "Loading data from the parachain.  Hang on...",
    });
    await this.load();
    Loading.hide();

    if (this.$route.params.para) {
      console.log("specific para selected", this.$route.params.para);
      let paraId = null;

      if (isNaN(this.$route.params.para)) {
        paraId = +this.endpoints.find(
          (c) => c.info.toLowerCase() === this.$route.params.para.toLowerCase()
        ).paraId;
      } else {
        paraId = +this.$route.params.para;
      }

      console.log("paraId", paraId, isNaN(paraId));
      if (this.endpoints.find((c) => c.paraId === paraId)) {
        this.getCurrencies(this.chain.label, paraId);
      }
    }
  },
  methods: {
    image(chain, paraId) {
      let image = "";
      let name = this.endpoints.find((c) => c.paraId === paraId)
        ? this.endpoints
            .find((c) => c.paraId === paraId)
            .info[0].toUpperCase() +
          this.endpoints.find((c) => c.paraId === paraId).info.substring(1)
        : paraId;

      if (Number.isInteger(name)) {
        image = `https://cdn.pixabay.com/photo/2015/08/27/10/14/icon-909830_1280.png`;
      } else {
        if (chain === "Rococo") {
          if (paraId === 2021 || paraId === 2006) {
            image = `https://raw.githubusercontent.com/TalismanSociety/chaindata/multi-relay-chain-future/0/parathreads/${paraId}/assets/logo.svg`;
          } else if (paraId === 3019) {
            image = `https://resources.acala.network/networks/gm.png`;
          } else {
            image = `https://raw.githubusercontent.com/TalismanSociety/chaindata/multi-relay-chain-future/2/parathreads/${paraId}/assets/logo.svg`;
          }
        } else {
          if (chain === "Kusama" && paraId === 2007) {
            paraId = 2120;
          }
          image = `https://raw.githubusercontent.com/TalismanSociety/chaindata/multi-relay-chain-future/${
            chain === "Polkadot" || chain === "Westend" ? 0 : 2
          }/parathreads/${paraId}/assets/logo.svg`;
        }
      }

      return image;
    },
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    toggleRightDrawer() {
      this.rightDrawerOpen = !this.rightDrawerOpen;
    },
    doLoad() {
      this.load()
        .then(() => {
          console.log("Loaded");
        })
        .catch((err) => {
          console.log("Problem loading", err);
        });
    },
    async load() {
      this.nodes = {};
      this.edges = {};
      this.items = {};

      const provider = new WsProvider(this.chain.value);
      console.log("provider", provider);
      const api = await ApiPromise.create({ provider });
      const [hrmpChannels, requestsList] = await Promise.all([
        api.query.hrmp.hrmpChannels.entries(),
        api.query.hrmp.hrmpOpenChannelRequestsList(),
      ]);

      this.getEndpoints(this.chain.label);

      hrmpChannels.map((e) => {
        const h = e[0].toHuman();
        // console.log("h", h);
        let sender = parseInt(h[0].sender.replace(",", ""), 10);
        let recipient = parseInt(h[0].recipient.replace(",", ""), 10);

        const nameSender = this.endpoints.find((c) => c.paraId === sender)
          ? this.endpoints
              .find((c) => c.paraId === sender)
              .info[0].toUpperCase() +
            this.endpoints.find((c) => c.paraId === sender).info.substring(1)
          : sender;

        this.nodes["node" + sender] = {
          id: "node" + sender,
          number: sender,
          name: nameSender,
        };

        const nameRecipient = this.endpoints.find((c) => c.paraId === recipient)
          ? this.endpoints
              .find((c) => c.paraId === recipient)
              .info[0].toUpperCase() +
            this.endpoints.find((c) => c.paraId === recipient).info.substring(1)
          : recipient;

        this.nodes["node" + recipient] = {
          id: "node" + recipient,
          number: recipient,
          name: nameRecipient,
        };

        if (
          !this.assets.find(
            (c) => c.paraId === sender && c.chain === this.chain.label
          )
        ) {
          this.assets.push({
            chain: this.chain.label,
            para: nameSender,
            paraId: sender,
            asset: [],
          });
        }

        if (
          !this.assets.find(
            (c) => c.paraId === recipient && c.chain === this.chain.label
          )
        ) {
          this.assets.push({
            chain: this.chain.label,
            paraId: recipient,
            asset: [],
          });
        }

        this.edges["edge" + sender + "-" + recipient] = {
          source: "node" + sender,
          target: "node" + recipient,
          sender,
          recipient,
          nameSender: nameSender,
          nameRecipient: nameRecipient,
          label: nameSender + " ➔ " + nameRecipient,
        };
      });

      requestsList.map((e) => {
        const h = e.toHuman();
        // console.log("h-rl", h);
        const sender = parseInt(h.sender.replace(",", ""), 10);
        const recipient = parseInt(h.recipient.replace(",", ""), 10);

        const nameSender = this.endpoints.find((c) => c.paraId === sender)
          ? this.endpoints
              .find((c) => c.paraId === sender)
              .info[0].toUpperCase() +
            this.endpoints.find((c) => c.paraId === sender).info.substring(1)
          : sender;

        if (this.nodes["node" + sender] === undefined) {
          console.log(
            'this.nodes["node" + sender]',
            this.nodes["node" + sender]
          );
          this.nodes["node" + sender] = {
            id: "node" + sender,
            number: sender,
            name: nameSender,
            type: "request",
          };
        }

        const nameRecipient = this.endpoints.find((c) => c.paraId === recipient)
          ? this.endpoints
              .find((c) => c.paraId === recipient)
              .info[0].toUpperCase() +
            this.endpoints.find((c) => c.paraId === recipient).info.substring(1)
          : recipient;

        if (this.nodes["node" + recipient] === undefined) {
          this.nodes["node" + recipient] = {
            id: "node" + recipient,
            number: recipient,
            name: nameRecipient,
            type: "request",
          };
        }

        if (
          !this.assets.find(
            (c) => c.paraId === sender && c.chain === this.chain.label
          )
        ) {
          this.assets.push({
            chain: this.chain.label,
            para: nameSender,
            paraId: sender,
            asset: [],
          });
        }

        if (
          !this.assets.find(
            (c) => c.paraId === recipient && c.chain === this.chain.label
          )
        ) {
          this.assets.push({
            chain: this.chain.label,
            paraId: recipient,
            asset: [],
          });
        }

        this.edges["edge" + sender + "-" + recipient] = {
          source: "node" + sender,
          target: "node" + recipient,
          label: nameSender + " ➔ " + nameRecipient,
          sender,
          recipient,
          nameSender: nameSender,
          nameRecipient: nameRecipient,
          type: "request",
        };
      });

      // additional layers definition
      this.layers = {
        // {layername}: {position}
        badge: "nodes",
      };

      this.eventHandlers = reactive(
        (vNG.EventHandlers = {
          "node:click": ({ node }) => {
            // toggle
            console.log("click toggle");
            this.nodes[node].active = !this.nodes[node].active;
          },
        })
      );

      this.configs = reactive(
        vNG.defineConfigs({
          view: {
            layoutHandler: new ForceLayout({
              positionFixedByDrag: false,
              positionFixedByClickWithAltKey: true,
            }),
          },
          node: {
            normal: {},
            label: {
              color: this.$q.dark.isActive ? "#ffffff" : "#000000",
              visible: true,
              fontSize: 40,
              margin: 20,
              padding: 20,
            },
          },
          edge: {
            selectable: true,
            normal: {
              width: (n) => (n.sender !== this.nodeOver ? 1 : 3),
              // width: (n) =>
              //   (n.sender === 2000 && n.recipient === 3019) ||
              //   (n.recipient === 2000 && n.sender === 3019)
              //     ? 3
              //     : 0,
              color: (n) => (n.type === "request" ? "#e6007a" : "#40E0D0"),
              dasharray: (n) => (n.type === "request" ? "10" : "#0"),
              linecap: "butt",
              animate: false,
              animationSpeed: 50,
            },
            hover: {
              width: 4,
              color: (n) => (n.type === "request" ? "#e6007a" : "#40E0D0"),
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
            margin: 15,
            marker: {
              source: {
                type: "none",
                width: 5,
                height: 5,
                margin: 0,
                units: "strokeWidth",
                color: null,
              },
              target: {
                type: "arrow",
                width: 10,
                height: 5,
                margin: 0,
                units: "strokeWidth",
                color: null,
              },
            },
          },
        })
      );

      this.layouts = ref({
        nodes: {
          node2000: {
            x: 0,
            y: 0,
            fixed: true, // Unaffected by force
          },
        },
      });

      this.items = Object.values(this.edges).sort((a, b) =>
        a.label.localeCompare(b.label)
      );
      console.log("items", this.items);
      console.log("nodes", this.nodes);
      console.log("edges", this.edges);

      // const assets = await this.getCurrencies(2000);

      await api.disconnect();
    },
    async getCurrencies(chain, paraId) {
      const BN = require("bn.js");
      console.log("chain, paraId", chain, paraId);

      this.dialog = true;
      this.para = this.endpoints.find((c) => c.paraId === paraId);

      if (
        chain === "Rococo" &&
        this.rocEndpoints.find((c) => c.paraId === paraId)
      )
        this.para.providers = this.rocEndpoints.find(
          (c) => c.paraId === paraId
        ).providers;

      console.log("this.para", this.para);

      if (
        !this.assets.find((c) => c.paraId === paraId && c.chain === chain) ||
        !this.assets.find((c) => c.paraId === paraId && c.chain === chain).asset
          .length
      ) {
        let types = {};

        if (paraId === 2024 && (chain === "Kusama" || chain === "Rococo")) {
          types = genshiro.types;
        } else if (paraId === 2011 && chain === "Polkadot") {
          types = equilibrium.types;
        }

        console.log("types", types);
        const wss = Object.values(this.para.providers)[0];
        const provider = new WsProvider(wss);
        const api = await ApiPromise.create({ provider, types });

        const systemProperties = await api.rpc.system.properties();
        const symbol = systemProperties.tokenSymbol.value.toHuman()[0];
        const decimals = systemProperties.tokenDecimals.value.toHuman()[0];
        console.log("systemProperties", systemProperties);

        let asset = [];
        let assetMetadata = [];

        if (paraId === 2000 || paraId === 2114 || paraId === 2001) {
          // Acala, Karura, Bifrost
          assetMetadata =
            await api.query.assetRegistry.assetMetadatas.entries();

          if (paraId === 2001) {
            asset.push({
              name: symbol,
              symbol,
              decimals,
              image:
                "https://resources.acala.network/tokens/" + symbol + ".png",
            });
          }
        } else if (paraId === 2090) {
          // Basilisk 2090
          assetMetadata =
            await api.query.assetRegistry.assetMetadataMap.entries();

          asset.push({
            name: symbol,
            symbol,
            decimals,
            image: "https://resources.acala.network/tokens/" + symbol + ".png",
          });
        } else if (paraId === 2088) {
          assetMetadata = await api.query.ormlTokens.totalIssuance.entries();

          // console.log("tokens test", assetMetadata);
        } else if (
          (paraId === 2024 && (chain === "Kusama" || chain === "Rococo")) ||
          (paraId === 2011 && chain === "Polkadot")
        ) {
          // Genshiro / Equilibrium
          var currencyFromU64 = function (u64) {
            var bytes = [];
            var num = typeof u64 === "number" ? new BN(u64) : u64;
            do {
              bytes.unshift(num.modn(256));
              num = num.divn(256);
            } while (num.gtn(0));
            return Buffer.from(bytes).toString("utf8").toUpperCase();
          };

          const assets = (await api.query.eqAssets.assets())
            .unwrapOrDefault()
            .map((a) => {
              if (a.id.toRawType() == "u64") {
                return a.id;
              } else {
                return a.id[0];
              }
            })
            .map((id) => currencyFromU64(parseInt(id.toString(), 10)));

          assets.map((a) => {
            asset.push({
              name: a,
              symbol: a,
              decimals,
              image: "https://resources.acala.network/tokens/" + a + ".png",
            });
          });
          console.log("assets", paraId, chain, assets);
        } else if (paraId === 2106) {
          // Litmus Litentry
          assetMetadata =
            await api.query.assetManager.assetIdMetadata.entries();

          asset.push({
            name: symbol,
            symbol,
            decimals,
            image: "https://resources.acala.network/tokens/" + symbol + ".png",
          });
        } else if (paraId === 2107) {
          // Kico, Dico
          assetMetadata = await api.query.currencies.dicoAssetsInfo.entries();
        } else if (
          paraId === 2084 ||
          paraId === 2004 ||
          paraId === 2006 ||
          paraId === 2007 ||
          paraId === 2012 ||
          paraId === 2102 ||
          paraId === 2120 ||
          paraId === 2023 ||
          paraId === 2048 ||
          paraId === 1000 ||
          paraId === 2085
        ) {
          // calimari khala moonriver moonbeam statemine heiko parallel shiden astar
          assetMetadata = await api.query.assets.metadata.entries();

          // has their token in the assets.metadata
          if (paraId !== 2102) {
            asset.push({
              name: symbol,
              symbol,
              decimals,
              image:
                "https://resources.acala.network/tokens/" + symbol + ".png",
            });
          }
        } else {
          asset.push({
            name: symbol,
            symbol,
            decimals,
            image: "https://resources.acala.network/tokens/" + symbol + ".png",
          });
        }
        // fails
        // ? kintsugi quartz shadow
        //

        assetMetadata.map((a) => {
          const h = a[1].toHuman();

          console.log("h", h);

          // ZLK https://raw.githubusercontent.com/zenlinkpro/assets/master/blockchains/moonriver/assets/0x0f47ba9d9Bde3442b42175e51d6A367928A1173B/logo.png

          if (paraId === 2107) {
            asset.push({
              name: h.metadata.name,
              symbol: h.metadata.symbol,
              decimals: h.metadata.decimals,
              image:
                "https://resources.acala.network/tokens/" +
                h.metadata.symbol + // .toUpperCase() +
                ".png",
            });
          } else if (paraId === 9999) {
            console.log("assetMetadata", h);
            asset.push({
              name: h.name,
              symbol: h.name,
              decimals: h.decimal,
              image:
                "https://resources.acala.network/tokens/" + h.name + ".png",
            });
          } else if (paraId === 2023 || paraId === 2004 || paraId === 2106) {
            asset.push({
              name: h.name,
              symbol: h.symbol,
              decimals: h.decimals,
              image:
                "https://resources.acala.network/tokens/" +
                h.symbol.replace("xc", "") +
                ".png",
            });
          } else {
            asset.push({
              name: h.name,
              symbol: h.symbol,
              decimals: h.decimals,
              image:
                "https://resources.acala.network/tokens/" +
                h.symbol.replace("worm", "") +
                ".png",
            });
          }
        });

        if (this.assets.find((c) => c.paraId === paraId && c.chain === chain)) {
          this.assets.find(
            (c) => c.paraId === paraId && c.chain === chain
          ).asset = asset;
        } else {
          this.assets.push({
            chain,
            paraId,
            asset,
          });
        }

        console.log("this.assets", this.assets);
        await api.disconnect();
      }
    },
    getEndpoints(chain) {
      function t() {}

      switch (chain) {
        case "Kusama":
        case "Rococo":
          // https://github.com/polkadot-js/apps/blob/master/packages/apps-config/src/endpoints/productionRelayKusama.ts
          this.endpoints = [
            // (1) all system parachains (none available yet)
            // ...
            // (2) all common good parachains
            {
              info: "altair",
              homepage: "https://centrifuge.io/altair",
              paraId: 2088,
              text: "Altair",
              providers: {
                Centrifuge: "wss://fullnode.altair.centrifuge.io",
                OnFinality: "wss://altair.api.onfinality.io/public-ws",
              },
            },
            {
              info: "bajun",
              homepage: "https://ajuna.io",
              paraId: 2119,
              text: "Bajun Network",
              providers: {
                AjunaNetwork: "wss://rpc-parachain.bajun.network",
              },
            },
            {
              info: "basilisk",
              homepage: "https://bsx.fi",
              paraId: 2090,
              text: "Basilisk",
              providers: {
                HydraDX: "wss://rpc-01.basilisk.hydradx.io",
                OnFinality: "wss://basilisk.api.onfinality.io/public-ws",
                Dwellir: "wss://basilisk-rpc.dwellir.com",
              },
            },
            {
              info: "bifrost",
              homepage: "https://ksm.vtoken.io/?ref=polkadotjs",
              paraId: 2001,
              text: "Bifrost (Kusama)",
              providers: {
                "Liebi 0": "wss://bifrost-rpc.liebi.com/ws",
                "Liebi 1": "wss://us.bifrost-rpc.liebi.com/ws",
                "Liebi 2": "wss://eu.bifrost-rpc.liebi.com/ws",
                OnFinality:
                  "wss://bifrost-parachain.api.onfinality.io/public-ws",
                Dwellir: "wss://bifrost-rpc.dwellir.com",
              },
            },
            {
              info: "bitcountryPioneer",
              homepage: "https://bit.country/?ref=polkadotjs",
              paraId: 2096,
              text: "Bit.Country Pioneer",
              providers: {
                "Bit.Country": "wss://pioneer-1-rpc.bit.country",
                OnFinality: "wss://pioneer.api.onfinality.io/public-ws",
              },
            },
            {
              info: "calamari",
              homepage: "https://www.calamari.network/",
              paraId: 2084,
              text: "Calamari",
              providers: {
                "Manta Network": "wss://ws.calamari.systems/",
                OnFinality: "wss://calamari.api.onfinality.io/public-ws",
                Dwellir: "wss://calamari-rpc.dwellir.com",
              },
            },
            {
              info: "shadow",
              homepage: "https://crust.network/",
              paraId: 2012,
              text: "Crust Shadow",
              providers: {
                Crust: "wss://rpc-shadow.crust.network/",
              },
            },
            {
              info: "crab",
              homepage: "https://crab.network",
              paraId: 2105,
              text: "Darwinia Crab Parachain",
              providers: {
                Crab: "wss://crab-parachain-rpc.darwinia.network/",
              },
            },
            {
              info: "dorafactory",
              isUnreachable: true,
              homepage: "https://dorafactory.org/kusama/",
              paraId: 2115,
              text: "Dora Factory",
              providers: {
                DORA: "wss://rpc.dorafactory.org",
              },
            },
            {
              info: "genshiro",
              homepage: "https://genshiro.equilibrium.io",
              isUnreachable: true, // https://github.com/polkadot-js/apps/pull/6761
              paraId: 2024,
              text: "Genshiro",
              providers: {
                Equilibrium: "wss://node.genshiro.io",
              },
            },
            {
              info: "integritee",
              homepage: "https://integritee.network",
              paraId: 2015,
              text: "Integritee Network",
              providers: {
                Integritee: "wss://kusama.api.integritee.network",
                OnFinality:
                  "wss://integritee-kusama.api.onfinality.io/public-ws",
              },
            },
            {
              info: "kabocha",
              homepage: "https://kabocha.network",
              paraId: 2113,
              text: "Kabocha",
              providers: {
                JelliedOwl: "wss://kabocha.jelliedowl.com",
              },
            },
            {
              info: "karura",
              homepage: "https://acala.network/karura/join-karura",
              paraId: 2000,
              text: "Karura",
              providers: {
                "Acala Foundation 0": "wss://karura-rpc-0.aca-api.network",
                "Acala Foundation 1": "wss://karura-rpc-1.aca-api.network",
                "Acala Foundation 2": "wss://karura-rpc-2.aca-api.network/ws",
                "Acala Foundation 3": "wss://karura-rpc-3.aca-api.network/ws",
                "Polkawallet 0": "wss://karura.polkawallet.io",
                OnFinality: "wss://karura.api.onfinality.io/public-ws",
                Dwellir: "wss://karura-rpc.dwellir.com",
              },
            },
            {
              info: "khala",
              homepage: "https://phala.network/",
              paraId: 2004,
              text: "Khala Network",
              providers: {
                Phala: "wss://khala-api.phala.network/ws",
                OnFinality: "wss://khala.api.onfinality.io/public-ws",
                Dwellir: "wss://khala-rpc.dwellir.com",
              },
            },
            {
              info: "kico",
              homepage: "https://dico.io/",
              paraId: 2107,
              text: "KICO",
              providers: {
                "DICO Foundation": "wss://rpc.kico.dico.io",
                "DICO Foundation 2": "wss://rpc.api.kico.dico.io",
              },
            },
            {
              info: "kilt",
              homepage: "https://www.kilt.io/",
              paraId: 2086,
              text: "KILT Spiritnet",
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
              text: "Kintsugi BTC",
              providers: {
                "Kintsugi Labs": "wss://api-kusama.interlay.io/parachain",
                OnFinality: "wss://kintsugi.api.onfinality.io/public-ws",
                Dwellir: "wss://kintsugi-rpc.dwellir.com",
              },
            },
            {
              info: "kpron",
              homepage: "http://apron.network/",
              isUnreachable: true,
              paraId: 2019,
              text: "Kpron",
              providers: {
                Kpron: "wss://kusama-kpron-rpc.apron.network/",
              },
            },
            {
              info: "listen",
              homepage: "https://listen.io/",
              paraId: 2118,
              text: "Listen Network",
              providers: {
                "Listen Foundation 1": "wss://rpc.mainnet.listen.io",
                "Listen Foundation 2": "wss://wss.mainnet.listen.io",
              },
            },
            {
              info: "litmus",
              homepage: "https://kusama-crowdloan.litentry.com",
              paraId: 2106,
              isUnreachable: false,
              text: "Litmus",
              providers: {
                Litentry: "wss://rpc.litmus-parachain.litentry.io",
              },
            },
            {
              info: "loomNetwork",
              isUnreachable: true, // https://github.com/polkadot-js/apps/issues/5888
              homepage: "https://loomx.io/",
              paraId: 2080,
              text: "Loom Network",
              providers: {
                LoomNetwork: "wss://kusama.dappchains.com",
              },
            },
            {
              info: "mangata",
              homepage: "https://mangata.finance",
              paraId: 2110,
              text: "Mangata",
              providers: {
                Mangata: "wss://prod-kusama-collator-01.mangatafinance.cloud",
                OnFinality: "wss://mangata-x.api.onfinality.io/public-ws",
              },
            },
            {
              info: "mars",
              homepage: "https://www.aresprotocol.io/mars",
              paraId: 2008,
              text: "Mars",
              providers: {
                AresProtocol: "wss://wss.mars.aresprotocol.io",
              },
            },
            {
              info: "moonriver",
              homepage: "https://moonbeam.foundation/moonriver-crowdloan/",
              paraId: 2023,
              text: "Moonriver",
              providers: {
                "Moonbeam Foundation":
                  "wss://wss.api.moonriver.moonbeam.network",
                OnFinality: "wss://moonriver.api.onfinality.io/public-ws",
                Dwellir: "wss://moonriver-rpc.dwellir.com",
                // Pinknode: 'wss://rpc.pinknode.io/moonriver/explorer' // https://github.com/polkadot-js/apps/issues/7058
              },
            },
            {
              info: "heiko",
              homepage: "https://parallel.fi",
              paraId: 2085,
              text: "Parallel Heiko",
              providers: {
                OnFinality: "wss://parallel-heiko.api.onfinality.io/public-ws",
                Parallel: "wss://heiko-rpc.parallel.fi",
                Dwellir: "wss://heiko-rpc.dwellir.com",
              },
            },
            {
              info: "picasso",
              homepage: "https://picasso.composable.finance/",
              paraId: 2087,
              text: "Picasso",
              providers: {
                Composable: "wss://picasso-rpc.composable.finance",
                Dwellir: "wss://picasso-rpc.dwellir.com",
              },
            },
            {
              info: "pichiu",
              homepage: "https://kylin.network/",
              paraId: 2102,
              text: "Pichiu",
              providers: {
                "Kylin Network": "wss://kusama.kylin-node.co.uk",
              },
            },
            {
              info: "polkasmith",
              isUnreachable: true, // https://github.com/polkadot-js/apps/issues/6595
              homepage: "https://polkasmith.polkafoundry.com/",
              paraId: 2009,
              text: "PolkaSmith by PolkaFoundry",
              providers: {
                PolkaSmith: "wss://wss-polkasmith.polkafoundry.com",
              },
            },
            {
              info: "quartz",
              homepage: "https://unique.network/",
              paraId: 2095,
              text: "QUARTZ by UNIQUE",
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
              text: "Robonomics",
              providers: {
                Airalab: "wss://kusama.rpc.robonomics.network/",
                OnFinality: "wss://robonomics.api.onfinality.io/public-ws",
              },
            },
            {
              info: "sakura",
              homepage: "https://clover.finance/",
              isUnreachable: true,
              paraId: 2016,
              text: "Sakura",
              providers: {
                Clover: "wss://api-sakura.clover.finance",
              },
            },
            {
              info: "shiden",
              homepage: "https://shiden.astar.network/",
              paraId: 2007,
              text: "Shiden",
              providers: {
                StakeTechnologies: "wss://rpc.shiden.astar.network",
                OnFinality: "wss://shiden.api.onfinality.io/public-ws",
                Pinknode: "wss://rpc.pinknode.io/shiden/explorer",
                Dwellir: "wss://shiden-rpc.dwellir.com",
              },
            },
            {
              info: "shiden",
              homepage: "https://shiden.astar.network/",
              paraId: 2120,
              text: "Shiden Crowdloan 2",
              isUnreachable: true,
              providers: {
                StakeTechnologies: "wss://rpc.shiden.astar.network",
              },
            },
            {
              info: "sora_ksm",
              homepage: "https://sora.org/",
              paraId: 2011,
              text: "SORA Kusama Parachain",
              providers: {
                Soramitsu:
                  "wss://ws.parachain-collator-1.c1.sora2.soramitsu.co.jp",
              },
            },
            {
              info: "subgame",
              homepage: "http://subgame.org/",
              paraId: 2018,
              text: "SubGame Gamma",
              providers: {
                SubGame: "wss://gamma.subgame.org/",
              },
            },
            {
              info: "subsocialX",
              homepage: "https://subsocial.network/",
              paraId: 2100,
              text: "SubsocialX",
              providers: {
                Dappforce: "wss://para.subsocial.network",
              },
            },
            {
              info: "tanganika",
              homepage: "https://www.datahighway.com/",
              paraId: 2116,
              text: "Tanganika",
              providers: {
                DataHighway: "wss://tanganika.datahighway.com",
              },
            },
            {
              info: "trustbase",
              isUnreachable: true, // no providers (yet)
              homepage: "https://trustbase.network/",
              paraId: 2078,
              text: "TrustBase",
              providers: {},
            },
            {
              info: "turing",
              homepage: "https://oak.tech",
              paraId: 2114,
              text: "Turing Network",
              providers: {
                OAK: "wss://rpc.turing.oak.tech",
                OnFinality: "wss://turing.api.onfinality.io/public-ws",
                Dwellir: "wss://turing-rpc.dwellir.com",
              },
            },
            {
              info: "unorthodox",
              homepage: "https://standard.tech/",
              paraId: 2094,
              text: "Unorthodox",
              providers: {
                "Standard Protocol": "wss://rpc.kusama.standard.tech",
              },
            },
            {
              info: "zeitgeist",
              homepage: "https://zeitgeist.pm",
              paraId: 2101,
              text: "Zeitgeist",
              providers: {
                ZeitgeistPM: "wss://rpc-0.zeitgeist.pm",
                Dwellir: "wss://zeitgeist-rpc.dwellir.com",
                OnFinality: "wss://zeitgeist.api.onfinality.io/public-ws",
              },
            },
            {
              info: "statemine",
              paraId: 1000,
              text: "Statemine",
              providers: {
                Parity: "wss://statemine-rpc.polkadot.io",
                OnFinality: "wss://statemine.api.onfinality.io/public-ws",
                Dwellir: "wss://statemine-rpc.dwellir.com",
              },
              teleport: [-1],
            },
            {
              info: "encointer",
              homepage: "https://encointer.org/",
              paraId: 1001,
              text: "Encointer Network",
              providers: {
                "Encointer Association": "wss://kusama.api.encointer.org",
                OnFinality: "wss://encointer.api.onfinality.io/public-ws",
              },
              teleport: [-1],
            },
          ];
          this.endpoints.push(
            {
              info: "efinity",
              homepage: "https://efinity.io",
              paraId: 2021,
              text: "Efinity",
              providers: {
                Efinity: "wss://rpc.efinity.io",
              },
            },
            {
              info: "astar",
              homepage: "https://astar.network",
              paraId: 2006,
              text: "Astar",
              providers: {
                Astar: "wss://rpc.astar.network",
                OnFinality: "wss://astar.api.onfinality.io/public-ws",
                Dwellir: "wss://astar-rpc.dwellir.com",
              },
            },
            {
              info: "origintrail-parachain",
              homepage: "https://parachain.origintrail.io",
              isUnreachable: true,
              text: "OriginTrail Parachain",
              paraId: 2043,
              providers: {
                TraceLabs: "wss://parachain-rpc.origin-trail.network",
              },
            }
          );
          break;
        case "Polkadot":
        case "Westend":
          // https://github.com/polkadot-js/apps/blob/master/packages/apps-config/src/endpoints/productionRelayPolkadot.ts
          this.endpoints = [
            {
              info: "acala",
              homepage: "https://acala.network/",
              paraId: 2000,
              text: "Acala",
              providers: {
                "Acala Foundation 0": "wss://acala-rpc-0.aca-api.network",
                "Acala Foundation 1": "wss://acala-rpc-1.aca-api.network",
                // 'Acala Foundation 2': 'wss://acala-rpc-2.aca-api.network/ws', // https://github.com/polkadot-js/apps/issues/6965
                "Acala Foundation 3": "wss://acala-rpc-3.aca-api.network/ws",
                "Polkawallet 0": "wss://acala.polkawallet.io",
                OnFinality: "wss://acala-polkadot.api.onfinality.io/public-ws",
                Dwellir: "wss://acala-rpc.dwellir.com",
              },
            },
            {
              info: "odyssey",
              homepage: "https://www.aresprotocol.io/",
              paraId: 2028,
              text: "Ares Odyssey",
              providers: {
                AresProtocol: "wss://wss.odyssey.aresprotocol.io",
              },
            },
            {
              info: "astar",
              homepage: "https://astar.network",
              paraId: 2006,
              text: "Astar",
              providers: {
                Astar: "wss://rpc.astar.network",
                OnFinality: "wss://astar.api.onfinality.io/public-ws",
                Dwellir: "wss://astar-rpc.dwellir.com",
              },
            },
            {
              info: "bifrost",
              isUnreachable: true,
              homepage: "https://crowdloan.bifrost.app",
              paraId: 2030,
              text: "Bifrost",
              providers: {
                Liebi: "wss://bifrost-dot.liebi.com/ws",
              },
            },
            {
              info: "centrifuge",
              homepage: "https://centrifuge.io",
              paraId: 2031,
              text: "Centrifuge",
              providers: {
                Centrifuge: "wss://fullnode.parachain.centrifuge.io",
                OnFinality:
                  "wss://centrifuge-parachain.api.onfinality.io/public-ws",
                Dwellir: "wss://centrifuge-rpc.dwellir.com",
              },
            },
            {
              info: "clover",
              homepage: "https://clover.finance",
              paraId: 2002,
              text: "Clover",
              providers: {
                Clover: "wss://rpc-para.clover.finance",
                OnFinality: "wss://clover.api.onfinality.io/public-ws",
              },
            },
            {
              // this is also a duplicate as a Live and Testing network -
              // it is either/or, not and
              info: "coinversation",
              isUnreachable: true, // https://github.com/polkadot-js/apps/issues/6635
              homepage: "http://www.coinversation.io/",
              paraId: 2027,
              text: "Coinversation",
              providers: {
                Coinversation: "wss://rpc.coinversation.io/",
              },
            },
            {
              info: "composableFinance",
              isUnreachable: true, // https://github.com/polkadot-js/apps/issues/6721
              homepage: "https://composable.finance/",
              paraId: 2019,
              text: "Composable Finance",
              providers: {
                Composable: "wss://rpc.composable.finance",
                Dwellir: "wss://composable-rpc.dwellir.com",
              },
            },
            {
              info: "crustParachain",
              homepage: "https://crust.network",
              paraId: 2008,
              isUnreachable: true,
              text: "Crust",
              providers: {
                Crust: "wss://rpc.crust.network",
              },
            },
            {
              info: "darwinia",
              isUnreachable: true, // https://github.com/polkadot-js/apps/issues/6530
              homepage: "https://darwinia.network/",
              paraId: 2003,
              text: "Darwinia",
              providers: {
                Darwinia: "wss://parachain-rpc.darwinia.network",
              },
            },
            {
              info: "efinity",
              homepage: "https://efinity.io",
              paraId: 2021,
              text: "Efinity",
              providers: {
                Efinity: "wss://rpc.efinity.io",
              },
            },
            {
              info: "equilibrium",
              homepage: "https://equilibrium.io/",
              paraId: 2011,
              text: "Equilibrium",
              providers: {
                Equilibrium: "wss://node.pol.equilibrium.io/",
              },
            },
            {
              info: "geminis",
              isUnreachable: true,
              homepage: "https://geminis.network/",
              paraId: 2038,
              text: "Geminis",
              providers: {
                Geminis: "wss://rpc.geminis.network",
              },
            },
            {
              info: "hydra",
              homepage: "https://hydradx.io/",
              paraId: 2034,
              text: "HydraDX",
              providers: {
                "Galactic Council": "wss://rpc-01.hydradx.io",
              },
            },
            {
              info: "interlay",
              homepage: "https://interlay.io/",
              paraId: 2032,
              text: "Interlay",
              providers: {
                "Kintsugi Labs": "wss://api.interlay.io/parachain",
                OnFinality: "wss://interlay.api.onfinality.io/public-ws",
              },
            },
            {
              info: "kapex",
              homepage: "https://totemaccounting.com/",
              paraId: 2007,
              text: "Kapex",
              providers: {
                Totem: "wss://k-ui.kapex.network",
              },
            },
            {
              info: "litentry",
              homepage: "https://crowdloan.litentry.com",
              paraId: 2013,
              isUnreachable: true,
              text: "Litentry",
              providers: {
                Litentry: "wss://parachain.litentry.io",
              },
            },
            {
              info: "manta",
              isUnreachable: true, // https://github.com/polkadot-js/apps/issues/7018
              homepage: "https://manta.network",
              paraId: 2015,
              text: "Manta",
              providers: {
                // 'Manta Kuhlii': 'wss://kuhlii.manta.systems', // https://github.com/polkadot-js/apps/issues/6930
                // 'Manta Munkiana': 'wss://munkiana.manta.systems', // https://github.com/polkadot-js/apps/issues/6871
                // 'Manta Pectinata': 'wss://pectinata.manta.systems' // https://github.com/polkadot-js/apps/issues/7018
              },
            },
            {
              info: "moonbeam",
              homepage: "https://moonbeam.network/networks/moonbeam/",
              paraId: 2004,
              text: "Moonbeam",
              providers: {
                "Moonbeam Foundation": "wss://wss.api.moonbeam.network",
                OnFinality: "wss://moonbeam.api.onfinality.io/public-ws",
                Dwellir: "wss://moonbeam-rpc.dwellir.com",
              },
            },
            {
              info: "nodle",
              homepage: "https://nodle.com",
              paraId: 2026,
              text: "Nodle",
              providers: {
                OnFinality: "wss://nodle-parachain.api.onfinality.io/public-ws",
                Dwellir: "wss://eden-rpc.dwellir.com",
              },
            },
            {
              info: "origintrail-parachain",
              homepage: "https://parachain.origintrail.io",
              isUnreachable: true,
              text: "OriginTrail Parachain",
              paraId: 2043,
              providers: {
                TraceLabs: "wss://parachain-rpc.origin-trail.network",
              },
            },
            {
              info: "parallel",
              homepage: "https://parallel.fi",
              paraId: 2012,
              text: "Parallel",
              providers: {
                OnFinality: "wss://parallel.api.onfinality.io/public-ws",
                Parallel: "wss://rpc.parallel.fi",
              },
            },
            {
              info: "phala",
              homepage: "https://phala.network",
              paraId: 2035,
              text: "Phala Network",
              providers: {
                Phala: "wss://api.phala.network/ws",
              },
            },
            {
              info: "polkadex",
              homepage: "https://polkadex.trade/",
              paraId: 2040,
              text: "Polkadex",
              providers: {
                "Polkadex Team": "wss://mainnet.polkadex.trade/",
                OnFinality: "wss://polkadex.api.onfinality.io/public-ws",
              },
            },
            {
              info: "subdao",
              homepage: "https://subdao.network/",
              paraId: 2018,
              isUnreachable: true,
              text: "SubDAO",
              providers: {
                SubDAO: "wss://parachain-rpc.subdao.org",
              },
            },
            {
              info: "subgame",
              homepage: "http://subgame.org/",
              isUnreachable: true, // https://github.com/polkadot-js/apps/pull/6761
              paraId: 2017,
              text: "SubGame Gamma",
              providers: {
                SubGame: "wss://gamma.subgame.org/",
              },
            },
            {
              info: "unique",
              homepage: "https://unique.network/",
              paraId: 2037,
              text: "Unique Network",
              providers: {
                Unique: "wss://ws.unique.network/",
              },
            },
          ];
          this.endpoints.push({
            info: "statemint",
            paraId: 1000,
            text: "Statemint",
            teleport: [-1],
            providers: {
              Parity: "wss://statemint-rpc.polkadot.io",
              OnFinality: "wss://statemint.api.onfinality.io/public-ws",
              Dwellir: "wss://statemint-rpc.dwellir.com",
            },
          });
          break;
      }

      // https://github.com/polkadot-js/apps/blob/master/packages/apps-config/src/endpoints/testingRelayRococo.ts
      this.rocEndpoints = [
        {
          info: "arctic",
          isUnreachable: true, // https://github.com/polkadot-js/apps/issues/7420
          paraId: 3025,
          text: "Arctic",
          providers: {
            Arctic: "wss://arctic-rpc-parachain.icenetwork.io:9944",
          },
        },
        {
          info: "rococoBajun",
          isUnreachable: true, // https://github.com/polkadot-js/apps/issues/7593
          paraId: 3026,
          text: "Bajun Network",
          providers: {
            AjunaNetwork: "wss://rpc-rococo.bajun.network",
          },
        },
        {
          info: "rococoBasilisk",
          paraId: 2090,
          text: "Basilisk",
          providers: {
            "Galactic Council": "wss://rpc-01.basilisk-rococo.hydradx.io",
          },
        },
        {
          info: "rococoBitgreen",
          paraId: 3024,
          text: "Bitgreen",
          providers: {
            Bitgreen: "wss://rococobitgreen.abhath-labs.com",
          },
        },
        {
          info: "rococoCatalyst",
          paraId: 2031,
          text: "Catalyst",
          providers: {
            Centrifuge: "wss://fullnode.catalyst.cntrfg.com",
          },
        },
        {
          info: "rococoDali",
          paraId: 2087,
          text: "Dali",
          providers: {
            Composable: "wss://rpc.composablefinance.ninja",
          },
        },
        {
          info: "rococoDolphin",
          paraId: 2084,
          text: "Dolphin",
          providers: {
            "Manta Network": "wss://anjie.rococo.dolphin.engineering",
          },
        },
        {
          info: "rocfinity",
          paraId: 2051,
          text: "Efinity",
          providers: {
            Efinity: "wss://rpc.rococo.efinity.io",
          },
        },
        {
          info: "rococoGenshiro",
          paraId: 2024,
          text: "Genshiro Rococo Testnet",
          providers: {
            Equilibrium:
              "wss://parachain-testnet.equilab.io/rococo/collator/node1/wss",
          },
        },
        {
          info: "rococoGM",
          paraId: 3019,
          text: "GM Parachain",
          providers: {
            "GM or Die DAO": "wss://rococo.gmordie.com",
          },
        },
        {
          info: "rococoImbue",
          paraId: 3017,
          text: "Imbue Network",
          providers: {
            "Imbue Network": "wss://rococo.imbue.network",
          },
        },
        {
          info: "rococoIntegritee",
          paraId: 3002,
          text: "Integritee Network",
          providers: {
            Integritee: "wss://rococo.api.integritee.network",
          },
        },
        {
          info: "rococoLitentry",
          paraId: 2106,
          text: "Litentry",
          providers: {
            Litentry: "wss://rpc.rococo-parachain-sg.litentry.io",
          },
        },
        {
          info: "rococoMoonsama",
          isDisabled: true, // https://github.com/polkadot-js/apps/issues/7526
          paraId: 2055,
          text: "Moonsama",
          providers: {
            Moonsama: "wss://moonsama-testnet-rpc.moonsama.com",
          },
        },
        {
          info: "rococoNodle",
          paraId: 2026,
          text: "Nodle",
          providers: {
            OnFinality:
              "wss://node-6913072722034561024.lh.onfinality.io/ws?apikey=84d77e2e-3793-4785-8908-5096cffea77a",
          },
        },
        {
          info: "rococoOriginTrailParachain",
          homepage: "https://parachain.origintrail.io",
          paraId: 3005,
          text: "OriginTrail Parachain Testnet",
          providers: {
            TraceLabs:
              "wss://parachain-testnet-loadbalancer.origin-trail.network/",
          },
        },
        {
          info: "rococoPangolin",
          paraId: 2105,
          text: "Pangolin Parachain",
          providers: {
            "Darwinia Network": "wss://pangolin-parachain-rpc.darwinia.network",
          },
        },
        {
          info: "rococoKilt",
          paraId: 2015,
          text: "RILT",
          providers: {
            "KILT Protocol": "wss://rococo.kilt.io",
          },
        },
        {
          info: "robonomics",
          homepage: "http://robonomics.network/",
          paraId: 2048,
          text: "Robonomics",
          providers: {
            Airalab: "wss://rococo.rpc.robonomics.network",
          },
        },
        {
          info: "snowbridge",
          paraId: 3016,
          text: "Snowbridge",
          providers: {
            Snowfork: "wss://rococo-rpc.snowbridge.network",
          },
        },
        {
          info: "rococoSubsocial",
          paraId: 2100,
          text: "SoonsocialX",
          providers: {
            DappForce: "wss://rco-para.subsocial.network",
          },
        },
        {
          info: "rococoSpreehafen",
          paraId: 2116,
          text: "Spreehafen",
          providers: {
            DataHighway: "wss://spreehafen.datahighway.com",
          },
        },
        {
          info: "t0rn",
          paraId: 3333,
          text: "t0rn",
          providers: {
            t3rn: "wss://dev.net.t3rn.io",
          },
        },
        {
          info: "rococoTuring",
          paraId: 2114,
          text: "Turing Network (Staging)",
          providers: {
            OAK: "wss://rpc.turing-staging.oak.tech",
          },
        },
        {
          info: "rococoVirto",
          paraId: 3003,
          text: "Virto",
          providers: {
            VirtoNetwork: "wss://rococo.virtonetwork.xyz",
          },
        },
        {
          info: "rococoZeitgeist",
          isDisabled: true, // See https://github.com/polkadot-js/apps/issues/5842
          paraId: 2050,
          text: "Zeitgeist PC",
          providers: {
            Zeitggeist: "wss://roc.zeitgeist.pm",
          },
        },
        {
          info: "rococoStatemint",
          paraId: 1000,
          text: "Rockmine",
          providers: {
            Parity: "wss://rococo-statemint-rpc.polkadot.io",
          },
          teleport: [-1],
        },
        {
          info: "rococoContracts",
          paraId: 1002,
          text: "Contracts",
          providers: {
            Parity: "wss://rococo-contracts-rpc.polkadot.io",
          },
          teleport: [-1],
        },
        {
          info: "encointer",
          homepage: "https://encointer.org/",
          paraId: 1003,
          text: "Encointer Lietaer",
          providers: {
            "Encointer Association": "wss://rococo.api.encointer.org",
          },
          teleport: [-1],
        },
      ];
      this.rocEndpoints.push(
        {
          paraId: 2000,
          providers: {
            Acala: "wss://karura-rococo.aca-dev.network",
          },
        },
        {
          paraId: 2102,
          providers: {
            Pichiu: "wss://pichiu-rococo-01.onebitdev.com",
          },
        }
      );

      if (chain === "Rococo") {
        this.rocEndpoints.map((r) => {
          r.info = r.info ? r.info.replace("rococo", "") : "";
          if (this.endpoints.find((e) => e.paraId !== r.paraId)) {
            this.endpoints.push(r);
          }
        });
      }
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
// transitions when scaling on mouseover.
.face-circle,
.face-picture {
  transition: all 0.1s linear;
}

// suppress image events so that mouse events are received
// by the background circle.
.face-picture {
  pointer-events: none;
}
</style>
