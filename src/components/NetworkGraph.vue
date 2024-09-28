<template>
  <v-network-graph
    :nodes="nodes"
    :edges="edges"
    :configs="configs"
    :zoom-level="zoomLevel"
    :layers="layers"
    :event-handlers="eventHandlers"
  >
    <defs>
      <clipPath id="faceCircle" clipPathUnits="objectBoundingBox">
        <circle cx="0.5" cy="0.5" r="0.5" />
      </clipPath>
    </defs>

    <template #override-node="{ nodeId, scale, config, ...slotProps }">
      <circle
        class="face-circle"
        :r="config.radius * scale"
        fill="#ffffff"
        v-bind="slotProps"
      />
      <image
        class="face-picture"
        :x="-config.radius * scale * 2"
        :y="-config.radius * scale * 2"
        :width="config.radius * scale * 4"
        :height="config.radius * scale * 4"
        :xlink:href="getNodeImage(nodes[nodeId].number)"
        clip-path="url(#faceCircle)"
      />
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
</template>

<script>
export default {
  name: "NetworkGraph",
  props: {
    nodes: {
      type: Object,
      required: true,
    },
    edges: {
      type: Object,
      required: true,
    },
    configs: {
      type: Object,
      required: true,
    },
    zoomLevel: {
      type: Number,
      default: 1,
    },
    layers: {
      type: Object,
      default: () => ({}),
    },
    eventHandlers: {
      type: Object,
      default: () => ({}),
    },
    chain: {
      type: String,
      required: true,
    },
    endpoints: {
      type: Array,
      required: true,
    },
  },
  methods: {
    getNodeImage(paraId) {
      const endpoint = this.endpoints.find((e) => e.paraId === paraId);
      if (endpoint && endpoint.ui && endpoint.ui.logo) {
        return endpoint.ui.logo;
      }
      return `https://cdn.pixabay.com/photo/2015/08/27/10/14/icon-909830_1280.png`;
    },
  },
};
</script>

<style scoped>
.face-circle,
.face-picture {
  transition: all 0.1s linear;
}

.face-picture {
  pointer-events: none;
}
</style>
