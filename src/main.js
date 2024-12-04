import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Particles from "@tsparticles/vue3";
import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.

import { createWebHistory, createRouter } from 'vue-router'

import MainPage from './pages/Main.vue'
import BlogPage from './pages/Blog.vue'

const routes = [
  { path: '/', component: MainPage },
  { path: '/blog', component: BlogPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

app = createApp(App);

app.use(router);
app.use(Particles, {
    init: async engine => {
      // await loadFull(engine); // you can load the full tsParticles library from "tsparticles" if you need it
      await loadSlim(engine); // or you can load the slim version from "@tsparticles/slim" if don't need Shapes or Animations
    },
  });
app.mount('#app')
