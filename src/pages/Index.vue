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
          <!-- q-btn
            v-if="allAccounts.length === 0"
            label="Connect Wallet"
            @click="connectWallet"
          />
          <div v-else class="q-ml-md">
            <q-select
              v-model="account"
              :option="accountOptions"
              label="Account"
              dense
              dark
            />
          </div -->
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
                <img :src="para.ui.logo || image(chain.label, para.paraId)" />
                <q-tooltip> {{ Object.values(para.providers)[0] }} </q-tooltip>
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
      <astar-button @click="click" />
      <astar-simple-modal>Test</astar-simple-modal>
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
import {
  web3Accounts,
  web3Enable,
  web3FromAddress,
} from "@polkadot/extension-dapp";
import {
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
} from "../assets/nodes/index.ts";

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
      nodeOver: 0,
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
        info: "Acala",
        paraId: 2000,
      },
      assets: [
        {
          chain: "Polkadot",
          paraId: 2000,
          asset: [],
        },
      ],
      mode: true,
      dialog: false,
      leftDrawerOpen: false,
      rightDrawerOpen: false,
      chain: {
        label: "Polkadot",
        value: "wss://polkadot.api.onfinality.io/public-ws",
      },
      chainOptions: [
        {
          label: "Polkadot",
          value: "wss://polkadot.api.onfinality.io/public-ws",
        },
        {
          label: "Kusama",
          value: "wss://kusama.api.onfinality.io/public-ws",
        },
        {
          label: "Rococo",
          value: "wss://rococo-rpc.polkadot.io/public-ws",
        },
        {
          label: "Westend",
          value: "wss://westend-rpc.polkadot.io/public-ws",
        },
      ],
      allInjected: [],
      account: [],
      accountOptions: [],
      allAccounts: [],
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

      this.nodeOver = paraId;
      console.log("paraId", paraId, isNaN(paraId));
      if (
        this.$route.params.action === "assets" &&
        this.endpoints.find((c) => c.paraId === paraId)
      ) {
        this.getCurrencies(this.chain.label, paraId);
      }
    }
  },
  methods: {
    async connectWallet() {
      const DAPP_NAME = "Dotsama HRMP Channel";
      this.allInjected = await web3Enable(DAPP_NAME);
      console.log("allInjected", this.allInjected);

      this.allAccounts = await web3Accounts();

      this.allAccounts.map((account) => {
        this.accountOptions.push({
          label: account.meta.name,
          value: account.address,
        });
      });

      console.log("accountOptions", this.accountOptions);
    },
    image(chain, paraId) {
      let image = this.endpoints.find((c) => c.paraId === paraId)
        ? this.endpoints.find((c) => c.paraId === paraId).ui.logo
        : `https://cdn.pixabay.com/photo/2015/08/27/10/14/icon-909830_1280.png`;

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
            selectable: false,
            normal: {
              width: (n) =>
                n.sender !== this.nodeOver && n.recipient !== this.nodeOver
                  ? 1
                  : 3,
              // width: (n) =>
              //   (n.sender === 2000 && n.recipient === 3019) ||
              //   (n.recipient === 2000 && n.sender === 3019)
              //     ? 3
              //     : 0,
              color: (n) =>
                n.type === "request"
                  ? "#e6007a"
                  : this.$q.dark.isActive
                  ? "#40E0D0"
                  : "#0000ff",
              dasharray: (n) =>
                (n.type === "request" &&
                  n.sender !== this.nodeOver &&
                  n.recipient !== this.nodeOver) ||
                (n.type !== "request" && n.sender === this.nodeOver) ||
                (n.type !== "request" && n.recipient === this.nodeOver)
                  ? "10"
                  : "#0",
              linecap: "butt",
              animate: (n) =>
                (n.sender === this.nodeOver || n.recipient === this.nodeOver) &&
                n.type !== "request"
                  ? true
                  : false,
              animationSpeed: 50,
            },
            hover: {
              width: 4,
              color: (n) =>
                n.type === "request"
                  ? "#e6007a"
                  : this.$q.dark.isActive
                  ? "#40E0D0"
                  : "#0000ff",
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
        } else if (paraId === 2102) {
          // Pichiu
          assetMetadata = await api.query.ormlTokens.totalIssuance.entries();

          asset.push({
            name: symbol,
            symbol,
            decimals,
            image: "https://resources.acala.network/tokens/" + symbol + ".png",
          });
        } else if (paraId === 2110) {
          // Mangata
          assetMetadata = await api.query.assetsInfo.assetsInfo.entries();

          // what to do with api.query.assetRegistry.assetLocation.entries();
        } else if (paraId === 2088) {
          assetMetadata = await api.query.ormlTokens.totalIssuance.entries();

          asset.push({
            name: symbol,
            symbol,
            decimals,
            image: "https://resources.acala.network/tokens/" + symbol + ".png",
          });
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
          paraId === 2120 ||
          paraId === 2023 ||
          paraId === 2035 ||
          paraId === 2048 ||
          paraId === 1000 ||
          paraId === 2085
        ) {
          // calimari khala moonriver moonbeam statemine heiko parallel shiden astar
          assetMetadata = await api.query.assets.metadata.entries();

          asset.push({
            name: symbol,
            symbol,
            decimals,
            image: "https://resources.acala.network/tokens/" + symbol + ".png",
          });
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
          const i = a[0].toHuman()[0];
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
          } else if (paraId === 2102) {
            console.log("assetMetadata", a);
            asset.push({
              name: i,
              symbol: i,
              image: "https://resources.acala.network/tokens/" + i + ".png",
            });
          } else if (paraId === 2088) {
            console.log("assetMetadata", a);
            asset.push({
              name: h.name,
              symbol: h.name,
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
                // Acurast: 'wss://acurast-canarynet-ws.prod.gke.papers.tech' // https://github.com/polkadot-js/apps/issues/10667
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
            {
              homepage: "https://pendulumchain.org/amplitude",
              info: "amplitude",
              paraId: 2124,
              providers: {
                Dwellir: "wss://amplitude-rpc.dwellir.com",
                PendulumChain: "wss://rpc-amplitude.pendulumchain.tech",
              },
              text: "Amplitude",
              ui: {
                color: "#5DEFA7",
                logo: chainsAmplitudeSVG,
              },
            },
            {
              homepage: "https://ajuna.io",
              info: "bajun",
              paraId: 2119,
              providers: {
                AjunaNetwork: "wss://rpc-parachain.bajun.network",
                OnFinality: "wss://bajun.api.onfinality.io/public-ws",
                RadiumBlock: "wss://bajun.public.curie.radiumblock.co/ws",
              },
              text: "Bajun Network",
              ui: {
                color: "#161212",
                logo: nodesBajunPNG,
              },
            },
            {
              homepage: "https://app.basilisk.cloud",
              info: "basilisk",
              paraId: 2090,
              providers: {
                Basilisk: "wss://rpc.basilisk.cloud",
                Dwellir: "wss://basilisk-rpc.dwellir.com",
                // OnFinality: 'wss://basilisk.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/9414
              },
              text: "Basilisk",
              ui: {
                color: "#49E49F",
                logo: nodesBasiliskPNG,
              },
            },
            {
              homepage: "https://ksm.vtoken.io/?ref=polkadotjs",
              info: "bifrost",
              paraId: 2001,
              providers: {
                Dwellir: "wss://bifrost-rpc.dwellir.com",
                Liebi: "wss://bifrost-rpc.liebi.com/ws",
                LiebiUS: "wss://us.bifrost-rpc.liebi.com/ws",
                OnFinality:
                  "wss://bifrost-parachain.api.onfinality.io/public-ws",
              },
              text: "Bifrost",
              ui: {
                color: "#5a25f0",
                logo: nodesBifrostSVG,
              },
            },
            {
              homepage: "https://www.calamari.network/",
              info: "calamari",
              paraId: 2084,
              providers: {
                "Manta Network": "wss://calamari.systems",
              },
              text: "Calamari",
              ui: {
                color: "#000000",
                logo: nodesCalamariPNG,
              },
            },
            {
              homepage: "https://crab.network",
              info: "crab",
              paraId: 2105,
              providers: {
                Darwinia: "wss://crab-rpc.darwinia.network/",
                Dcdao: "wss://crab-rpc.dcdao.box",
                Dwellir: "wss://darwiniacrab-rpc.dwellir.com",
              },
              text: "Crab",
              ui: {
                color: "#512DBC",
                logo: nodesCrabSVG,
              },
            },
            {
              homepage: "https://crust.network/",
              info: "shadow",
              paraId: 2012,
              providers: {
                Crust: "wss://rpc-shadow.crust.network/",
                "Crust APP": "wss://rpc-shadow.crustnetwork.app",
                "Crust CC": "wss://rpc-shadow.crustnetwork.cc",
                "Crust XYZ": "wss://rpc-shadow.crustnetwork.xyz",
              },
              text: "Crust Shadow",
              ui: {
                logo: nodesShadowSVG,
              },
            },
            {
              homepage: "https://crust.network/",
              info: "shadow",
              isUnreachable: true,
              paraId: 2225,
              providers: {
                // also duplicated right above (hence marked unreachable)
                // Crust: 'wss://rpc-shadow.crust.network/' // https://github.com/polkadot-js/apps/issues/8355
              },
              text: "Crust Shadow 2",
              ui: {
                logo: nodesShadowSVG,
              },
            },
            {
              info: "curio",
              paraId: 3339,
              providers: {
                Curio: "wss://parachain.curioinvest.com/",
              },
              text: "Curio",
              ui: {
                color: "rgb(96, 98, 246)",
                logo: nodesCurioSVG,
              },
            },
            {
              homepage: "https://ipci.io",
              info: "ipci",
              paraId: 2222,
              providers: {
                Airalab: "wss://ipci.rpc.robonomics.network",
              },
              text: "DAO IPCI",
              ui: {
                logo: nodesIpciSVG,
              },
            },
            {
              homepage: "https://dorafactory.org/kusama/",
              info: "dorafactory",
              paraId: 2115,
              providers: {
                // DORA: 'wss://kusama.dorafactory.org' // https://github.com/polkadot-js/apps/issues/9748
              },
              text: "Dora Factory",
              ui: {
                color: "#FF761C",
                logo: chainsDorafactoryPNG,
              },
            },
            {
              homepage: "https://genshiro.io",
              info: "Genshiro",
              paraId: 2024,
              providers: {
                // Genshiro: 'wss://node.genshiro.io' // https://github.com/polkadot-js/apps/issues/10174
              },
              text: "Genshiro",
              ui: {
                color: "#e8662d",
                logo: chainsGenshiroSVG,
              },
            },
            {
              homepage: "https://genshiro.equilibrium.io",
              info: "genshiro",
              isUnreachable: true,
              paraId: 2226,
              providers: {
                // Equilibrium: 'wss://node.genshiro.io' // https://github.com/polkadot-js/apps/issues/10174
              },
              text: "Genshiro crowdloan 2",
              ui: {
                color: "#e8662d",
                logo: chainsGenshiroSVG,
              },
            },
            {
              homepage: "https://gmordie.com",
              info: "gm",
              paraId: 2123,
              providers: {
                // GMorDieDAO: 'wss://kusama.gmordie.com', // https://github.com/polkadot-js/apps/issues/8457
                // 'GM Intern': 'wss://intern.gmordie.com', // https://github.com/polkadot-js/apps/issues/9381
                // TerraBioDAO: 'wss://ws-node-gm.terrabiodao.org', // https://github.com/polkadot-js/apps/issues/8867
                // Leemo: 'wss://leemo.gmordie.com', // https://github.com/polkadot-js/apps/issues/9712
                // 'bLd Nodes': 'wss://ws.gm.bldnodes.org', // https://github.com/polkadot-js/apps/issues/9947
                "light client": "light://substrate-connect/kusama/gm",
              },
              text: "GM",
              ui: {
                color: "#f47b36",
                logo: chainsGmJPEG,
              },
            },
            {
              homepage: "https://hyperbridge.network",
              info: "hyperbridge",
              paraId: 3340,
              providers: {
                // BlockOps: 'wss://hyperbridge-messier-rpc.blockops.network' // https://github.com/polkadot-js/apps/issues/10555
              },
              text: "Hyperbridge (Messier)",
              ui: {
                color: "#ED6FF1",
                logo: nodesHyperbridgePNG,
              },
            },
            {
              homepage: "https://imbue.network",
              info: "imbue",
              paraId: 2121,
              providers: {
                "Imbue Network 0": "wss://kusama.imbuenetwork.com",
                // 'Imbue Network 1': 'wss://collator.production.imbue.network' // https://github.com/polkadot-js/apps/issues/9848
              },
              text: "Imbue Network",
              ui: {
                color: "#baff36",
                logo: nodesImbuePNG,
              },
            },
            {
              homepage: "https://integritee.network",
              info: "integritee",
              paraId: 2015,
              providers: {
                Integritee: "wss://kusama.api.integritee.network",
                OnFinality:
                  "wss://integritee-kusama.api.onfinality.io/public-ws",
              },
              text: "Integritee Network",
              ui: {
                color: "#2e154b",
                logo: nodesIntegriteeSVG,
              },
            },
            {
              homepage: "https://invarch.network/tinkernet",
              info: "tinker",
              paraId: 2125,
              providers: {
                // 'InvArch Team': 'wss://tinker.invarch.network', // https://github.com/polkadot-js/apps/issues/8623
                Dwellir: "wss://tinkernet-rpc.dwellir.com",
                // OnFinality: 'wss://invarch-tinkernet.api.onfinality.io/public-ws', // https://github.com/polkadot-js/apps/issues/9955
                "light client": "light://substrate-connect/kusama/tinkernet",
              },
              text: "InvArch Tinkernet",
              ui: {
                color: "#161616",
                logo: chainsTinkerPNG,
              },
            },
            {
              homepage: "https://kabocha.network",
              info: "kabocha",
              paraId: 2113,
              providers: {
                JelliedOwl: "wss://kabocha.jelliedowl.net",
              },
              text: "Kabocha",
              ui: {
                color:
                  "repeating-radial-gradient(black, black 4px, yellow 5px)",
                logo: nodesKabochaSVG,
              },
            },
            {
              homepage: "https://acala.network/karura/join-karura",
              info: "karura",
              paraId: 2000,
              providers: {
                "Acala Foundation 0": "wss://karura-rpc-0.aca-api.network",
                "Acala Foundation 1": "wss://karura-rpc-1.aca-api.network",
                "Acala Foundation 2": "wss://karura-rpc-2.aca-api.network/ws",
                "Acala Foundation 3": "wss://karura-rpc-3.aca-api.network/ws",
                Dwellir: "wss://karura-rpc.dwellir.com",
                // LuckyFriday: 'wss://rpc-karura.luckyfriday.io',  // https://github.com/polkadot-js/apps/issues/10663
                OnFinality: "wss://karura.api.onfinality.io/public-ws",
                // 'Polkawallet 0': 'wss://karura.polkawallet.io' // https://github.com/polkadot-js/apps/issues/9383
              },
              text: "Karura",
              ui: {
                color: "#ff4c3b",
                logo: chainsKaruraSVG,
              },
            },
            {
              homepage: "https://phala.network/",
              info: "khala",
              paraId: 2004,
              providers: {
                Dwellir: "wss://khala-rpc.dwellir.com",
                Helikon: "wss://rpc.helikon.io/khala",
                OnFinality: "wss://khala.api.onfinality.io/public-ws",
                Phala: "wss://khala-api.phala.network/ws",
                RadiumBlock: "wss://khala.public.curie.radiumblock.co/ws",
                // Rockx: 'wss://rockx-khala.w3node.com/polka-public-khala/ws' // https://github.com/polkadot-js/apps/issues/10728
              },
              text: "Khala Network",
              ui: {
                color: "#03f3f3",
                logo: nodesKhalaSVG,
              },
            },
            {
              homepage: "https://dico.io/",
              info: "kico",
              paraId: 2107,
              providers: {
                // 'DICO Foundation': 'wss://rpc.kico.dico.io' // https://github.com/polkadot-js/apps/issues/9266
                // 'DICO Foundation 2': 'wss://rpc.api.kico.dico.io' // https://github.com/polkadot-js/apps/issues/8203
              },
              text: "KICO",
              ui: {
                color: "#29B58D",
                logo: chainsKicoPNG,
              },
            },
            {
              homepage: "https://dico.io/",
              info: "kico 2",
              paraId: 2235,
              providers: {
                // 'DICO Foundation': 'wss://rpc.kico2.dico.io' // https://github.com/polkadot-js/apps/issues/8415
              },
              text: "KICO 2",
              ui: {
                color: "#29B58D",
                logo: chainsKicoPNG,
              },
            },
            {
              homepage: "https://kintsugi.interlay.io/",
              info: "kintsugi",
              paraId: 2092,
              providers: {
                Dwellir: "wss://kintsugi-rpc.dwellir.com",
                "Kintsugi Labs": "wss://api-kusama.interlay.io/parachain",
                // LuckyFriday: 'wss://rpc-kintsugi.luckyfriday.io/', // https://github.com/polkadot-js/apps/issues/9947
                OnFinality: "wss://kintsugi.api.onfinality.io/public-ws",
              },
              text: "Kintsugi BTC",
              ui: {
                color: "#1a0a2d",
                logo: chainsKintsugiPNG,
              },
            },
            {
              homepage: "http://apron.network/",
              info: "kpron",
              isUnreachable: true,
              paraId: 2019,
              providers: {
                Kpron: "wss://kusama-kpron-rpc.apron.network/",
              },
              text: "Kpron",
              ui: {
                color: "linear-gradient(45deg, #0099F7 0%, #2E49EB 100%)",
                logo: nodesApronPNG,
              },
            },
            {
              homepage: "https://virto.network/",
              info: "kreivo",
              paraId: 2281,
              providers: {
                Kippu: "wss://kreivo.kippu.rocks/",
                Virto: "wss://kreivo.io/",
              },
              text: "Kreivo - By Virto",
              ui: {
                color: "#294940",
                identityIcon: "polkadot",
                logo: chainsKreivoSVG,
              },
            },
            {
              homepage: "https://krest.peaq.network/",
              info: "krest",
              paraId: 2241,
              providers: {
                Dwellir: "wss://krest-rpc.dwellir.com",
                Krest: "wss://wss-krest.peaq.network/",
                OnFinality: "wss://krest.api.onfinality.io/public-ws",
                UnitedBloc: "wss://krest.unitedbloc.com/",
              },
              text: "Krest",
              ui: {
                logo: nodesKrestPNG,
              },
            },
            {
              homepage: "https://listen.io/",
              info: "listen",
              paraId: 2118,
              providers: {
                // 'Listen Foundation 1': 'wss://rpc.mainnet.listen.io', // https://github.com/polkadot-js/apps/issues/9069
                // 'Listen Foundation 2': 'wss://wss.mainnet.listen.io' // https://github.com/polkadot-js/apps/issues/9106
              },
              text: "Listen Network",
              ui: {
                color: "#FFAD0A",
                logo: chainsListenPNG,
              },
            },
            {
              homepage: "https://www.litentry.com/",
              info: "litmus",
              paraId: 2106,
              providers: {
                // Litentry: 'wss://rpc.litmus-parachain.litentry.io' // https://github.com/polkadot-js/apps/issues/10912
              },
              text: "Litmus",
              ui: {
                color: "#3913D3",
                logo: nodesLitmusPNG,
              },
            },
            {
              homepage: "https://loomx.io/",
              info: "loomNetwork",
              paraId: 2080,
              providers: {
                // LoomNetwork: 'wss://kusama.dappchains.com' // https://github.com/polkadot-js/apps/issues/5888
              },
              text: "Loom Network",
              ui: {
                logo: nodesLoomNetworkPNG,
              },
            },
            {
              homepage: "https://mangata.finance",
              info: "mangata",
              paraId: 2110,
              providers: {
                "Mangata Archive": "wss://kusama-archive.mangata.online",
                "Mangata RPC": "wss://kusama-rpc.mangata.online",
              },
              text: "Mangata",
              ui: {
                color: "#030408",
                logo: chainsMangataPNG,
              },
            },
            {
              homepage: "https://www.aresprotocol.io/mars",
              info: "mars",
              paraId: 2008,
              providers: {
                // AresProtocol: 'wss://wss.mars.aresprotocol.io' // https://github.com/polkadot-js/apps/issues/8937
              },
              text: "Mars",
              ui: {
                color: "#E56239",
                logo: nodesAresMarsPNG,
              },
            },
            {
              homepage: "https://moonbeam.network/networks/moonriver/",
              info: "moonriver",
              paraId: 2023,
              providers: {
                Allnodes: "wss://moonriver-rpc.publicnode.com",
                Blast: "wss://moonriver.public.blastapi.io",
                Dwellir: "wss://moonriver-rpc.dwellir.com",
                "Moonbeam Foundation":
                  "wss://wss.api.moonriver.moonbeam.network",
                OnFinality: "wss://moonriver.api.onfinality.io/public-ws",
                RadiumBlock: "wss://moonriver.public.curie.radiumblock.co/ws",
                UnitedBloc: "wss://moonriver.unitedbloc.com",
              },
              text: "Moonriver",
              ui: {
                color: "#06353d",
                logo: nodesMoonriverSVG,
              },
            },
            {
              homepage: "https://parallel.fi",
              info: "heiko",
              paraId: 2085,
              providers: {
                // OnFinality: 'wss://parallel-heiko.api.onfinality.io/public-ws', // https://github.com/polkadot-js/apps/issues/9964
                Parallel: "wss://heiko-rpc.parallel.fi",
              },
              text: "Parallel Heiko",
              ui: {
                color: "#42d5de",
                logo: nodesParallelSVG,
              },
            },
            {
              homepage: "https://parallel.fi",
              info: "heiko",
              isUnreachable: true,
              paraId: 2126,
              providers: {},
              text: "Parallel Heiko 2",
              ui: {
                color: "#42d5de",
                logo: nodesParallelSVG,
              },
            },
            {
              homepage: "https://picasso.composable.finance/",
              info: "picasso",
              paraId: 2087,
              providers: {
                Composable: "wss://rpc.composablenodes.tech",
                Dwellir: "wss://picasso-rpc.dwellir.com",
                // LuckyFriday: 'wss://rpc-picasso.luckyfriday.io' // https://github.com/polkadot-js/apps/issues/9947
              },
              text: "Picasso",
              ui: {
                color: "#000000",
                logo: nodesPicassoPNG,
              },
            },
            {
              homepage: "https://kylin.network/",
              info: "pichiu",
              paraId: 2102,
              providers: {
                // 'Kylin Network': 'wss://kusama.kylin-node.co.uk' // https://github.com/polkadot-js/apps/issues/9560
              },
              text: "Pichiu",
              ui: {
                color: "#ed007e",
                logo: nodesPichiuPNG,
              },
            },
            {
              homepage: "https://pioneer.bit.country/?ref=polkadotjs",
              info: "pioneer",
              paraId: 2096,
              providers: {
                MetaverseNetwork: "wss://pioneer-rpc-3.bit.country/wss",
                // OnFinality: 'wss://pioneer.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/9955
              },
              text: "Pioneer",
              ui: {
                color: "#000000",
                logo: nodesBitcountryPNG,
              },
            },
            {
              homepage: "https://polkasmith.polkafoundry.com/",
              info: "polkasmith",
              paraId: 2009,
              providers: {
                // PolkaSmith: 'wss://wss-polkasmith.polkafoundry.com' // https://github.com/polkadot-js/apps/issues/6595
              },
              text: "PolkaSmith by PolkaFoundry",
              ui: {
                color: "#0DDDFB",
                logo: nodesPolkasmithSVG,
              },
            },
            {
              info: "qpn",
              paraId: 2274,
              providers: {
                // FerrumNetwork: 'wss://qpn.svcs.ferrumnetwork.io/' // https://github.com/polkadot-js/apps/issues/10172
              },
              text: "Quantum Portal Network",
              ui: {
                color: "#b37700",
                logo: chainsQpnPNG,
              },
            },
            {
              homepage: "https://unique.network/",
              info: "quartz",
              paraId: 2095,
              providers: {
                Dwellir: "wss://quartz-rpc.dwellir.com",
                // OnFinality: 'wss://quartz.api.onfinality.io/public-ws', // https://github.com/polkadot-js/apps/issues/9972
                "Geo Load Balancer": "wss://ws-quartz.unique.network",
                "Unique America": "wss://us-ws-quartz.unique.network",
                "Unique Asia": "wss://asia-ws-quartz.unique.network",
                "Unique Europe": "wss://eu-ws-quartz.unique.network",
              },
              text: "QUARTZ by UNIQUE",
              ui: {
                color: "#FF4D6A",
                logo: nodesQuartzPNG,
              },
            },
            {
              homepage: "https://riodefi.com",
              info: "riodefi",
              paraId: 2227,
              providers: {
                // RioProtocol: 'wss://rio-kusama.riocorenetwork.com' // https://github.com/polkadot-js/apps/issues/9261
              },
              text: "RioDeFi",
              ui: {
                color: "#4E7AED",
                logo: chainsRiodefiPNG,
              },
            },
            {
              homepage: "http://robonomics.network/",
              info: "robonomics",
              paraId: 2048,
              providers: {
                Airalab: "wss://kusama.rpc.robonomics.network/",
                // Dwellir: 'wss://robonomics-rpc.dwellir.com', // https://github.com/polkadot-js/apps/issues/10912
                // Leemo: 'wss://robonomics.leemo.me', // https://github.com/polkadot-js/apps/issues/9817
                // OnFinality: 'wss://robonomics.api.onfinality.io/public-ws', // https://github.com/polkadot-js/apps/issues/9824
                Samsara: "wss://robonomics.0xsamsara.com",
              },
              text: "Robonomics",
              ui: {
                color: "#2949d3",
                logo: nodesRobonomicsSVG,
              },
            },
            {
              homepage: "http://robonomics.network/",
              info: "robonomics",
              isUnreachable: true,
              paraId: 2240,
              providers: {
                Airalab: "wss://kusama.rpc.robonomics.network/",
                // Leemo: 'wss://robonomics.leemo.me', // https://github.com/polkadot-js/apps/issues/9817
                // OnFinality: 'wss://robonomics.api.onfinality.io/public-ws', // https://github.com/polkadot-js/apps/issues/9824
                Samsara: "wss://robonomics.0xsamsara.com",
              },
              text: "Robonomics 2",
              ui: {
                color: "#2949d3",
                logo: nodesRobonomicsSVG,
              },
            },
            {
              homepage: "https://clover.finance/",
              info: "sakura",
              isUnreachable: true,
              paraId: 2016,
              providers: {
                Clover: "wss://api-sakura.clover.finance",
              },
              text: "Sakura",
              ui: {
                color: "#ff5995",
                logo: nodesSakuraSVG,
              },
            },
            {
              homepage: "https://shiden.astar.network/",
              info: "shiden",
              paraId: 2007,
              providers: {
                Astar: "wss://rpc.shiden.astar.network",
                Blast: "wss://shiden.public.blastapi.io",
                Dwellir: "wss://shiden-rpc.dwellir.com",
                OnFinality: "wss://shiden.api.onfinality.io/public-ws",
                RadiumBlock: "wss://shiden.public.curie.radiumblock.co/ws",
                "light client": "light://substrate-connect/kusama/shiden",
              },
              text: "Shiden",
              ui: {
                color: "#5923B2",
                logo: chainsShidenPNG,
              },
            },
            {
              homepage: "https://shiden.astar.network/",
              info: "shiden",
              isUnreachable: true,
              paraId: 2120,
              providers: {
                StakeTechnologies: "wss://rpc.shiden.astar.network",
              },
              text: "Shiden Crowdloan 2",
              ui: {
                color: "#5923B2",
                logo: chainsShidenPNG,
              },
            },
            {
              homepage: "https://icenetwork.io/snow",
              info: "snow",
              paraId: 2129,
              providers: {
                // IceNetwork: 'wss://snow-rpc.icenetwork.io' // https://github.com/polkadot-js/apps/issues/9405
              },
              text: "SNOW Network",
              ui: {
                logo: nodesSnowPNG,
              },
            },
            {
              homepage: "https://sora.org/",
              info: "sora",
              paraId: 2011,
              providers: {
                Soramitsu:
                  "wss://ws.parachain-collator-2.c2.sora2.soramitsu.co.jp",
              },
              text: "SORA",
              ui: {
                color: "#2D2926",
                logo: nodesSoraSubstrateSVG,
              },
            },
            {
              homepage: "http://subgame.org/",
              info: "subgame",
              paraId: 2018,
              providers: {
                // SubGame: 'wss://gamma.subgame.org/' // https://github.com/polkadot-js/apps/issues/7982
              },
              text: "SubGame Gamma",
              ui: {
                color: "#EB027D",
                logo: nodesSubgameSVG,
              },
            },
            {
              homepage: "https://subsocial.network/",
              info: "subsocialX",
              paraId: 2100,
              providers: {
                // 'Dappforce 1': 'wss://para.subsocial.network'
              },
              text: "SubsocialX",
              ui: {
                color: "#69058C",
                logo: nodesSubsocialXSVG,
              },
            },
            {
              homepage: "https://www.t3rn.io/",
              info: "t1rn",
              paraId: 3334,
              providers: {
                // t3rn: 'wss://rpc.t1rn.io' // https://github.com/polkadot-js/apps/issues/10091
              },
              text: "t1rn",
              ui: {
                color: "#131532",
                logo: nodesT1rnPNG,
              },
            },
            {
              homepage: "https://www.datahighway.com/",
              info: "tanganika",
              paraId: 2116,
              providers: {
                // DataHighway: 'wss://tanganika.datahighway.com' // https://github.com/polkadot-js/apps/issues/9383
              },
              text: "Tanganika",
              ui: {
                color:
                  "linear-gradient(-90deg, #9400D3 0%, #5A5CA9 50%, #00BFFF 100%)",
                logo: nodesDatahighwayPNG,
              },
            },
            {
              homepage: "https://trustbase.network/",
              info: "trustbase",
              isUnreachable: true,
              paraId: 2078,
              providers: {},
              text: "TrustBase",
              ui: {
                color: "#ff43aa",
                logo: nodesTrustbasePNG,
              },
            },
            {
              homepage: "https://oak.tech",
              info: "turing",
              paraId: 2114,
              providers: {
                Dwellir: "wss://turing-rpc.dwellir.com",
                OAK: "wss://rpc.turing.oak.tech",
              },
              text: "Turing Network",
              ui: {
                color: "#A8278C",
                logo: chainsTuringPNG,
              },
            },
            {
              homepage: "https://standard.tech/",
              info: "unorthodox",
              paraId: 2094,
              providers: {
                // 'Standard Protocol': 'wss://rpc.kusama.standard.tech' // https://github.com/polkadot-js/apps/issues/8525
              },
              text: "Unorthodox",
              ui: {
                color:
                  "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(42,244,187,1) 35%, rgba(10,10,10,1) 100%)",
                logo: chainsUnorthodoxPNG,
              },
            },
            {
              homepage: "https://xode.net",
              info: "xode",
              paraId: 3344,
              providers: {
                XodeCommunity:
                  "wss://rpcnodea01.xode.net/n7yoxCmcIrCF6VziCcDmYTwL8R03a/rpc",
              },
              text: "Xode",
              ui: {
                color: "#ed1f7a",
                logo: nodesXodePNG,
              },
            },
            {
              homepage: "https://yerba.network",
              info: "yerba",
              paraId: 3345,
              providers: {},
              text: "Yerba Network",
              ui: {
                color: "#a5503c",
                logo: nodesYerbanetworkPNG,
              },
            },
            {
              homepage: "https://zero.io",
              info: "zero",
              paraId: 2236,
              providers: {
                // 'Zero Network': 'wss://rpc-1.kusama.node.zero.io' // https://github.com/polkadot-js/apps/issues/10803
              },
              text: "ZERO Canary",
              ui: {
                color: "#000000",
                logo: nodesZeroSVG,
              },
            },
          ];
          this.endpoints.push(
            {
              info: "KusamaAssetHub",
              isPeopleForIdentity: true,
              paraId: 1000,
              providers: {
                Dwellir: "wss://asset-hub-kusama-rpc.dwellir.com",
                "Dwellir Tunisia": "wss://statemine-rpc-tn.dwellir.com",
                IBP1: "wss://sys.ibp.network/statemine",
                IBP2: "wss://asset-hub-kusama.dotters.network",
                LuckyFriday: "wss://rpc-asset-hub-kusama.luckyfriday.io",
                // OnFinality: 'wss://statemine.api.onfinality.io/public-ws',
                Parity: "wss://kusama-asset-hub-rpc.polkadot.io",
                RadiumBlock: "wss://statemine.public.curie.radiumblock.co/ws",
                Stakeworld: "wss://ksm-rpc.stakeworld.io/assethub",
              },
              relayName: "kusama",
              teleport: [-1],
              text: "AssetHub",
              ui: {
                color: "#113911",
                logo: chainsAssethubKusamaSVG,
              },
            },
            {
              info: "kusamaBridgeHub",
              isPeopleForIdentity: true,
              paraId: 1002,
              providers: {
                Dwellir: "wss://bridge-hub-kusama-rpc.dwellir.com",
                "Dwellir Tunisia": "wss://kusama-bridge-hub-rpc-tn.dwellir.com",
                IBP1: "wss://sys.ibp.network/bridgehub-kusama",
                IBP2: "wss://bridge-hub-kusama.dotters.network",
                LuckyFriday: "wss://rpc-bridge-hub-kusama.luckyfriday.io",
                // OnFinality: 'wss://bridgehub-kusama.api.onfinality.io/public-ws',
                Parity: "wss://kusama-bridge-hub-rpc.polkadot.io",
                RadiumBlock:
                  "wss://bridgehub-kusama.public.curie.radiumblock.co/ws",
                Stakeworld: "wss://ksm-rpc.stakeworld.io/bridgehub",
              },
              relayName: "kusama",
              teleport: [-1],
              text: "BridgeHub",
              ui: {
                logo: nodesBridgeHubBlackSVG,
              },
            },
            {
              info: "kusamaCoretime",
              isPeopleForIdentity: true,
              paraId: 1005,
              providers: {
                Dwellir: "wss://coretime-kusama-rpc.dwellir.com",
                IBP1: "wss://sys.ibp.network/coretime-kusama",
                IBP2: "wss://coretime-kusama.dotters.network",
                LuckyFriday: "wss://rpc-coretime-kusama.luckyfriday.io",
                Parity: "wss://kusama-coretime-rpc.polkadot.io",
                Stakeworld: "wss://ksm-rpc.stakeworld.io/coretime",
              },
              relayName: "kusama",
              teleport: [-1],
              text: "Coretime",
              ui: {
                color: "#113911",
                logo: chainsCoretimeKusamaSVG,
              },
            },
            {
              homepage: "https://encointer.org/",
              info: "encointer",
              isPeopleForIdentity: true,
              paraId: 1001,
              providers: {
                Dwellir: "wss://encointer-kusama-rpc.dwellir.com",
                "Encointer Association": "wss://kusama.api.encointer.org",
                IBP1: "wss://sys.ibp.network/encointer-kusama",
                IBP2: "wss://encointer-kusama.dotters.network",
                // OnFinality: 'wss://encointer.api.onfinality.io/public-ws', // https://github.com/polkadot-js/apps/issues/9986
                // Stakeworld: 'wss://ksm-rpc.stakeworld.io/encointer'
              },
              relayName: "kusama",
              teleport: [-1],
              text: "Encointer Network",
              ui: {
                color: "#0000cc",
                logo: nodesEncointerBlueSVG,
              },
            },
            {
              info: "kusamaPeople",
              isPeople: true,
              isPeopleForIdentity: false,
              paraId: 1004,
              providers: {
                Dwellir: "wss://people-kusama-rpc.dwellir.com",
                IBP1: "wss://sys.ibp.network/people-kusama",
                IBP2: "wss://people-kusama.dotters.network",
                LuckyFriday: "wss://rpc-people-kusama.luckyfriday.io",
                Parity: "wss://kusama-people-rpc.polkadot.io",
                Stakeworld: "wss://ksm-rpc.stakeworld.io/people",
              },
              relayName: "kusama",
              teleport: [-1],
              text: "People",
              ui: {
                color: "#36454F",
                logo: chainsPeopleKusamaSVG,
              },
            }
          );
          break;
        case "Polkadot":
        case "Westend":
          // https://github.com/polkadot-js/apps/blob/master/packages/apps-config/src/endpoints/productionRelayPolkadot.ts
          this.endpoints = [
            {
              homepage: "https://acala.network/",
              info: "acala",
              paraId: 2000,
              providers: {
                "Acala Foundation 0": "wss://acala-rpc-0.aca-api.network",
                "Acala Foundation 1": "wss://acala-rpc-1.aca-api.network",
                // 'Acala Foundation 2': 'wss://acala-rpc-2.aca-api.network/ws', // https://github.com/polkadot-js/apps/issues/6965
                "Acala Foundation 3": "wss://acala-rpc-3.aca-api.network/ws",
                Dwellir: "wss://acala-rpc.dwellir.com",
                // LuckyFriday: 'wss://rpc-acala.luckyfriday.io', // https://github.com/polkadot-js/apps/issues/10728
                // 'Automata 1RPC': 'wss://1rpc.io/aca' // https://github.com/polkadot-js/apps/issues/8648
                OnFinality: "wss://acala-polkadot.api.onfinality.io/public-ws",
                // 'Polkawallet 0': 'wss://acala.polkawallet.io' // https://github.com/polkadot-js/apps/issues/9760
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
            {
              homepage: "https://www.aresprotocol.io/",
              info: "odyssey",
              paraId: 2028,
              providers: {
                // AresProtocol: 'wss://wss.odyssey.aresprotocol.io' // https://github.com/polkadot-js/apps/issues/9059
              },
              text: "Ares Odyssey",
              ui: {
                color: "#1295F0",
                logo: nodesAresOdysseySVG,
              },
            },
            {
              homepage: "https://astar.network",
              info: "astar",
              paraId: 2006,
              providers: {
                Astar: "wss://rpc.astar.network",
                "Automata 1RPC": "wss://1rpc.io/astr",
                Blast: "wss://astar.public.blastapi.io",
                Dwellir: "wss://astar-rpc.dwellir.com",
                OnFinality: "wss://astar.api.onfinality.io/public-ws",
                RadiumBlock: "wss://astar.public.curie.radiumblock.co/ws",
                "light client": "light://substrate-connect/polkadot/astar",
              },
              text: "Astar",
              ui: {
                color: "#1b6dc1d9",
                logo: nodesAstarPNG,
              },
            },
            {
              homepage: "https://www.aventus.io/",
              info: "aventus",
              paraId: 2056,
              providers: {
                Aventus: "wss://public-rpc.mainnet.aventus.network",
              },
              text: "Aventus",
              ui: {
                color: "#1d2733",
                logo: nodesAventusSVG,
              },
            },
            {
              homepage: "https://crowdloan.bifrost.app",
              info: "bifrost",
              paraId: 2030,
              providers: {
                Dwellir: "wss://bifrost-polkadot-rpc.dwellir.com",
                IBP1: "wss://bifrost-polkadot.ibp.network",
                IBP2: "wss://bifrost-polkadot.dotters.network",
                Liebi: "wss://hk.p.bifrost-rpc.liebi.com/ws",
                LiebiEU: "wss://eu.bifrost-polkadot-rpc.liebi.com/ws",
                OnFinality:
                  "wss://bifrost-polkadot.api.onfinality.io/public-ws",
                RadiumBlock: "wss://bifrost.public.curie.radiumblock.co/ws",
              },
              text: "Bifrost",
              ui: {
                color: "#5a25f0",
                logo: nodesBifrostSVG,
              },
            },
            {
              homepage: "https://www.bitgreen.org",
              info: "bitgreen",
              paraId: 2048,
              providers: {
                Bitgreen: "wss://mainnet.bitgreen.org",
                // OnFinality: 'wss://bitgreen.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/9993
              },
              text: "Bitgreen",
              ui: {
                color: "#224851",
                logo: chainsBitgreenPNG,
              },
            },
            {
              homepage: "https://centrifuge.io",
              info: "centrifuge",
              paraId: 2031,
              providers: {
                Centrifuge: "wss://fullnode.centrifuge.io",
                Dwellir: "wss://centrifuge-rpc.dwellir.com",
                LuckyFriday: "wss://rpc-centrifuge.luckyfriday.io",
                OnFinality:
                  "wss://centrifuge-parachain.api.onfinality.io/public-ws",
              },
              text: "Centrifuge",
              ui: {
                color: "#fcc367",
                logo: nodesCentrifugePNG,
              },
            },
            {
              homepage: "https://clover.finance",
              info: "clover",
              paraId: 2002,
              providers: {
                // Clover: 'wss://rpc-para.clover.finance' // https://github.com/polkadot-js/apps/issues/10172
                // OnFinality: 'wss://clover.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/9986
              },
              text: "Clover",
              ui: {
                color: "linear-gradient(to right, #52ad75, #7cc773)",
                logo: nodesCloverSVG,
              },
            },
            {
              homepage: "http://www.coinversation.io/",
              info: "coinversation",
              paraId: 2027,
              providers: {
                // Coinversation: 'wss://rpc.coinversation.io/' // https://github.com/polkadot-js/apps/issues/6635
              },
              text: "Coinversation",
              ui: {
                color: "#e6017a",
                logo: nodesCoinversationPNG,
              },
            },
            {
              homepage: "https://composable.finance/",
              info: "composable",
              paraId: 2019,
              providers: {
                Composable: "wss://rpc.composable.finance",
                Dwellir: "wss://composable-rpc.dwellir.com",
                // OnFinality: 'wss://composable.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/9986
              },
              text: "Composable Finance",
              ui: {
                color: "#C90E8A",
                logo: chainsComposableFinancePNG,
              },
            },
            {
              homepage: "https://mnet.io/?ref=polkadotjs",
              info: "continuum",
              paraId: 3346,
              providers: {
                MNet: "wss://continuum-rpc-1.metaverse.network/wss",
              },
              text: "Continuum",
              ui: {
                color: "linear-gradient(94deg, #2B388F 2.95%, #DB126E 97.18%)",
                logo: nodesContinuumPNG,
              },
            },
            {
              homepage: "https://crust.network",
              info: "crustParachain",
              paraId: 2008,
              providers: {
                Crust: "wss://crust-parachain.crustapps.net",
                "Crust APP": "wss://crust-parachain.crustnetwork.app",
                "Crust CC": "wss://crust-parachain.crustnetwork.cc",
                "Crust XYZ": "wss://crust-parachain.crustnetwork.xyz",
                // OnFinality: 'wss://crust-polkadot.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/10013
              },
              text: "Crust",
              ui: {
                logo: nodesCrustParachainSVG,
              },
            },
            {
              homepage: "https://darwinia.network/",
              info: "darwinia",
              paraId: 2046,
              providers: {
                Darwinia: "wss://rpc.darwinia.network",
                Dcdao: "wss://darwinia-rpc.dcdao.box",
                Dwellir: "wss://darwinia-rpc.dwellir.com",
              },
              text: "Darwinia",
              ui: {
                color: "#FF0083",
                logo: nodesDarwiniaSVG,
              },
            },
            {
              homepage: "https://efinity.io",
              info: "efinity",
              paraId: 2021,
              providers: {
                // NOTE We don't support connections to this parachain at all.
                //
                // 1. The chain is migrated away from the parachain with all balances
                // 2. There is a forked relay-involved which we don't support
                //
                // Additional details in original removal at
                // https://github.com/polkadot-js/apps/pull/9555/files#r1225095086
              },
              text: "Efinity",
              ui: {
                color: "#496ddb",
                logo: nodesEfinitySVG,
              },
            },
            {
              homepage: "https://energywebx.com/",
              info: "ewx",
              paraId: 3345,
              providers: {
                "Energy Web": "wss://public-rpc.mainnet.energywebx.com/",
              },
              text: "Energy Web X",
              ui: {
                color: "#53B1FF",
                logo: nodesEwxSVG,
              },
            },
            {
              homepage: "https://equilibrium.io/",
              info: "equilibrium",
              paraId: 2011,
              providers: {
                // Dwellir: 'wss://equilibrium-rpc.dwellir.com'
                // OnFinality: 'wss://equilibrium.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/9977
                // Equilibrium: 'wss://node.equilibrium.io' // https://github.com/polkadot-js/apps/issues/10174
              },
              text: "Equilibrium",
              ui: {
                color: "#1792ff",
                logo: chainsEquilibriumSVG,
              },
            },
            {
              homepage: "https://frequency.xyz",
              info: "frequency",
              paraId: 2091,
              providers: {
                Dwellir: "wss://frequency-rpc.dwellir.com",
                "Frequency 0": "wss://0.rpc.frequency.xyz",
                "Frequency 1": "wss://1.rpc.frequency.xyz",
                OnFinality:
                  "wss://frequency-polkadot.api.onfinality.io/public-ws",
              },
              text: "Frequency",
              ui: {
                color: "#00b6af",
                logo: chainsFrequencySVG,
              },
            },
            {
              homepage: "https://geminis.network/",
              info: "geminis",
              isUnreachable: true,
              paraId: 2038,
              providers: {
                Geminis: "wss://rpc.geminis.network",
              },
              text: "Geminis",
              ui: {
                logo: chainsGeminisPNG,
              },
            },
            {
              homepage: "https://hashed.network/",
              info: "hashed",
              paraId: 2093,
              providers: {
                "Hashed Systems 1": "wss://c1.hashed.network",
                // 'Hashed Systems 2': 'wss://c2.hashed.network', // https://github.com/polkadot-js/apps/issues/10912
                // 'Hashed Systems 3': 'wss://c3.hashed.network' // https://github.com/polkadot-js/apps/issues/10912
              },
              text: "Hashed Network",
              ui: {
                color: "#9199A9",
                logo: nodesHashedPNG,
              },
            },
            {
              homepage: "https://hydration.net/",
              info: "hydradx",
              paraId: 2034,
              providers: {
                Dwellir: "wss://hydradx-rpc.dwellir.com",
                "Galactic Council": "wss://rpc.hydradx.cloud",
                Helikon: "wss://rpc.helikon.io/hydradx",
                IBP1: "wss://hydradx.paras.ibp.network",
                IBP2: "wss://hydration.dotters.network",
                // OnFinality: 'wss://hydradx.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/9986
                // ZeePrime: 'wss://rpc-lb.data6.zp-labs.net:8443/hydradx/ws/?token=2ZGuGivPJJAxXiT1hR1Yg2MXGjMrhEBYFjgbdPi' // https://github.com/polkadot-js/apps/issues/9760
              },
              text: "Hydration",
              ui: {
                color: "#240E32",
                logo: chainsHydrationSVG,
              },
            },
            {
              homepage: "https://hyperbridge.network",
              info: "hyperbridge",
              paraId: 3367,
              providers: {
                BlockOps: "wss://hyperbridge-nexus-rpc.blockops.network",
                IBP1: "wss://nexus.ibp.network",
                IBP2: "wss://nexus.dotters.network",
              },
              text: "Hyperbridge (Nexus)",
              ui: {
                color: "#ED6FF1",
                logo: nodesHyperbridgePNG,
              },
            },
            {
              homepage: "https://dot.crowdloan.integritee.network/",
              info: "integritee",
              paraId: 3359,
              providers: {
                Dwellir: "wss://integritee-rpc.dwellir.com",
                Integritee: "wss://polkadot.api.integritee.network",
              },
              text: "Integritee Network",
              ui: {
                color: "#658ea9",
                logo: nodesIntegriteeSVG,
              },
            },
            {
              homepage: "https://integritee.network",
              info: "integritee",
              paraId: 2039,
              providers: {
                // Dwellir: 'wss://integritee-rpc.dwellir.com',
                // Integritee: 'wss://polkadot.api.integritee.network'
              },
              text: "Integritee Network",
              ui: {
                color: "#2e154b",
                logo: nodesIntegriteeSVG,
              },
            },
            {
              homepage: "https://interlay.io/",
              info: "interlay",
              paraId: 2032,
              providers: {
                Dwellir: "wss://interlay-rpc.dwellir.com",
                "Kintsugi Labs": "wss://api.interlay.io/parachain",
                LuckyFriday: "wss://rpc-interlay.luckyfriday.io/",
                // OnFinality: 'wss://interlay.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/9986
              },
              text: "Interlay",
              ui: {
                color: "#3E96FF",
                logo: nodesInterlaySVG,
              },
            },
            {
              homepage: "https://invarch.network/",
              info: "invarch",
              paraId: 3340,
              providers: {
                Dwellir: "wss://invarch-rpc.dwellir.com",
              },
              text: "InvArch",
              ui: {
                color: "linear-gradient(278deg, #f7d365 5.74%, #ff408a 99.41%)",
                logo: chainsInvarchJPEG,
              },
            },
            {
              homepage: "https://totemaccounting.com/",
              info: "kapex",
              paraId: 2007,
              providers: {
                // Dwellir: 'wss://kapex-rpc.dwellir.com'
                // OnFinality: 'wss://kapex-parachain.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/9986
                // Totem: 'wss://k-ui.kapex.network' // https://github.com/polkadot-js/apps/issues/9616
              },
              text: "Kapex",
              ui: {
                color:
                  "linear-gradient(158deg, rgba(226,157,0,1) 0%, rgba(234,55,203,1) 100%)",
                logo: chainsTotemSVG,
              },
            },
            {
              homepage: "https://www.kilt.io/",
              info: "kilt",
              paraId: 2086,
              providers: {
                BOTLabs: "wss://spiritnet.kilt.io/",
                Dwellir: "wss://kilt-rpc.dwellir.com",
                IBP1: "wss://kilt.ibp.network",
                IBP2: "wss://kilt.dotters.network",
              },
              text: "KILT Spiritnet",
              ui: {
                color: "#8c145a",
                logo: nodesKiltPNG,
              },
            },
            {
              homepage: "https://kylin.network/",
              info: "kylin",
              paraId: 2052,
              providers: {
                // 'Kylin Network': 'wss://polkadot.kylin-node.co.uk' // https://github.com/polkadot-js/apps/issues/10030
              },
              text: "Kylin",
              ui: {
                color: "#ed007e",
                logo: nodesKylinPNG,
              },
            },
            {
              homepage: "https://laosnetwork.io/",
              info: "laos",
              paraId: 3370,
              providers: {
                Dwellir: "wss://laos-rpc.dwellir.com",
                "freeverse.io": "wss://rpc.laos.laosfoundation.io",
              },
              text: "Laos",
              ui: {
                color:
                  "linear-gradient(90deg, #25143B 0%, #613D93 29.69%, #EF9365 69.79%, #E2CF61 100%)",
                logo: chainsLaosPNG,
              },
            },
            {
              homepage: "https://www.litentry.com/",
              info: "litentry",
              paraId: 2013,
              providers: {
                Dwellir: "wss://litentry-rpc.dwellir.com",
                Litentry: "wss://rpc.litentry-parachain.litentry.io",
                // OnFinality: 'wss://litentry.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/9993
              },
              text: "Litentry",
              ui: {
                color: "#15B786",
                logo: nodesLitentryPNG,
              },
            },
            {
              homepage: "https://logion.network/",
              info: "logion",
              paraId: 3354,
              providers: {
                "Logion 1": "wss://para-rpc01.logion.network",
                // 'Logion 2': 'wss://para-rpc02.logion.network' // https://github.com/polkadot-js/apps/issues/10890
              },
              text: "Logion",
              ui: {
                color: "rgb(21, 38, 101)",
                logo: chainsLogionPNG,
              },
            },
            {
              homepage: "https://manta.network",
              info: "manta",
              paraId: 2104,
              providers: {
                "Manta Network": "wss://ws.manta.systems",
                // OnFinality: 'wss://manta.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/9977
              },
              text: "Manta",
              ui: {
                color: "#2070a6",
                logo: nodesMantaPNG,
              },
            },
            {
              homepage: "https://moonbeam.network/networks/moonbeam/",
              info: "moonbeam",
              paraId: 2004,
              providers: {
                Allnodes: "wss://moonbeam-rpc.publicnode.com",
                // 'Automata 1RPC': 'wss://1rpc.io/glmr', // https://github.com/polkadot-js/apps/issues/10566
                Blast: "wss://moonbeam.public.blastapi.io",
                Dwellir: "wss://moonbeam-rpc.dwellir.com",
                IBP1: "wss://moonbeam.ibp.network",
                IBP2: "wss://moonbeam.dotters.network",
                "Moonbeam Foundation": "wss://wss.api.moonbeam.network",
                OnFinality: "wss://moonbeam.api.onfinality.io/public-ws",
                RadiumBlock: "wss://moonbeam.public.curie.radiumblock.co/ws",
                UnitedBloc: "wss://moonbeam.unitedbloc.com",
              },
              text: "Moonbeam",
              ui: {
                color: "#000000",
                logo: nodesMoonbeamSVG,
              },
            },
            {
              homepage: "https://moonsama.com",
              info: "moonsama",
              paraId: 3334,
              providers: {
                // Moonsama: 'wss://rpc.moonsama.com/ws' // https://github.com/polkadot-js/apps/issues/10289
              },
              text: "Moonsama",
              ui: {
                color: "#1a202c",
                logo: nodesMoonsamaSVG,
              },
            },
            {
              homepage: "https://mythos.foundation/",
              info: "mythos",
              paraId: 3369,
              providers: {
                parity: "wss://polkadot-mythos-rpc.polkadot.io",
              },
              text: "Mythos",
              ui: {
                color: "#262528",
                logo: nodesMythosPNG,
              },
            },
            {
              homepage: "https://neuroweb.ai",
              info: "neuroweb",
              paraId: 2043,
              providers: {
                Dwellir: "wss://neuroweb-rpc.dwellir.com",
                TraceLabs: "wss://parachain-rpc.origin-trail.network",
              },
              text: "NeuroWeb",
              ui: {
                color: "#000000",
                logo: chainsNeurowebPNG,
              },
            },
            {
              homepage: "https://nodle.com",
              info: "nodle",
              paraId: 2026,
              providers: {
                Dwellir: "wss://nodle-rpc.dwellir.com",
                OnFinality: "wss://nodle-parachain.api.onfinality.io/public-ws",
              },
              text: "Nodle",
              ui: {
                color: "#1ab394",
                logo: nodesNodleSVG,
              },
            },
            {
              homepage: "https://oak.tech",
              info: "oak",
              isUnreachable: true,
              paraId: 2090,
              providers: {
                OAK: "wss://rpc.oak.tech",
              },
              text: "OAK Network",
              ui: {
                color: "#A8278C",
                logo: chainsOakPNG,
              },
            },
            {
              homepage: "https://www.omnibtc.finance",
              info: "omnibtc",
              isUnreachable: true,
              paraId: 2053,
              providers: {
                OmniBTC: "wss://psc-parachain.coming.chat",
              },
              text: "OmniBTC",
              ui: {
                color: "#6759E9",
                logo: nodesOmnibtcSVG,
              },
            },
            {
              homepage: "https://parallel.fi",
              info: "parallel",
              paraId: 2012,
              providers: {
                Dwellir: "wss://parallel-rpc.dwellir.com",
                // OnFinality: 'wss://parallel.api.onfinality.io/public-ws', // https://github.com/polkadot-js/apps/issues/9986
                // Parallel: 'wss://polkadot-parallel-rpc.parallel.fi' // https://github.com/polkadot-js/apps/issues/10220
              },
              text: "Parallel",
              ui: {
                color: "#ef18ac",
                logo: nodesParallelSVG,
              },
            },
            {
              homepage: "https://peaq.network/",
              info: "peaq",
              paraId: 3338,
              providers: {
                // OnFinality: 'wss://peaq.api.onfinality.io/public-ws'
              },
              text: "peaq",
              ui: {
                color: "#281C66",
                logo: chainsPeaqPNG,
              },
            },
            {
              homepage: "https://pendulumchain.org/",
              info: "pendulum",
              paraId: 2094,
              providers: {
                // Dwellir: 'wss://pendulum-rpc.dwellir.com',
                PendulumChain: "wss://rpc-pendulum.prd.pendulumchain.tech",
              },
              text: "Pendulum",
              ui: {
                color: "#49E2FD",
                logo: chainsPendulumSVG,
              },
            },
            {
              homepage: "https://phala.network",
              info: "phala",
              paraId: 2035,
              providers: {
                Dwellir: "wss://phala-rpc.dwellir.com",
                Helikon: "wss://rpc.helikon.io/phala",
                OnFinality: "wss://phala.api.onfinality.io/public-ws",
                Phala: "wss://api.phala.network/ws",
                RadiumBlock: "wss://phala.public.curie.radiumblock.co/ws",
                // Rockx: 'wss://rockx-phala.w3node.com/polka-public-phala/ws' // https://github.com/polkadot-js/apps/issues/10728
              },
              text: "Phala Network",
              ui: {
                color: "#c6fa4c",
                logo: nodesPhalaSVG,
              },
            },
            {
              homepage: "https://www.polimec.org/",
              info: "polimec",
              paraId: 3344,
              providers: {
                Amforc: "wss://polimec.rpc.amforc.com",
                Helikon: "wss://rpc.helikon.io/polimec",
                IBP1: "wss://polimec.ibp.network",
                IBP2: "wss://polimec.dotters.network",
                "Polimec Foundation": "wss://rpc.polimec.org",
              },
              text: "Polimec",
              ui: {
                color: "#25311C",
                logo: nodesPolimecSVG,
              },
            },
            {
              homepage: "https://polkadex.trade/crowdloans",
              info: "polkadex",
              paraId: 3363,
              providers: {
                // Dwellir: 'wss://polkadex-parachain-rpc.dwellir.com',
                // OnFinality: 'wss://polkadex-parachain.api.onfinality.io/public-ws',
                // RadiumBlock: 'wss://polkadex-parachain.public.curie.radiumblock.co/ws'
              },
              text: "Polkadex",
              ui: {
                color: "#7C30DD",
                logo: nodesPolkadexSVG,
              },
            },
            {
              homepage: "https://polkadex.trade/",
              info: "polkadex",
              paraId: 2040,
              providers: {
                Dwellir: "wss://polkadex-parachain-rpc.dwellir.com",
                OnFinality:
                  "wss://polkadex-parachain.api.onfinality.io/public-ws",
                RadiumBlock:
                  "wss://polkadex-parachain.public.curie.radiumblock.co/ws",
              },
              text: "Polkadex",
              ui: {
                color: "#7C30DD",
                logo: nodesPolkadexSVG,
              },
            },
            {
              homepage: "http://robonomics.network/",
              info: "robonomics",
              paraId: 3388,
              providers: {
                Airalab: "wss://polkadot.rpc.robonomics.network/", // https://github.com/polkadot-js/apps/issues/10890
              },
              text: "Robonomics",
              ui: {
                color: "#2949d3",
                logo: nodesRobonomicsSVG,
              },
            },
            {
              homepage: "https://sora.org/",
              info: "sora",
              paraId: 2025,
              providers: {
                Soramitsu:
                  "wss://ws.parachain-collator-3.pc3.sora2.soramitsu.co.jp",
              },
              text: "SORA",
              ui: {
                color: "#2D2926",
                logo: nodesSoraSubstrateSVG,
              },
            },
            {
              homepage: "https://subdao.network/",
              info: "subdao",
              isUnreachable: true,
              paraId: 2018,
              providers: {
                SubDAO: "wss://parachain-rpc.subdao.org",
              },
              text: "SubDAO",
              ui: {
                color: "linear-gradient(50deg, #F20092 0%, #FF4D5D 100%)",
                logo: nodesSubdaoPNG,
              },
            },
            {
              homepage: "http://subgame.org/",
              info: "subgame",
              paraId: 2017,
              providers: {
                // SubGame: 'wss://gamma.subgame.org/' // https://github.com/polkadot-js/apps/pull/6761
              },
              text: "SubGame Gamma",
              ui: {
                color: "#EB027D",
                logo: nodesSubgameSVG,
              },
            },
            {
              homepage: "https://subsocial.network/",
              info: "subsocial",
              paraId: 2101,
              providers: {
                Dappforce: "wss://para.subsocial.network",
                Dwellir: "wss://subsocial-rpc.dwellir.com",
                // OnFinality: 'wss://subsocial-polkadot.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/9977
              },
              text: "Subsocial",
              ui: {
                color: "#b9018c",
                logo: nodesSubsocialSVG,
              },
            },
            {
              homepage: "https://www.t3rn.io/",
              info: "t3rn",
              paraId: 3333,
              providers: {
                t3rn: "wss://ws.t3rn.io",
              },
              text: "t3rn",
              ui: {
                color: "#6f3bb2",
                logo: nodesT3rnPNG,
              },
            },
            {
              homepage: "https://unique.network/",
              info: "unique",
              paraId: 2037,
              providers: {
                Dwellir: "wss://unique-rpc.dwellir.com",
                "Geo Load Balancer": "wss://ws.unique.network",
                IBP1: "wss://unique.ibp.network",
                IBP2: "wss://unique.dotters.network",
                // OnFinality: 'wss://unique.api.onfinality.io/public-ws', // https://github.com/polkadot-js/apps/issues/10030
                "Unique America": "wss://us-ws.unique.network",
                "Unique Asia": "wss://asia-ws.unique.network",
                "Unique Europe": "wss://eu-ws.unique.network",
              },
              text: "Unique Network",
              ui: {
                color: "#40BCFF",
                logo: nodesUniqueSVG,
              },
            },
            {
              homepage: "https://www.watr.org/",
              info: "watr",
              paraId: 2058,
              providers: {
                // Watr: 'wss://watr-rpc.watr-api.network' // https://github.com/polkadot-js/apps/issues/10890
              },
              text: "Watr Network",
              ui: {
                color: "#373b39",
                logo: chainsWatrPNG,
              },
            },
            {
              homepage: "https://zeitgeist.pm",
              info: "zeitgeist",
              paraId: 2092,
              providers: {
                OnFinality: "wss://zeitgeist.api.onfinality.io/public-ws",
                ZeitgeistPM: "wss://main.rpc.zeitgeist.pm/ws",
              },
              text: "Zeitgeist",
              ui: {
                color:
                  "linear-gradient(180deg, rgba(32,90,172,1) 0%, rgba(26,72,138,1) 50%, rgba(13,36,69,1) 100%)",
                logo: nodesZeitgeistPNG,
              },
            },
          ];
          this.endpoints.push(
            {
              info: "PolkadotAssetHub",
              isPeopleForIdentity: true,
              paraId: 1000,
              providers: {
                Dwellir: "wss://asset-hub-polkadot-rpc.dwellir.com",
                "Dwellir Tunisia": "wss://statemint-rpc-tn.dwellir.com",
                IBP1: "wss://sys.ibp.network/asset-hub-polkadot",
                IBP2: "wss://asset-hub-polkadot.dotters.network",
                LuckyFriday: "wss://rpc-asset-hub-polkadot.luckyfriday.io",
                OnFinality: "wss://statemint.api.onfinality.io/public-ws",
                Parity: "wss://polkadot-asset-hub-rpc.polkadot.io",
                RadiumBlock: "wss://statemint.public.curie.radiumblock.co/ws",
                Stakeworld: "wss://dot-rpc.stakeworld.io/assethub",
              },
              relayName: "polkadot",
              teleport: [-1],
              text: "AssetHub",
              ui: {
                color: "#86e62a",
                logo: nodesAssetHubSVG,
              },
            },
            {
              info: "polkadotBridgeHub",
              isPeopleForIdentity: true,
              paraId: 1002,
              providers: {
                Dwellir: "wss://bridge-hub-polkadot-rpc.dwellir.com",
                "Dwellir Tunisia":
                  "wss://polkadot-bridge-hub-rpc-tn.dwellir.com",
                IBP1: "wss://sys.ibp.network/bridgehub-polkadot",
                IBP2: "wss://bridge-hub-polkadot.dotters.network",
                LuckyFriday: "wss://rpc-bridge-hub-polkadot.luckyfriday.io",
                OnFinality:
                  "wss://bridgehub-polkadot.api.onfinality.io/public-ws",
                Parity: "wss://polkadot-bridge-hub-rpc.polkadot.io",
                RadiumBlock:
                  "wss://bridgehub-polkadot.public.curie.radiumblock.co/ws",
                Stakeworld: "wss://dot-rpc.stakeworld.io/bridgehub",
              },
              relayName: "polkadot",
              teleport: [-1],
              text: "BridgeHub",
              ui: {
                logo: nodesBridgeHubSVG,
              },
            },
            {
              info: "polkadotCollectives",
              isPeopleForIdentity: true,
              paraId: 1001,
              providers: {
                Dwellir: "wss://collectives-polkadot-rpc.dwellir.com",
                "Dwellir Tunisia":
                  "wss://polkadot-collectives-rpc-tn.dwellir.com",
                IBP1: "wss://sys.ibp.network/collectives-polkadot",
                IBP2: "wss://collectives-polkadot.dotters.network",
                LuckyFriday: "wss://rpc-collectives-polkadot.luckyfriday.io",
                OnFinality: "wss://collectives.api.onfinality.io/public-ws",
                Parity: "wss://polkadot-collectives-rpc.polkadot.io",
                RadiumBlock: "wss://collectives.public.curie.radiumblock.co/ws",
                Stakeworld: "wss://dot-rpc.stakeworld.io/collectives",
              },
              relayName: "polkadot",
              teleport: [-1],
              text: "Collectives",
              ui: {
                color: "#e6777a",
                logo: "fa;people-group",
              },
            },
            {
              info: "polkadotCoretime",
              isPeopleForIdentity: true,
              paraId: 1005,
              providers: {
                IBP2: "wss://coretime-polkadot.dotters.network",
                Parity: "wss://polkadot-coretime-rpc.polkadot.io",
              },
              relayName: "polkadot",
              teleport: [-1],
              text: "Coretime",
              ui: {},
            },
            {
              info: "polkadotPeople",
              isPeople: true,
              isPeopleForIdentity: false,
              paraId: 1004,
              providers: {
                IBP1: "wss://sys.ibp.network/people-polkadot",
                IBP2: "wss://people-polkadot.dotters.network",
                LuckyFriday: "wss://rpc-people-polkadot.luckyfriday.io",
                Parity: "wss://polkadot-people-rpc.polkadot.io",
                RadiumBlock:
                  "wss://people-polkadot.public.curie.radiumblock.co/ws",
              },
              relayName: "polkadot",
              teleport: [-1],
              text: "People",
              ui: {
                color: "#e84366",
                logo: chainsPeoplePolkadotSVG,
              },
            }
          );
          break;
      }

      // https://github.com/polkadot-js/apps/blob/master/packages/apps-config/src/endpoints/testingRelayRococo.ts
      this.rocEndpoints = [
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
        {
          info: "rococoAventus",
          homepage: "https://www.aventus.io/",
          paraId: 2056,
          text: "Aventus",
          providers: {},
        },
        {
          info: "rococoBajun",
          paraId: 2119,
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
            "Galactic Council": "wss://rococo-basilisk-rpc.hydration.dev",
          },
        },
        {
          info: "rococoBifrost",
          paraId: 2030,
          text: "Bifrost",
          providers: {
            Liebi: "wss://bifrost-rpc.rococo.liebi.com/ws",
          },
        },
        {
          info: "rococoBitgreen",
          paraId: 3024,
          text: "Bitgreen",
          providers: {
            Bitgreen: "wss://testnet.bitgreen.org",
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
          info: "rococoConfti",
          paraId: 4094,
          text: "Confti",
          providers: {
            // Confti: 'wss://ws.confti.club' // https://github.com/polkadot-js/apps/issues/8036
          },
        },
        {
          info: "rococoCrust",
          paraId: 2012,
          text: "Crust Testnet",
          providers: {
            Crust: "wss://rococo-csm.crustcode.com/",
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
            "Manta Network": "wss://ws.rococo.dolphin.engineering",
          },
        },
        {
          info: "Eggnet",
          paraId: 4006,
          text: "Eggnet",
          providers: {
            // Webb: 'wss://rococo1.webb.tools' // https://github.com/polkadot-js/apps/issues/8175
          },
        },
        {
          info: "rococoFrequency",
          paraId: 4044,
          text: "Frequency",
          providers: {
            // Frequency: 'wss://collator1.frequency.xyz' // https://github.com/polkadot-js/apps/issues/8355
          },
        },
        {
          info: "rococoGenshiro",
          paraId: 2024,
          text: "Genshiro Testnet",
          providers: {
            Equilibrium:
              "wss://parachain-testnet.equilab.io/rococo/collator/node1/wss",
          },
        },
        {
          info: "helixstreet",
          paraId: 3025,
          text: "Helixstreet",
          providers: {
            Helixstreet: "wss://rpc-rococo.helixstreet.io",
          },
        },
        {
          info: "rococoHydraDX",
          paraId: 2034,
          text: "HydraDX",
          providers: {
            "Galactic Council": "wss://rococo-hydradx-rpc.hydration.dev",
          },
        },
        {
          info: "rococoImbue",
          paraId: 2121,
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
          info: "rococoKabocha",
          paraId: 2113,
          text: "Kabocha (kabsoup)",
          providers: {
            JelliedOwl: "wss://kabsoup1.jelliedowl.com",
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
          info: "rococoMangata",
          paraId: 2110,
          text: "Mangata",
          providers: {
            Mangata: "wss://roccoco-testnet-collator-01.mangatafinance.cloud",
          },
        },
        {
          info: "rococoMd5",
          paraId: 2089,
          text: "MD5 Network",
          providers: {
            "Hashed Systems": "wss://c1.md5.network",
          },
        },
        {
          info: "rococoMoonsama",
          paraId: 2055,
          text: "Moonsama",
          providers: {
            // Moonsama: 'wss://moonsama-testnet-rpc.moonsama.com' // https://github.com/polkadot-js/apps/issues/7526
          },
        },
        {
          info: "rococoNodle",
          paraId: 2026,
          text: "Nodle",
          providers: {
            OnFinality: "wss://nodle-paradis.api.onfinality.io/public-ws",
          },
        },
        {
          info: "chainoli",
          homepage: "https://www.my-oli.com/en/",
          paraId: 4023,
          text: "OLI",
          providers: {},
        },
        {
          info: "rococoOriginTrailParachain",
          homepage: "https://parachain.origintrail.io",
          paraId: 2043,
          text: "OriginTrail Testnet",
          providers: {
            TraceLabs: "wss://parachain-testnet-rpc.origin-trail.network/",
          },
        },
        {
          info: "rococoPangolin",
          paraId: 2105,
          text: "Pangolin",
          providers: {
            "Darwinia Network": "wss://pangolin-parachain-rpc.darwinia.network",
          },
        },
        {
          info: "rococoKilt",
          paraId: 2086,
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
          info: "rocfinity",
          paraId: 2021,
          text: "Rocfinity",
          providers: {
            Efinity: "wss://rpc.rococo.efinity.io",
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
          info: "rococoSora",
          paraId: 2011,
          text: "SORA",
          providers: {
            Soramitsu:
              "wss://ws.parachain-collator-1.c1.stg1.sora2.soramitsu.co.jp",
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
          info: "stagex",
          homepage: "https://totemaccounting.com/",
          paraId: 2007,
          text: "Stagex",
          providers: {
            Totem: "wss://s-ui.kapex.network",
          },
        },
        {
          info: "rococoSubzero",
          paraId: 4040,
          text: "Subzero",
          providers: {
            ZERO: "wss://staging.para.sub.zero.io",
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
          info: "rococoTinkernet",
          paraId: 2125,
          text: "Tinkernet",
          providers: {
            // 'InvArch Team': 'wss://rococo.invarch.network' // https://github.com/polkadot-js/apps/issues/8266
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
          info: "rococoUnitNetwork",
          paraId: 4168,
          text: "Unit Network",
          providers: {
            UnitNetwork: "wss://www.unitnode3.info:443",
          },
        },
        {
          info: "rococoVirto",
          paraId: 3003,
          text: "Virto",
          providers: {
            // VirtoNetwork: 'wss://rococo.virtonetwork.xyz' // https://github.com/polkadot-js/apps/issues/8024
          },
        },
        {
          info: "rococoWatr",
          paraId: 2058,
          text: "Watr Network",
          providers: {
            Watr: "wss://rpc.dev.watr.org",
          },
        },
        {
          info: "rococoZeitgeist",
          paraId: 2101,
          text: "Zeitgeist Battery Station",
          providers: {
            Zeitgeist: "wss://roc.zeitgeist.pm",
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
        {
          info: "rococoBridgehub",
          paraId: 1013,
          text: "Bridgehub",
          providers: {
            Parity: "wss://rococo-bridge-hub-rpc.polkadot.io",
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
        },
        {
          info: "rocstar",
          paraId: 2006,
          text: "RocStar",
          providers: {
            Astar: "wss://rocstar.astar.network",
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
