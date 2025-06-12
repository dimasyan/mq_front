<script lang="ts" setup>
import { onMounted, type Ref, ref } from 'vue'
import axios from 'axios'
import GameMain from '@/components/game/GameMain.vue'
import type { CreateGamePayload, FinishGamePayload, Game } from '@/models/game'
import { useWebApp } from 'vue-tg'

const game: Ref<Game|null> = ref(null)
const isDev = ref<boolean>(import.meta.env.VITE_NODE_ENV === 'dev')
const isSubscribed = ref<boolean | null>(null)

const createGame = async () => {
  try {
    const payload: CreateGamePayload = {
      tg_username: isDev.value ? 'developer' : useWebApp().initDataUnsafe.user.username,
      tg_id: isDev.value ? 1 : useWebApp().initDataUnsafe.user.id,
    }
    const response = await axios.post('/api/newmoviegame', payload)
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
    game.value = null
    console.log('Game finished:', response.data)
  } catch (error) {
    console.error('Error finishing game:', error)
  }
}

const resetGame = () => {
  game.value = null
}

const checkSubscription = async () => {
  try {
    const payload = {
      telegramUser: isDev.value ? null : { id: useWebApp().initDataUnsafe.user.id },
    }
    const response = await axios.post('/api/auth/movie', payload, {
      validateStatus: () => true, // <- allow all responses through to `then`
    })

    if (response.status === 200 && response.data?.success === true) {
      isSubscribed.value = true
      // await createGame()
    } else {
      // Either not subscribed or backend rejected
      isSubscribed.value = false
    }
  } catch (error) {
    console.error('Subscription check failed:', error)
    isSubscribed.value = false
  }
}

onMounted(async () => {
  await checkSubscription()
})

const joinChannelUrl = 'https://t.me/dimash_bratan_channel';

const openTelegramChannel = () => {
  if (window.Telegram?.WebApp?.openTelegramLink) {
    window.Telegram.WebApp.openTelegramLink(joinChannelUrl);
  } else {
    window.open(joinChannelUrl, '_blank');
  }
}
</script>

<template>
  <div class="home">
    <div v-if="isSubscribed === null" class="loading-state">
      <p>Checking subscription status...</p>
    </div>

    <!-- User is NOT subscribed -->
    <div v-else-if="isSubscribed === false" class="subscription-warning p-5 block">
      <p class="text-center">To play the game, please join our Telegram channel:</p>
      <button @click="openTelegramChannel" class="btn btn-blue w-4/6 mx-auto mt-4">
        Join Channel in Telegram
      </button>
      <button @click="checkSubscription" class="btn btn-success w-4/6 mx-auto mt-2">
        I've Joined — Check Again
      </button>
    </div>

    <div v-else>
      <game-main
        :game="game"
        :is-dev="false"
        type="movie"
        @create-game="createGame"
        @finish-game="finishGame"
        @reset-game="resetGame"
      />
    </div>
  </div>
</template>


<style scoped lang="scss">
.home {
  margin: 0 auto;
  max-width: 720px;
}
</style>
