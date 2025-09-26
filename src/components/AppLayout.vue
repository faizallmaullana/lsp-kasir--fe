<template>
  <div class="app-layout">
    <Navbar />
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<script setup>
import Navbar from './Navbar.vue'
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  background: #f8fafc;
}

.main-content {
  min-height: calc(100vh - 64px);
}
</style>
