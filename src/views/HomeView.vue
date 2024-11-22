<script lang="ts" setup>
import { useWebApp } from 'vue-tg'
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
const timer = ref(45) // Starting timer with 45 seconds
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
  timer.value = 45
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
  timer.value = 45 // Reset timer to 45 seconds for each question
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
      attempts.value = 0 // Reset attempts

      await nextTick()
      focusInput()
    } else {
      console.error('Audio element not found')
    }
  }
})

const isError = ref(false)
const selectedAnswer = ref<string>('')
const isAnswered = ref(false)
const isProcessingAnswer = ref(false)
const isHintVisible = ref(false)
const answerMessage = ref('')
const pointsEarned = ref<number>(0)
const attempts = ref<number>(0) // Counter for number of tries

const focusInput = () => {
  if (inputRef.value) {
    inputRef.value.focus()
  }
}

const normalizeString = (str: string) => {
  return str
    .toLowerCase() // Convert to lowercase
    .normalize('NFD') // Normalize to decompose special characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+and\s+/g, ' ') // Replace "and" with a single space
    .replace(/\s+/g, ' ') // Normalize multiple spaces to a single space
    .trim();
}
const isCorrectAnswer = (submitted: string, correct: string) => {
  const normalizedSubmitted = normalizeString(submitted);
  const normalizedCorrect = normalizeString(correct);

  const similarity = stringSimilarity.compareTwoStrings(
    normalizedSubmitted,
    normalizedCorrect
  );
  return similarity >= 0.7 || submitted.toLowerCase() === correct.toLowerCase()
}

const calculatePoints = () => {
  let basePoints = 0
  const divider = isHintVisible.value ? 2 : 1
  if (timer.value >= 35) basePoints = 100 // Answered within 10 seconds
  else if (timer.value >= 20) basePoints = 70 // Answered within 25 seconds
  else if (timer.value >= 10) basePoints = 40 // Answered within 35 seconds
  else basePoints = 20 // Answered in the last 10 seconds

  // Deduct points for multiple attempts (e.g., 2nd try 80%, 3rd try 50%)
  const attemptMultiplier = attempts.value === 1 ? 1 : (attempts.value === 2 ? 0.8 : 0.5)
  return Math.floor(basePoints * attemptMultiplier / divider)
}

const submitAnswer = () => {
  if (!isAnswered.value && !isProcessingAnswer.value) {
    isProcessingAnswer.value = true
    attempts.value++ // Increment attempts
    const correctAnswer = game.value.GameQuestions[activeIndex.value].Question.correct_answer

    if (isCorrectAnswer(selectedAnswer.value, correctAnswer)) {
      const points = calculatePoints()
      pointsEarned.value = points
      gameScore.value += points
      answerMessage.value = `Correct! You earned ${points} points!`
      isAnswered.value = true
      isError.value = false
      showCorrectAnswer(points)
    } else {
      isError.value = true
      answerMessage.value = 'Incorrect! Try again.'
      selectedAnswer.value = '' // Clear the input
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
      isHintVisible.value = false
      activeIndex.value += 1
      startTimer()
    } else {
      finishGame()
    }
  }, 3000)
}

const pass = () => {
  if (!isAnswered.value) {
    clearInterval(timerInterval)
    showCorrectAnswer(0) // Treat as a timeout with 0 points
  }
}
const showHint = () => {
  isHintVisible.value = true
}

const endGameMsg = computed(() => {
  const username = useWebApp().initDataUnsafe.user.username
  let rang = 'мешок'
  if (gameScore.value > 400 && gameScore.value <= 800) {
    rang = 'молодец'
  } else if (gameScore.value > 800) {
    rang = 'красавчик'
  }

  return `${username}, ты - ${rang} ))`
})
</script>

<template>
  <div class="home">
    <div v-if="!game && !isGameFinished">
      <h1 class="text-3xl">Welcome, {{ useWebApp().initDataUnsafe.user.username }}!</h1>
      <h4 class="text-xl mt-4">Press Start Game Button to play</h4>
    </div>

    <div v-if="isGameFinished">
      <h1>Game Finished!</h1>
      <h4>Your score: {{ gameScore }}</h4>
      <h4 class="mt-3">{{ endGameMsg }}</h4>
      <div class="mt-6">
        <img v-if="gameScore <= 400" class="block mx-auto" src="@/assets/loser.gif" alt="result" />
        <img v-else-if="gameScore > 400 && gameScore <= 800" class="block mx-auto" src="@/assets/tight.gif" alt="result" />
        <img v-if="gameScore > 800" class="block mx-auto" src="@/assets/cold.gif" alt="result" />
      </div>
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
          <p class="text-xl font-bold" :class="isError ? 'text-red-500' : 'text-green-500'">{{ answerMessage }}</p>
        </div>
        <div v-if="pointsEarned" class="game__points mt-2 text-green-600">
          You earned: {{ pointsEarned }} points!
        </div>
        <div v-if="isHintVisible" class="mt-2 italic text-lg">
          Song name: {{ game.GameQuestions[activeIndex].Question.text }}
        </div>
        <div class="game__audio flex justify-center mt-4">
          <audio v-show="game && game.GameQuestions[activeIndex]" ref="audioRef" controls />
        </div>
        <div class="game__input flex flex-col mt-4">
          <input
            v-model="selectedAnswer"
            ref="inputRef"
            placeholder="Enter your answer"
            class="input-text dark:text-black"
            @keydown.enter="submitAnswer"
            :disabled="isAnswered || isProcessingAnswer"
          />
          <button class="btn btn-blue w-4/6 mx-auto mt-6" @click="submitAnswer" :disabled="isAnswered || isProcessingAnswer">Submit</button>
          <button class="btn btn-warning w-4/6 mx-auto mt-4" @click="showHint" :disabled="isAnswered || isProcessingAnswer">Hint</button>
          <button class="btn btn-danger w-4/6 mx-auto mt-4" :disabled="isAnswered || isProcessingAnswer" @click="pass">Pass</button>
        </div>
      </div>
    </div>

    <button class="btn btn-success mt-16 mx-auto block" @click="handleMainBtn">{{ btnText }}</button>
  </div>
</template>


<style>
.home {
  margin: 0 auto;
  max-width: 720px;
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
