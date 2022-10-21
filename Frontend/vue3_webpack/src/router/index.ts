// @ts-nocheck
import { createRouter, createWebHistory } from "vue-router";
import LayoutEngine from "../layout/LayoutEngine.vue";
import config from "../services/config.service";

const routes = [
  {
    path: "/:catchAll(.*)",
    name: "Layout Engine",
    component: LayoutEngine,
  },
];

export default router = createRouter({
  history: createWebHistory(config.get("url")),
  routes: [],
});
