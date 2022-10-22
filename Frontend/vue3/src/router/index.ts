// @ts-nocheck
import { createRouter, createWebHashHistory } from "vue-router";
import LayoutEngine from "../layout/LayoutEngine.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/:catchAll(.*)",
      name: "Layout Engine",
      component: LayoutEngine,
    },
  ],
});

export default router;
