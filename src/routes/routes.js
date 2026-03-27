import { createRouter, createWebHashHistory } from 'vue-router'
import aportes_linea from "../views/aportes_linea.vue"
import SOI from "../views/SOI.vue"
import asopagos from "../views/asopagos.vue"
import compensar from "../views/compensar.vue"
import Contratista from '../views/contratista.vue'
import Login from '../views/login.vue'
import { useAuthStore } from '../stores/auth'

const routes = [
    { path: "/login", component: Login, name: 'login' },
    { path: "/", component: aportes_linea, meta: { requiresAuth: true } },
    { path: "/asopagos", component: asopagos, meta: { requiresAuth: true } },
    { path: "/SOI", component: SOI, meta: { requiresAuth: true } },
    { path: "/compensar", component: compensar, meta: { requiresAuth: true } },
    { path: "/contratista", component: Contratista, meta: { requiresAuth: true } },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
  } else {
    next()
  }
})
