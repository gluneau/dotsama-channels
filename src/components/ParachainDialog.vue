<template>
  <q-dialog v-model="isOpen">
    <q-card>
      <q-toolbar>
        <q-avatar>
          <img :src="para.ui.logo || image(chain, para.paraId)" />
          <q-tooltip>{{ Object.values(para.providers)[0] }}</q-tooltip>
        </q-avatar>

        <q-toolbar-title>
          <span class="text-weight-bold text-capitalize">{{ para.info }}</span>
          Registered Assets
        </q-toolbar-title>

        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>

      <q-card-section>
        <q-list v-if="!currentAssets.length" bordered>
          <q-item v-for="n in 5" :key="n">
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
            v-for="asset in currentAssets"
            :key="asset.symbol"
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
              <q-item-label caption lines="1">{{ asset.symbol }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn dense round icon="mdi-decimal" class="q-ml-md">
                <q-badge color="red" floating>{{ asset.decimals }}</q-badge>
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { computed } from "vue";

export default {
  name: "ParachainDialog",
  props: {
    modelValue: Boolean,
    para: Object,
    assets: Array,
    chain: String,
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const isOpen = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    const currentAssets = computed(
      () =>
        props.assets.find(
          (a) => a.paraId === props.para.paraId && a.chain === props.chain
        )?.asset || []
    );

    const image = (chain, paraId) => {
      // Implement image logic here
      return `https://example.com/image/${chain}/${paraId}.png`;
    };

    return {
      isOpen,
      currentAssets,
      image,
    };
  },
};
</script>
