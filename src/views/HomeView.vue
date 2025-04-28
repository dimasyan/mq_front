<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { audioSamples, imgSamples, textSamples } from '@/utils/samples'
import { Instagram } from 'lucide-vue-next'
import TgIcon from '@/assets/tg.svg'
import { vMaska } from "maska/vue"
import axios from 'axios'

const types = ['text', 'image', 'audio']
const typeLabels = {
  text: 'Текст',
  image: 'Картинка',
  audio: 'Аудио'
}

const sampleQuestions = reactive({
  text: textSamples,
  image: imgSamples,
  audio: audioSamples,
})

const currentType = ref('text')
const currentIndex = ref(0)
const selectedAnswer = ref(null)

const currentQuestion = computed(() => {
  return sampleQuestions[currentType.value][currentIndex.value] || null
})

function selectTab(type: any) {
  currentType.value = type
  currentIndex.value = 0
  selectedAnswer.value = null
}

function selectAnswer(index: any) {
  if (selectedAnswer.value === null) {
    selectedAnswer.value = index
  }
}

function getChoiceClass(index) {
  if (selectedAnswer.value === null) return 'bg-white hover:bg-gray-100 border-gray-300'

  if (index === currentQuestion.value.correctIndex) return 'bg-green-100 border-green-500 text-green-700'
  if (index === selectedAnswer.value) return 'bg-red-100 border-red-500 text-red-700'
  return 'bg-white border-gray-300'
}

function nextQuestion() {
  const next = currentIndex.value + 1
  const hasMore = sampleQuestions[currentType.value].length > next

  if (hasMore) {
    currentIndex.value = next
  } else {
    currentIndex.value = 0
  }

  selectedAnswer.value = null
}

const isModalOpen = ref(false)
const isSubmitted = ref(false)

const teamName = ref('')
const captainName = ref('')
const phoneNumber = ref('')

const errors = ref({
  teamName: '',
  captainName: '',
  phoneNumber: '',
})

function openRegistration() {
  isModalOpen.value = true
  isSubmitted.value = false
  teamName.value = ''
  captainName.value = ''
  phoneNumber.value = ''
  clearErrors()
}

function closeRegistration() {
  isModalOpen.value = false
}

function clearErrors() {
  errors.value = {
    teamName: '',
    captainName: '',
    phoneNumber: '',
  }
}

function validateForm() {
  clearErrors()
  let isValid = true

  if (!teamName.value.trim()) {
    errors.value.teamName = 'Введите название команды'
    isValid = false
  }
  if (!captainName.value.trim()) {
    errors.value.captainName = 'Введите имя капитана'
    isValid = false
  }
  if (!phoneNumber.value.match(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/)) {
    errors.value.phoneNumber = 'Введите корректный номер телефона'
    isValid = false
  }

  return isValid
}

const errorMessage = ref('')
const submitForm = async () => {
  try {
    if (validateForm()) {
      const payload = {
        captainName: captainName.value,
        teamName: teamName.value,
        phoneNumber: phoneNumber.value,
      }
      const response = await axios.post('/api/registerteam', payload)
      isSubmitted.value = true
      console.log(response)
    }
  } catch (error: any) {
    console.error('Error registering team:', error)
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = 'Произошла ошибка при отправке формы. Пожалуйста, попробуйте снова.'
    }
  }
}

function clickOutside(e: MouseEvent) {
  if ((e.target as HTMLElement).id === 'modal-bg') {
    closeRegistration()
  }
}
</script>

