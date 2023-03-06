<script setup lang="ts">
import Task from './components/Task.vue'
import { Difficulty, TaskType } from './types/types'
const close = async (): Promise<void> => {
  // @ts-ignore - preload script adds this
  const response = await window.ipc.closeApp()
}

const taskType = TaskType.WeekdayCalculating
const difficulty = Difficulty.medium
</script>

<template>
  <div @click="close">
    <ic-round-close class="quit-button" />
  </div>
  <div class="halves-container">
    <div class="main">
      <h1>LOCKED</h1>
      <ic-outline-lock-person width="150px" height="150px" />
    </div>
    <Task :task-type="taskType" :difficulty="difficulty" />
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
  height: 5rem;
  width: 5rem;
  top: 1rem;
  right: 1rem;
}

.quit-button:hover {
  color: red;
}
</style>
