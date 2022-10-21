import { createRouter, createWebHistory } from "vue-router";
import LayoutEngine from "../layout/LayoutEngine.vue";
import config from "../services/config.service";

const router = createRouter({
  history: createWebHistory(config.get("url")),
  routes: [
    {
      path: "/:catchAll(.*)",
      name: "Layout Engine",
      component: LayoutEngine,
    },
  ],
});

export default router;
