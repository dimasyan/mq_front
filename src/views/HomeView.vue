<script lang="ts" setup>
import { MainButton } from 'vue-tg'
import { computed, nextTick, ref, watch } from 'vue'
import axios from 'axios'
import stringSimilarity from 'string-similarity'
import { ClockIcon } from '@heroicons/vue/24/solid'

const game = ref(null)
const audioRef = ref<HTMLAudioElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const gameScore = ref(0)
const activeIndex = ref(-1)
const isGameFinished = ref(false)
const timer = ref(20)
let timerInterval: any = null

const btnText = computed(() => {
  if (isGameFinished.value) return 'Try New Game'
  else if (game.value) return 'Finish Game'
  return 'Start Game'
})

const resetGame = () => {
  game.value = null
  gameScore.value = 0
  activeIndex.value = -1
  isGameFinished.value = false
  timer.value = 20
  clearInterval(timerInterval)
}

const handleMainBtn = () => {
  if (isGameFinished.value) {
    resetGame()
  } else if (game.value) {
    finishGame()
  } else {
    createGame()
  }
}

const createGame = async () => {
  try {
    const response = await axios.post('/api/newgame')
    game.value = response.data.game
    activeIndex.value = 0
    gameScore.value = 0
    startTimer()
    focusInput()
  } catch (error) {
    console.error('Error creating game:', error)
  }
}

const finishGame = async () => {
  try {
    const response = await axios.post('/api/endgame', {
      score: gameScore.value,
      gameId: game.value.id
    }, {
      headers: { 'Content-Type': 'application/json' }
    })
    console.log('Game finished:', response.data)
    isGameFinished.value = true
    clearInterval(timerInterval)
  } catch (error) {
    console.error('Error finishing game:', error)
  }
}

const startTimer = () => {
  timer.value = 20
  clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    if (timer.value > 0) {
      timer.value--
    } else {
      handleTimeout()
    }
  }, 1000)
}

const handleTimeout = () => {
  if (!isAnswered.value) {
    showCorrectAnswer(0) // No points for timeout
  }
}

watch(activeIndex, async (newIndex) => {
  if (isGameFinished.value) return

  if (game.value && newIndex >= 0 && game.value.GameQuestions[newIndex]) {
    await nextTick()
    const currentAudio = audioRef.value
    if (currentAudio) {
      currentAudio.src = game.value.GameQuestions[newIndex].Question.file_path
      currentAudio.load()
      currentAudio.play()
      selectedAnswer.value = ''
      isAnswered.value = false
      isProcessingAnswer.value = false
      answerMessage.value = ''
      pointsEarned.value = 0 // Reset points display

      await nextTick()
      focusInput()
    } else {
      console.error('Audio element not found')
    }
  }
})

const selectedAnswer = ref<string>('')
const isAnswered = ref(false)
const isProcessingAnswer = ref(false)
const answerMessage = ref('')
const pointsEarned = ref<number>(0) // New ref to track points earned

const focusInput = () => {
  if (inputRef.value) {
    inputRef.value.focus()
  }
}

const isCorrectAnswer = (submitted: string, correct: string) => {
  const similarity = stringSimilarity.compareTwoStrings(
    submitted.toLowerCase(),
    correct.toLowerCase()
  )
  return similarity >= 0.7 || submitted.toLowerCase() === correct.toLowerCase()
}

const calculatePoints = () => {
  if (timer.value >= 17) return 100 // Answered within 3 seconds
  else if (timer.value >= 10) return 70 // Answered within 10 seconds
  else if (timer.value >= 5) return 40 // Answered within 5 seconds
  return 20 // Answered in the final moments
}

const submitAnswer = () => {
  if (!isAnswered.value && !isProcessingAnswer.value) {
    isProcessingAnswer.value = true
    const correctAnswer = game.value.GameQuestions[activeIndex.value].Question.correct_answer

    if (isCorrectAnswer(selectedAnswer.value, correctAnswer)) {
      const points = calculatePoints()
      pointsEarned.value = points
      gameScore.value += points
      answerMessage.value = `Correct! You earned ${points} points!`
      isAnswered.value = true
      showCorrectAnswer(points)
    } else {
      answerMessage.value = 'Incorrect! Try again.'
      isProcessingAnswer.value = false
    }
  }
}

const showCorrectAnswer = (points: number) => {
  isAnswered.value = true
  answerMessage.value += ` The correct answer was: ${game.value.GameQuestions[activeIndex.value].Question.correct_answer}.`
  if (points === 0) {
    answerMessage.value += ' You earned 0 points.'
  }

  setTimeout(() => {
    if (activeIndex.value < game.value.GameQuestions.length - 1) {
      activeIndex.value += 1
      startTimer()
    } else {
      finishGame()
    }
  }, 3000)
}
</script>

<template>
  <div class="home">
    <div v-if="!game && !isGameFinished">
      <h1>Welcome!</h1>
      <h4>Press Start Game Button to play</h4>
    </div>

    <div v-if="isGameFinished">
      <h1>Game Finished!</h1>
      <h4>Your score: {{ gameScore }}</h4>
    </div>

    <div v-if="game && !isGameFinished">
      <div class="game text-center">
        <div class="game__timer text-xl flex justify-center items-center gap-2">
          <ClockIcon class="size-6" /> {{ timer }} sec
        </div>
        <div class="game__question mt-6">
          {{ activeIndex + 1 }}. Кто исполняет песню?
        </div>
        <div class="game__answer mt-6">
          <p>{{ answerMessage }}</p>
        </div>
        <div v-if="pointsEarned" class="game__points mt-2 text-green-600">
          You earned: {{ pointsEarned }} points!
        </div>
        <div class="game__audio flex justify-center mt-4">
          <audio v-show="game && game.GameQuestions[activeIndex]" ref="audioRef" controls />
        </div>
        <div class="game__input flex flex-col mt-4">
          <input v-model="selectedAnswer" ref="inputRef" placeholder="Enter your answer" class="input-text" @keydown.enter="submitAnswer" :disabled="isAnswered || isProcessingAnswer" />
          <button class="btn btn-blue w-4/6 mx-auto mt-4" @click="submitAnswer" :disabled="isAnswered || isProcessingAnswer">Submit</button>
        </div>
      </div>
    </div>

    <button class="btn btn-success mt-16 mx-auto block" @click="handleMainBtn">{{ btnText }}</button>
    <MainButton :text="btnText" @click="handleMainBtn" />
  </div>
</template>


<style>
.home {
  h1, h4 {
    text-align: center;
  }
  .game {
    display: flex;
    flex-direction: column;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
    justify-content: center;
    text-align: center;
    &__timer {
      font-size: 36px;
      text-align: center;
    }
    &__question {
      margin-top: 16px;
      font-size: 24px;
      text-align: center;
    }
    &__input {
      margin-top: 16px;
      display: flex;
      justify-content: center;
    }
    &__audio {
      margin-top: 16px;
      display: flex;
      justify-content: center;
    }
    &__answer {
      margin-top: 12px;
      font-size: 18px;
      color: #333;
    }
  }
  .input-text {
    border: 1px solid black;
    padding: 12px;
    border-radius: 6px;
  }
}
</style>
