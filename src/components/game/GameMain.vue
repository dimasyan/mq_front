<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue'
import { normalizeString, transliterate } from '@/utils/helper'
import stringSimilarity from 'string-similarity'
import { useWebApp } from 'vue-tg'
import { ClockIcon } from '@heroicons/vue/24/solid'
import GameStart from '@/components/game/gameSteps/GameStart.vue'
import GameResults from '@/components/game/gameSteps/GameResults.vue'
import type { Game } from '@/models/game'
interface IProps {
  game: null | Game
  isDev: boolean
  type: 'music' | 'movie'
}
const props = defineProps<IProps>()
const emit = defineEmits(['createGame', 'resetGame', 'finishGame'])

const audioRef = ref<HTMLAudioElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const gameScore = ref<number>(0)
const activeIndex = ref<number>(-1)
const isGameFinished = ref<boolean>(false)
const timer = ref<number>(45) // Starting timer with 45 seconds
let timerInterval: number|undefined
const isError = ref<boolean>(false)
const selectedAnswer = ref<string>('')
const isAnswered = ref<boolean>(false)
const isProcessingAnswer = ref<boolean>(false)
const isHintVisible = ref<boolean>(false)
const answerMessage = ref<string>('')
const pointsEarned = ref<number>(0)
const attempts = ref<number>(0)

const btnText = computed(() => {
  if (isGameFinished.value) return 'Try New Game'
  else if (props.game) return 'Finish Game'
  return 'Start Game'
})

const resetGame = () => {
  gameScore.value = 0
  activeIndex.value = -1
  isGameFinished.value = false
  timer.value = 45
  clearInterval(timerInterval)
}
const handleMainBtn = () => {
  if (isGameFinished.value) {
    resetGame()
  } else if (props.game) {
    finishGame()
  } else {
    createGame()
  }
}

const createGame = () => {
  emit('createGame')
}

