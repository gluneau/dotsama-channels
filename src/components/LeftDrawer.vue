<template>
  <q-drawer v-model="isOpen" overlay side="left" bordered class="">
    <div class="row text-h5 justify-center">HRMP Channel List</div>
    <q-list dense bordered>
      <q-item v-for="item in items" :key="item.label">
        <q-item-section
          :class="item.type === 'request' ? `text-red` : `text-grey-8`"
        >
          <div class="row items-center">
            <div class="col column reverse">
              <q-btn
                :color="item.type === 'request' ? `negative` : `primary`"
                :label="item.nameSender"
                size="sm"
                push
                @click="$emit('getCurrencies', chain, item.sender)"
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
                @click="$emit('getCurrencies', chain, item.recipient)"
              />
            </div>
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script>
import { computed } from "vue";

export default {
  name: "LeftDrawer",
  props: {
    modelValue: Boolean,
    items: Array,
    chain: String,
  },
  emits: ["update:modelValue", "getCurrencies"],
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
