<template>
  <q-drawer
    ref="right"
    side="right"
    v-model="isOpen"
    bordered
    overlay
    :width="600"
    class=""
  >
    <timeline />
  </q-drawer>
</template>

<script>
import { computed } from "vue";
import Timeline from "./Timeline.vue";

export default {
  name: "RightDrawer",
  components: {
    Timeline,
  },
  props: {
    modelValue: Boolean,
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const isOpen = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    return {
      isOpen,
    };
  },
};
</script>
