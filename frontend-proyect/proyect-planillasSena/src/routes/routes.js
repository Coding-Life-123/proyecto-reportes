import { createRouter, createWebHashHistory } from 'vue-router' // Añadido createRouter
import aportes_linea from "../views/aportes_linea.vue"
import SOI from "../views/SOI.vue"
import asopagos from "../views/asopagos.vue"
import compensar from "../views/compensar.vue"
import Contratista from '../views/contratista.vue'

const routes = [
    { path: "/", component: aportes_linea }, // 'component' en minúscula
    { path: "/asopagos", component: asopagos },
    { path: "/SOI", component: SOI },
    { path: "/compensar", component: compensar },
    { path: "/contratista", component: Contratista },
]

// Añadimos 'export' para que main.js lo pueda usar
export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
