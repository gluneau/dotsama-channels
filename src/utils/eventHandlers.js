export function setupEventHandlers(nodes, updateNodeOver) {
  return {
    "node:click": ({ node }) => {
      nodes[node].active = !nodes[node].active;
    },
    "node:pointerover": ({ node }) => {
      updateNodeOver(node);
    },
    "node:pointerout": () => {
      updateNodeOver(null);
    },
  };
}
