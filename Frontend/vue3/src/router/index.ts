import { createRouter, createWebHistory } from 'vue-router'
import LayoutEngine from '../layout/LayoutEngine.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:catchAll(.*)',
      name: 'Layout Engine',
      component: LayoutEngine
    }
  ]
})

export default router
