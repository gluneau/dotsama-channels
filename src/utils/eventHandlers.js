export function setupEventHandlers(nodes) {
  return {
    "node:click": ({ node }) => {
      nodes[node].active = !nodes[node].active;
    },
    "node:pointerover": ({ node }) => {
      console.log(`Pointer over node: ${node}`);
    },
    "node:pointerout": ({ node }) => {
      console.log(`Pointer out of node: ${node}`);
    },
  };
}
