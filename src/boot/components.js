import { boot } from "quasar/wrappers";
import VNetworkGraph from "v-network-graph";

import "v-network-graph/style.css";

export default boot(({ app }) => {
  app.use(VNetworkGraph);
});
