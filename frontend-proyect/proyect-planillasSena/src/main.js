// import { createApp } from 'vue'
// import './style.css'
// import App from './App.vue'

// createApp(App).mount('#app')
// FILE: main.js

// FILE: main.js

import { createApp } from 'vue'
import { Quasar } from 'quasar'
import { createPinia } from 'pinia'
import { router } from "./routes/routes.js"
import 'quasar/dist/quasar.css'

import App from './App.vue'

const myApp = createApp(App)
const pinia = createPinia()

// Usar plugins
myApp.use(pinia)
myApp.use(router)
myApp.use(Quasar)

// Montar la aplicación
myApp.mount('#app')