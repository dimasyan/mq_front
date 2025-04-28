<script lang="ts" setup>
import type { Rank } from '@/models/rank'
import { ref } from 'vue'

const testRanks = ref<Rank[]|[]>([
  {
    tg_id: 1,
    tg_username: 'User 1',
    total_score: 1000,
    place: 1
  },
  {
    tg_id: 2,
    tg_username: 'User 2',
    total_score: 800,
    place: 2
  },
  {
    tg_id: 3,
    tg_username: 'User 3',
    total_score: 750,
    place: 3
  },
  {
    tg_id: 4,
    tg_username: 'User 4',
    total_score: 600,
    place: 4
  },
  {
    tg_id: 5,
    tg_username: 'User 5',
    total_score: 550,
    place: 5
  },
  {
    tg_id: 6,
    tg_username: 'User 6',
    total_score: 400,
    place: 6
  },
  {
    tg_id: 7,
    tg_username: 'User 7',
    total_score: 100,
    place: 7
  }
])
</script>

<template>
<div class="ranks">
  <div class="ranks-content mx-auto w-96	">
    <h4 class="text-xl my-4 text-center">Таблица Рейтингов</h4>
    <div class="ranks-content-table">
      <table class="border-collapse border border-slate-400 mx-auto">
        <thead>
          <tr>
            <th class="border border-slate-300 py-2 px-3">#</th>
            <th class="border border-slate-300 py-2 px-3">Player</th>
            <th class="border border-slate-300 py-2 px-3">Score</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rank in testRanks" :key="rank.tg_id">
            <td class="border border-slate-300 py-2 px-3">{{ rank.place }}</td>
            <td class="border border-slate-300 py-2 px-3">{{ rank.tg_username }}</td>
            <td class="border border-slate-300 py-2 px-3">{{ rank.total_score }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
</template>

<style scoped>

</style>
