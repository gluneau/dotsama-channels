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
        <q-toolbar-title> GM or Die </q-toolbar-title>
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
import { useQuasar, Loading, QSpinnerGears } from "quasar";
import Timeline from "components/Timeline.vue";
import { GraphQLClient, gql } from "graphql-request";

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

    Loading.show({
      spinner: QSpinnerGears,
      message: "Loading data from the subsquid.  Hang on...",
    });
    await this.load();
    Loading.hide();
  },
  methods: {
    image(chain, paraId) {
      let image = "";

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

      const query = gql`
        {
          hero {
            name
          }
        }
      `;
      const client = new GraphQLClient(
        "https://squid.subsquid.io/gmordie-frontend/v/v1/graphql"
      );
      const data = await client.request(query);

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
