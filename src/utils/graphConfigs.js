import { ForceLayout } from "v-network-graph/lib/force-layout";
import * as vNG from "v-network-graph";

export function setupConfigs(mode, isDarkActive, nodeOver) {
  return vNG.defineConfigs({
    view: {
      layoutHandler: new ForceLayout({
        positionFixedByDrag: false,
        positionFixedByClickWithAltKey: true,
      }),
    },
    node: {
      normal: {},
      label: {
        color: isDarkActive ? "#ffffff" : "#000000",
        visible: true,
        fontSize: 40,
        margin: 20,
        padding: 20,
      },
    },
    edge: {
      selectable: false,
      normal: {
        width: (n) =>
          n.sender !== nodeOver && n.recipient !== nodeOver ? 1 : 3,
        color: (n) =>
          n.type === "request"
            ? "#e6007a"
            : isDarkActive
            ? "#40E0D0"
            : "#0000ff",
        dasharray: (n) =>
          (n.type === "request" &&
            n.sender !== nodeOver &&
            n.recipient !== nodeOver) ||
          (n.type !== "request" && n.sender === nodeOver) ||
          (n.type !== "request" && n.recipient === nodeOver)
            ? "10"
            : "0",
        linecap: "butt",
        animate: (n) =>
          (n.sender === nodeOver || n.recipient === nodeOver) &&
          n.type !== "request",
        animationSpeed: 50,
      },
      hover: {
        width: 4,
        color: (n) =>
          n.type === "request"
            ? "#e6007a"
            : isDarkActive
            ? "#40E0D0"
            : "#0000ff",
        dasharray: "0",
        linecap: "butt",
        animate: false,
        animationSpeed: 50,
      },
      selected: {
        width: 3,
        color: "#dd8800",
        dasharray: "6",
        linecap: "round",
        animate: false,
        animationSpeed: 50,
      },
      gap: 5,
      type: "straight",
      margin: 15,
      marker: {
        source: {
          type: "none",
          width: 5,
          height: 5,
          margin: 0,
          units: "strokeWidth",
          color: null,
        },
        target: {
          type: "arrow",
          width: 10,
          height: 5,
          margin: 0,
          units: "strokeWidth",
          color: null,
        },
      },
    },
  });
}
