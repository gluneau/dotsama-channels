<template>
  <q-header elevated style="background-color: #e6007a">
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="$emit('toggleLeftDrawer')"
      />
      <div class="q-ml-md">
        <q-select
          v-model="selectedChain"
          :options="chainOptions"
          label="Chain"
          dense
          dark
          @update:model-value="$emit('updateChain', $event)"
        />
      </div>
      <q-toolbar-title> Channels </q-toolbar-title>
      <div>
        <q-toggle
          v-model="localMode"
          checked-icon="dark_mode"
          color="#40E0D0"
          unchecked-icon="light_mode"
          @update:model-value="$emit('updateMode', $event)"
        />
        About
        <q-btn
          flat
          @click="$emit('toggleRightDrawer')"
          round
          dense
          icon="help"
        />
        v{{ version }}
      </div>
    </q-toolbar>
  </q-header>
</template>

<script>
import { ref, watch } from "vue";
import { version } from "../../package.json";

export default {
  name: "AppHeader",
  props: {
    chain: Object,
    chainOptions: Array,
    mode: Boolean,
  },
  emits: ["toggleLeftDrawer", "toggleRightDrawer", "updateChain", "updateMode"],
  setup(props) {
    const selectedChain = ref(props.chain);
    const localMode = ref(props.mode);

    watch(
      () => props.chain,
      (newChain) => {
        selectedChain.value = newChain;
      }
    );

    watch(
      () => props.mode,
      (newMode) => {
        localMode.value = newMode;
      }
    );

    return {
      selectedChain,
      localMode,
      version,
    };
  },
};
</script>
