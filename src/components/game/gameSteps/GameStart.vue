<script lang="ts" setup>
interface IProps {
  username: string
}
defineProps<IProps>()
</script>

<template>
  <div class="game-start">
    <h1 class="text-3xl">Welcome, {{ username }}!</h1>
    <h4 class="text-xl mt-4">Press Start Game Button to play</h4>
  </div>
</template>

<style scoped>

</style>
