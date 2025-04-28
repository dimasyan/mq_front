<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useWebAppTheme } from 'vue-tg'

const applyDarkMode = () => {
  const prefersDark = useWebAppTheme().colorScheme.value === 'dark'
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
