const routes = [
  {
    path: "/",
    // component: () => import("layouts/MainLayout.vue"),
    // children: [{ path: "",
    component: () => import("pages/Index.vue"),
    // }],
  },
  {
    path: "/:chain",
    component: () => import("pages/Index.vue"),
  },
  {
    path: "/:chain/:para",
    component: () => import("pages/Index.vue"),
  },
  {
    path: "/:chain/:para/:action",
    component: () => import("pages/Index.vue"),
  },
  {
    path: "/did",
    // component: () => import("layouts/MainLayout.vue"),
    // children: [{ path: "",
    component: () => import("pages/Did.vue"),
    // }],
  },
  {
    path: "/xtoken",
    // component: () => import("layouts/MainLayout.vue"),
    // children: [{ path: "",
    component: () => import("pages/XToken.vue"),
    // }],
  },
  {
    path: "/vcounsil",
    // component: () => import("layouts/MainLayout.vue"),
    // children: [{ path: "",
    component: () => import("pages/VisualCounsil.vue"),
    // }],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
