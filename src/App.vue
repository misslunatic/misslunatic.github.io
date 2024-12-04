<script setup>
import { main } from "@popperjs/core";
import MainPage from "./pages/Main.vue"
import backgroundCalm from "./components/BackgroundCalm.vue";
import Navbar from "./components/Navbar.vue"
</script>

<template>
  <main>
    <Navbar />
    <RouterView />
    <background-calm />
  </main>
</template>