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
        :xlink:href="image(nodes[nodeId].number)"
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
    nodes: Object,
    edges: Object,
    configs: Object,
    zoomLevel: Number,
    layers: Object,
    eventHandlers: Object,
  },
  methods: {
    image(number) {
      // Implement the image logic here
      return `https://example.com/image/${number}.png`;
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
