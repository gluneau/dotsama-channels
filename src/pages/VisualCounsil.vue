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
        <q-toolbar-title> Visual Counsil </q-toolbar-title>
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
      <q-page class="flex flex-center"> </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import Rete from "rete";
import ConnectionPlugin from "rete-connection-plugin";
import VueRenderPlugin from "rete-vue-render-plugin";
import { defineComponent } from "vue";

export default defineComponent({
  name: "VisualCounsil",
  components: {},
  data() {
    return {
      layouts: {},
      configs: {},
    };
  },
  computed: {},
  watch: {},
  async mounted() {
    var editor = new Rete.NodeEditor("demo@0.1.0", container);
    editor.use(ConnectionPlugin);
    editor.use(VueRenderPlugin);
    editor.use(ContextMenuPlugin);
    editor.use(AreaPlugin);
    editor.use(CommentPlugin);

    var engine = new Rete.Engine("demo@0.1.0");

    components.map((c) => {
      editor.register(c);
      engine.register(c);
    });

    var n1 = await components[0].createNode({ num: 2 });
    var n2 = await components[0].createNode({ num: 0 });
    var add = await components[1].createNode();

    n1.position = [80, 200];
    n2.position = [80, 400];
    add.position = [500, 240];

    editor.addNode(n1);
    editor.addNode(n2);
    editor.addNode(add);

    editor.connect(n1.outputs.get("num"), add.inputs.get("num1"));
    editor.connect(n2.outputs.get("num"), add.inputs.get("num2"));

    editor.on(
      "process nodecreated noderemoved connectioncreated connectionremoved",
      async () => {
        console.log("process");
        await engine.abort();
        await engine.process(editor.toJSON());
      }
    );

    editor.view.resize();
    AreaPlugin.zoomAt(editor);
    editor.trigger("process");
  },
  methods: {},
});
</script>
