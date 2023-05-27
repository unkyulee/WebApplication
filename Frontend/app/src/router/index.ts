// @ts-nocheck
import { createRouter, createWebHistory } from "vue-router";
import Content from "../layout/Content.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/:catchAll(.*)",
      name: "Content",
      component: Content,
    },
  ],
});

export default router;