const finishGame = () => {
  emit('finishGame', gameScore.value)
  isGameFinished.value = true
  clearInterval(timerInterval)
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

watch(
  () => props.game,
  (newVal, oldVal) => {
    if (!oldVal && !!newVal) {
      activeIndex.value = 0
      gameScore.value = 0
      startTimer()
      focusInput()
    }
  },
  { deep: true }
);

watch(activeIndex, async (newIndex) => {
  if (isGameFinished.value) return
  if (props.game && newIndex >= 0 && props.game.gameQuestions[newIndex]) {
    await nextTick()
    if (props.type === 'music') {
      await handleMusicQuestion(newIndex)
    } else {
      await handleMovieQuestion()
    }
  }
})

const handleMusicQuestion = async (newIndex: number) => {
  const currentAudio = audioRef.value
  if (currentAudio) {
    currentAudio.src = props.game?.gameQuestions[newIndex].musicQuestion?.file_path || ''
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
const handleMovieQuestion = async () => {
  selectedAnswer.value = ''
  isAnswered.value = false
  isProcessingAnswer.value = false
  answerMessage.value = ''
  pointsEarned.value = 0 // Reset points display
  attempts.value = 0 // Reset attempts

  await nextTick()
  focusInput()
}

const focusInput = () => {
  if (inputRef.value) {
    inputRef.value.focus()
  }
}

const isCorrectAnswer = (submitted: string, correct: string): boolean => {
  const normalizedSubmitted = normalizeString(submitted);
  const normalizedCorrect = normalizeString(correct);

  // Check transliterated reverse equivalence (e.g., Latin <-> Cyrillic)
  const reverseTransliteratedSubmitted = transliterate(normalizedSubmitted);
  const reverseTransliteratedCorrect = transliterate(normalizedCorrect);

  const similarity =
    stringSimilarity.compareTwoStrings(normalizedSubmitted, normalizedCorrect) ||
    stringSimilarity.compareTwoStrings(reverseTransliteratedSubmitted, normalizedCorrect) ||
    stringSimilarity.compareTwoStrings(normalizedSubmitted, reverseTransliteratedCorrect);

  return (
    similarity >= 0.7 ||
    normalizedSubmitted === normalizedCorrect ||
    reverseTransliteratedSubmitted === normalizedCorrect ||
    normalizedSubmitted === reverseTransliteratedCorrect
  )
}

const getMatchedArtistCount = (submitted: string, correct: string): number => {
  const correctParts = correct
    .split(';')
    .map(p => p.trim())
    .filter(Boolean)

  // If just one correct answer — fallback to old logic
  if (correctParts.length === 1) {
    return isCorrectAnswer(submitted, correctParts[0]) ? 1 : 0
  }

  // Normalize user input into possible guesses
  const submittedParts = normalizeString(submitted)
    .split(/[\s,;]+/)
    .filter(Boolean)

  let matchCount = 0
  const matched = new Set()

  for (const correctItem of correctParts) {
    for (const submittedItem of submittedParts) {
      if (
        isCorrectAnswer(submittedItem, correctItem) &&
        !matched.has(correctItem)
      ) {
        matchCount++
        matched.add(correctItem)
        break
      }
    }
  }

  return matchCount
}

const calculatePoints = (matchCount: number, totalCount: number): number => {
  const divider = isHintVisible.value ? 2 : 1

  let basePerArtist = 0
  if (timer.value >= 35) basePerArtist = 60
  else if (timer.value >= 20) basePerArtist = 40
  else if (timer.value >= 10) basePerArtist = 20
  else basePerArtist = 10

  const attemptMultiplier = attempts.value === 1 ? 1 : (attempts.value === 2 ? 0.8 : 0.5)

  const rawPoints = basePerArtist * matchCount
  return Math.floor(rawPoints * attemptMultiplier / divider)
}

const submitAnswer = () => {
  if (!isAnswered.value && !isProcessingAnswer.value) {
    isProcessingAnswer.value = true
    attempts.value++ // Increment attempts
    const correctAnswer = props.game?.gameQuestions[activeIndex.value].answer || ''
    const totalCorrectParts = correctAnswer.split(';').map(p => p.trim()).filter(Boolean)

    const matchCount = getMatchedArtistCount(selectedAnswer.value, correctAnswer)

    // If it's a single-answer question, use old behavior
    const isSingleAnswer = totalCorrectParts.length === 1

    if ((isSingleAnswer && matchCount === 1) || (!isSingleAnswer && matchCount > 0)) {
      const points = calculatePoints(matchCount, totalCorrectParts.length)
      pointsEarned.value = points
      gameScore.value += points
      answerMessage.value = `Correct! You earned ${points} points!`
      isAnswered.value = true
      isError.value = false
      showCorrectAnswer(points)
    } else {
      isError.value = true
      answerMessage.value = 'Incorrect! Try again.'
      selectedAnswer.value = ''
      isProcessingAnswer.value = false
    }
  }
}

const showCorrectAnswer = (points: number) => {
  isAnswered.value = true
  const rawAnswer = props.game?.gameQuestions[activeIndex.value].answer || ''
  const formattedAnswer = rawAnswer
    .split(';')
    .map(part => part.trim())
    .filter(Boolean)
    .join(' feat. ')

  answerMessage.value += ` The correct answer was: ${formattedAnswer}.`
  if (points === 0) {
    answerMessage.value += ' You earned 0 points.'
  }

  setTimeout(() => {
    if (activeIndex.value < (props.game?.gameQuestions.length || 0) - 1) {
      isHintVisible.value = false
      activeIndex.value += 1
      startTimer()
    } else {
      isHintVisible.value = false
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

const endGameMsg = computed((): string => {
  let rang = '🗿🗿🗿'
  if (gameScore.value > 400 && gameScore.value <= 800) {
    rang = '🤠🤠🤠'
  } else if (gameScore.value > 800) {
    rang = '🔥🔥🔥'
  }

  return `${username.value} ${rang}`
})

const username = computed((): string => {
  return props.isDev ? 'Developer' : useWebApp().initDataUnsafe.user.username
})

const correctAnswer = computed(() => {
  const idx = props.activeIndex?.value ?? props.activeIndex ?? 0;

  const answer = props.game?.gameQuestions?.[idx]?.answer || '';
  console.log('ActiveIndex:', idx, 'Answer:', answer);
  return answer;
});

const expectedArtists = computed(() => {
  return correctAnswer.value
    .split(';')
    .map(a => a.trim().toLowerCase())
    .filter(Boolean);
});

const questionText = computed(() => {
  const count = expectedArtists.value.length;
  return count === 1 ? 'Кто исполняет песню?' : `Кто (${count}) исполняет песню?`;
});
</script>

<template>
  <div class="game">
    <game-start v-if="!game && !isGameFinished" :username="username" />

    <game-results v-if="isGameFinished" :end-game-msg="endGameMsg" :game-score="gameScore" />

    <div v-if="game && !isGameFinished">
      <div class="game text-center">
        <div class="game__timer text-xl flex justify-center items-center gap-2">
          <ClockIcon class="size-6" /> {{ timer }} sec
        </div>
        <div v-if="type === 'music'" class="game__question mt-6">
          {{ activeIndex + 1 }}. {{ questionText }}
        </div>
        <div v-if="type === 'movie'" class="game__question mt-6">
          <p class="mb-1.5 mt-1">Вопрос {{ activeIndex + 1 }}</p>
          <p class="mb-1.5 mt-1">Год выпуска: {{ game.gameQuestions[activeIndex].movieQuestion?.year }}</p>
          <p class="mb-1.5 mt-1">{{ game.gameQuestions[activeIndex].movieQuestion?.questionText  }}</p>
        </div>
        <div class="game__answer mt-6">
          <p class="text-xl font-bold" :class="isError ? 'text-red-500' : 'text-green-500'">{{ answerMessage }}</p>
        </div>
        <div v-if="pointsEarned" class="game__points mt-2 text-green-600">
          You earned: {{ pointsEarned }} points!
        </div>
        <div v-if="isHintVisible && type === 'music'" class="mt-2 italic text-lg">
          Song name: {{ game.gameQuestions[activeIndex].musicQuestion?.text }}
        </div>
        <div v-if="isHintVisible && type === 'movie'" class="mt-2 italic text-lg">
          <p class="mb-1.5 mt-1"> Режиссер: {{ game.gameQuestions[activeIndex].movieQuestion?.director }} </p>
          <p class="mb-1.5 mt-1"> Жанр: {{ game.gameQuestions[activeIndex].movieQuestion?.genres }} </p>
        </div>
        <div v-if="type === 'music'" class="game__audio flex justify-center mt-4">
          <audio v-show="game && game.gameQuestions[activeIndex]" ref="audioRef" controls />
        </div>
        <div class="game__input flex flex-col mt-4">
          <input
            v-model="selectedAnswer"
            ref="inputRef"
            placeholder="Enter your answer"
            class="input-text"
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

<style scoped lang="scss">
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
  color: var(--tg-theme-text-color);
  background: var(--tg-theme-section-bg-color);
}
</style>
