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
    path: "/did",
    // component: () => import("layouts/MainLayout.vue"),
    // children: [{ path: "",
    component: () => import("pages/Did.vue"),
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
