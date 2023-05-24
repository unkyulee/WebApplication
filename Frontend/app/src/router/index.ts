// @ts-nocheck
import { createRouter, createWebHashHistory } from "vue-router";
import Content from "../layout/Content.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/:catchAll(.*)",
      name: "Content",
      component: Content,
    },
  ],
});

export default router;
