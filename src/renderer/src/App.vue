<script setup lang="ts">
import Task from './components/Task.vue'
import { Difficulty, TaskType } from './types/types'
import { ref } from 'vue'
const close = async (): Promise<void> => {
  // @ts-ignore - preload script adds this
  const response = await window.ipc.closeApp()
}

const taskType = TaskType.WeekdayCalculating
const difficulty = Difficulty.medium
const locked = ref(0)
function taskResponse(response: number): void {
  if (response == 0) {
    locked.value = 1
    setTimeout(() => {
      locked.value = 2
      setTimeout(() => close(), 50)
    }, 100)
  } else {
    console.log('Incorrect')
  }
}
</script>

<template>
  <div @click="close">
    <ic-round-close class="quit-button" />
  </div>
  <div class="halves-container">
    <div class="main">
      <h1>LOCKED</h1>
      <ic-outline-lock-person v-if="locked == 0" width="150px" height="150px" />
      <ic-outline-lock-open v-else-if="locked == 1" width="150px" height="150px" />
      <mdi-lock-open-variant-outline v-else width="150px" height="150px" />
    </div>
    <Task :task-type="taskType" :difficulty="difficulty" @response="(msg) => taskResponse(msg)" />
  </div>
</template>

<style lang="less">
@import './assets/css/styles.less';
.halves-container {
  display: grid;
  grid-template-rows: 1fr 1fr;
  height: 100vh;
}

.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  font-size: 25px;
}

.quit-button {
  position: absolute;
  height: 75px;
  width: 75px;
  top: 15px;
  right: 15px;
}

.quit-button:hover {
  color: red;
}
</style>