<template>
  <div class="home">
    <header class="home-header w-full relative bg-gradient-to-r from-purple-500 to-indigo-600 text-white min-h-[60vh] sm:min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <!-- Mock Logo -->
      <div class="flex items-center gap-2 mb-4">
        <div class="logo w-36">
          <img src="@/assets/logo.svg" alt="logo" />
        </div>
        <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight z-10">IZZY QUIZ</h1>
      </div>

      <!-- Subtitle -->
      <p class="text-lg sm:text-3xl max-w-2xl mb-6 z-10">
        Интересные, увлекательные и нетривиальные ультра квизы в Алматы по музыке и не только
      </p>

      <a href="#schedule" class="bg-white text-purple-700 font-semibold px-8 py-4 rounded-full shadow-lg hover:bg-purple-200 transition-all transform hover:scale-110 z-10 mt-12 sm:mt-0">
        НАШИ ИГРЫ
      </a>

      <!-- Social Media Links (Instagram, Telegram) -->
      <div class="absolute top-4 right-4 flex gap-4 z-10">
        <a href="https://www.instagram.com/iq_izzyquiz/" target="_blank" class="text-white transition transform hover:scale-110 hover:bg-transparent focus:outline-none">
          <Instagram class="w-8 h-8" />
        </a>
        <a href="https://t.me/+baunhMVsfZ8yZTdi" target="_blank" class="text-white transition transform hover:scale-110 hover:bg-transparent focus:outline-none">
          <img :src="TgIcon" alt="Telegram" class="w-8 h-8" />
        </a>
      </div>

      <!-- Background Image (faint) -->
      <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1589927986089-35812388d1b8')] bg-cover bg-center opacity-20 z-0"></div>
      <div class="absolute inset-0 bg-black opacity-30 z-0"></div>
    </header>

    <div class="home-body">
      <section id="schedule" class="py-20 px-4 bg-gradient-to-r from-purple-100 to-indigo-300 text-white">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-4xl sm:text-5xl font-bold mb-10 text-purple-700">Ближайшие игры</h2>

          <div class="bg-gradient-to-r from-purple-400 to-indigo-500 rounded-3xl shadow-xl p-8 sm:p-12 text-center transform hover:scale-105 transition-all duration-300">
            <h3 class="text-3xl sm:text-4xl text-gray-900 mb-6">
              <span class="inline-block bg-gradient-to-r from-white to-indigo-200 text-transparent bg-clip-text font-bold">Ultra Music Mix #2</span>
            </h3>

            <!-- Game Info with Icons -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-lg mb-8">
              <!-- Date -->
              <div class="flex items-center justify-start sm:justify-center gap-2">
                <span class="text-3xl text-purple-600">📅</span>
                <p class="text-gray-100 font-semibold">13 мая 2025, 19:30</p>
              </div>

              <!-- Location -->
              <div class="flex items-center justify-start sm:justify-center gap-3">
                <span class="text-3xl text-purple-600">📍</span>
                <p class="text-gray-200 font-semibold text-left sm:text-center">Бар "Хмельница", <br class="hidden sm:block"> ул. Карайсай Батыра 193</p>
              </div>

              <!-- Status -->
              <div class="flex items-center justify-start sm:justify-center gap-2">
                <span class="text-3xl text-purple-600">✅</span>
                <p class="text-green-200 font-semibold">Открыта запись</p>
              </div>
            </div>

            <!-- Register Button -->
            <button
              @click="openRegistration"
              class="bg-purple-600 text-white text-2xl font-bold mt-4 px-8 py-4 rounded-full hover:bg-purple-700 transition-transform transform hover:scale-105 shadow-md"
            >
              Записаться
            </button>
          </div>

        </div>
      </section>

      <section id="about" class="py-20 px-4 bg-gradient-to-r from-purple-500 to-indigo-600">
        <div class="max-w-5xl mx-auto text-center">
          <h2 class="text-3xl sm:text-5xl font-bold text-purple-100 mb-4">Что такое Izzy Quiz?</h2>
          <p class="text-gray-200 text-xl max-w-3xl mx-auto mb-12">
            Это не просто викторина — это вечер, наполненный музыкой, смехом и соревновательным духом. Собери команду, проверь свою эрудицию и выиграй крутые призы!
          </p>

          <div class="grid gap-8 sm:grid-cols-3 text-left">
            <div class="bg-gray-100 p-8 rounded-xl shadow-md hover:shadow-xl transition-all">
              <div class="text-5xl mb-4 text-center transform hover:scale-105 transition-all">🎵</div>
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Музыкальные и не только раунды</h3>
              <p class="text-gray-600">Все жанры, все эпохи, всевозможные механики и многое другое</p>
            </div>

            <div class="bg-gray-100 p-8 rounded-xl shadow-md hover:shadow-xl transition-all">
              <div class="text-5xl mb-4 text-center transform hover:scale-105 transition-all">🍻</div>
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Уютная атмосфера бара</h3>
              <p class="text-gray-600">Живое общение, напитки и дружеский вайб в центре событий.</p>
            </div>

            <div class="bg-gray-100 p-8 rounded-xl shadow-md hover:shadow-xl transition-all">
              <div class="text-5xl mb-4 text-center transform hover:scale-105 transition-all">🎁</div>
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Призы и эмоции</h3>
              <p class="text-gray-600">Побеждай и получай призы, включая бутылку игристого с кастомным лейблом 🥂</p>
            </div>
          </div>
        </div>
      </section>
      <section class="py-20 px-4 bg-gray-50">
        <h2 class="text-3xl sm:text-4xl font-bold text-purple-800 mb-4 text-center">Примеры сестрам задеваешь</h2>
        <div class="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md">
          <!-- Tabs -->
          <div class="flex justify-center mb-6 gap-4">
            <button
              v-for="type in types"
              :key="type"
              @click="selectTab(type)"
              :class="[
            'px-4 py-2 rounded-full transition',
            currentType === type ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
          ]"
            >
              {{ typeLabels[type] }}
            </button>
          </div>

          <!-- Question Display -->
          <div v-if="currentQuestion" class="space-y-4">
            <h3 class="text-xl font-semibold text-gray-800 text-center">{{ currentQuestion.text }}</h3>

            <!-- Media -->
            <img
              v-if="currentQuestion.image"
              :src="currentQuestion.image"
              alt="question image"
              class="w-48 rounded-md mx-auto"
            />
            <audio
              v-if="currentQuestion.audio"
              controls
              class="w-full"
              :src="currentQuestion.audio"
            ></audio>

            <!-- Choices -->
            <div class="space-y-2">
              <button
                v-for="(choice, idx) in currentQuestion.choices"
                :key="idx"
                @click="selectAnswer(idx)"
                class="w-full text-left px-4 py-2 rounded-lg border transition"
                :class="getChoiceClass(idx)"
                :disabled="selectedAnswer !== null"
              >
                {{ choice }}
              </button>
            </div>

            <!-- Next -->
            <button
              @click="nextQuestion"
              class="mt-6 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition"
              :disabled="selectedAnswer === null"
            >
              Следующий вопрос →
            </button>
          </div>
        </div>
      </section>
    </div>
    <footer class="flex justify-center flex-col sm:flex-row w-full text-center py-6 bg-gradient-to-t from-gray-50 via-white to-gray-100 mt-12">
      <div class="logo w-24 sm:mr-5 mx-auto sm:ml-0">
        <img src="@/assets/logo.svg" alt="logo" />
      </div>
      <p class="text-sm text-gray-500 flex flex-col sm:flex-row content-center justify-center items-center">
        Сделано с ❤️  для всех любителей музыки.
        <a
          href="https://instagram.com/iq_izzyquiz"
          target="_blank"
          rel="noopener"
          class="text-purple-600 hover:text-purple-800 hover:bg-transparent inline-flex items-center gap-1 my-5 sm:my-0"
        >
          <Instagram class="w-5 h-5" />
          Подписывайтесь :)
        </a>
      </p>
    </footer>
    <!-- Modal -->
    <div
      v-if="isModalOpen"
      id="modal-bg"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="clickOutside"
    >
      <div class="bg-white rounded-3xl p-8 max-w-md w-full mx-4 relative">

        <!-- Close button -->
        <button
          @click="closeRegistration"
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl leading-none"
        >
          ✕
        </button>

        <!-- If submitted -->
        <div v-if="isSubmitted" class="text-center">
          <h3 class="text-3xl font-bold text-purple-700 mb-6">Спасибо за регистрацию!</h3>
          <p class="text-gray-600 mb-6">Мы скоро свяжемся с вами.</p>
          <button
            @click="closeRegistration"
            class="bg-purple-600 text-white font-bold py-3 px-8 rounded-full hover:bg-purple-700 transition"
          >
            Закрыть
          </button>
        </div>

        <!-- If not yet submitted -->
        <div v-else>
          <h3 class="text-3xl font-semibold text-purple-700 mb-0">Регистрация на игру</h3>
          <h4 class="text-2xl font-bold text-purple-900 mb-6">Ultra Music Mix #2</h4>

          <form @submit.prevent="submitForm" class="space-y-4">
            <div>
              <input
                type="text"
                v-model="teamName"
                placeholder="Название команды"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <p v-if="errors.teamName" class="text-red-500 text-sm mt-1">{{ errors.teamName }}</p>
            </div>

            <div>
              <input
                type="text"
                v-model="captainName"
                placeholder="Имя капитана"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <p v-if="errors.captainName" class="text-red-500 text-sm mt-1">{{ errors.captainName }}</p>
            </div>

            <div>
              <input
                type="text"
                v-model="phoneNumber"
                placeholder="Номер телефона"
                v-maska="'+7 (###) ###-##-##'"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <p v-if="errors.phoneNumber" class="text-red-500 text-sm mt-1">{{ errors.phoneNumber }}</p>
            </div>

            <div v-if="errorMessage" class="text-red-500 text-sm mt-4 text-center">
              {{ errorMessage }}
            </div>

            <button
              type="submit"
              class="w-full bg-purple-600 text-white font-bold py-3 rounded-full hover:bg-purple-700 transition"
            >
              Отправить
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
