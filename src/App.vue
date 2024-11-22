<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'

const applyDarkMode = () => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const html = document.documentElement;

  if (prefersDark) {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
}

onMounted(() => {
  applyDarkMode()
})
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
