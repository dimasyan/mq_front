<script lang="ts" setup>
import { type Ref, ref } from 'vue'
import GameMain from '@/components/game/GameMain.vue'
import { useWebApp } from 'vue-tg'
import axios from 'axios'
import type { CreateGamePayload, FinishGamePayload, Game } from '@/models/game'

const game: Ref<Game|null> = ref(null)
const isDev = ref<boolean>(import.meta.env.VITE_NODE_ENV === 'dev')

const createGame = async () => {
  try {
    const payload: CreateGamePayload = {
      tg_username: isDev.value ? 'developer' : useWebApp().initDataUnsafe.user.username,
      tg_id: isDev.value ? 1 : useWebApp().initDataUnsafe.user.id,
    }
    const response = await axios.post('/api/newgame', payload)
    game.value = response.data.game
  } catch (error) {
    console.error('Error creating game:', error)
  }
}
const finishGame = async (score: number) => {
  if (!game.value) return
  try {
    const payload: FinishGamePayload = {
      score,
      gameId: game.value.id
    }
    const response = await axios.post('/api/endgame', payload)
    console.log('Game finished:', response.data)
    game.value = null
  } catch (error) {
    console.error('Error finishing game:', error)
  }
}

const resetGame = () => {
  game.value = null
}
</script>

<template>
  <div class="music">
    <game-main
      :game="game"
      :is-dev="isDev"
      type="music"
      @create-game="createGame"
      @finish-game="finishGame"
      @reset-game="resetGame"
    />
  </div>
</template>


<style>
.music {
  margin: 0 auto;
  max-width: 720px;
  h1, h4 {
    text-align: center;
  }
}
</style>
