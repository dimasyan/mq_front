<script setup lang="ts">
interface IProps {
  endGameMsg: string
  gameScore: number
}
defineProps<IProps>()
</script>

<template>
<div>
  <h1>Game Finished!</h1>
  <h4>Your score: {{ gameScore }}</h4>
  <h4 class="mt-3">{{ endGameMsg }}</h4>
  <div class="mt-6">
    <img v-if="gameScore <= 400" class="block mx-auto" src="@/assets/hans.gif" alt="result" />
    <img v-else-if="gameScore > 400 && gameScore <= 600" class="block mx-auto" src="@/assets/dolj.gif" alt="result" />
    <img v-else-if="gameScore > 600 && gameScore <= 750" class="block mx-auto" src="@/assets/tight.gif" alt="result" />
    <img v-else-if="gameScore > 750 && gameScore < 900" class="block mx-auto" src="@/assets/cold.gif" alt="result" />
    <img v-else-if="gameScore >= 900" class="block mx-auto" src="@/assets/michael.gif" alt="result" />
  </div>
</div>
</template>

<style scoped>

</style>
