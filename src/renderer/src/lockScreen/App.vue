<script setup lang="ts">
import Task from './components/Task.vue'
import StepProgress from './components/StepProgress.vue'
import { Difficulty, TaskType, ITask, IPC, Settings } from '../../types/types'
import { ref } from 'vue'

interface Window {
  ipc?: IPC
}
const close = async (): Promise<void> => {
  await window.ipc.closeApp()
}

const openSettings = async (): Promise<void> => {
  await window.ipc.openSettings()
}

const getSettings = async (): Promise<any> => {
  return await window.ipc.getSettings()
}

const shakeRedLock = ref(false)
const locked = ref(0)
const currentTask = ref(0)
const loaded = ref(false)
let NUMBER_OF_TASKS, ALLOWED_TASK_TYPES, DIFFICULTY, LOCALE, tasks: ITask[]
getSettings().then((settings: Settings) => {
  NUMBER_OF_TASKS = settings.numberOfTasks
  ALLOWED_TASK_TYPES = settings.allowedTasks
  DIFFICULTY = settings.difficulty
  LOCALE = settings.locale
  tasks = []
  for (let i = 0; i < NUMBER_OF_TASKS; i++) {
    tasks.push({
      taskType: ALLOWED_TASK_TYPES[Math.floor(Math.random() * ALLOWED_TASK_TYPES.length)],
      difficulty: DIFFICULTY
    })
  }
  loaded.value = true
})

function taskResponse(response: boolean): void {
  if (response) {
    currentTask.value++

    if (currentTask.value == NUMBER_OF_TASKS) {
      unlock()
    }
  } else {
    if (currentTask.value != 0) {
      currentTask.value -= 1
    }
    shakeRedLock.value = true
    setTimeout(() => (shakeRedLock.value = false), 400)
  }
}

function unlock(): void {
  locked.value = 1
  setTimeout(() => {
    locked.value = 2
    setTimeout(() => close(), 50)
  }, 100)
}
</script>

<template>
  <div @click="close">
    <ic-round-close class="appButton closeButton" />
  </div>
  <div @click="openSettings">
    <ic-round-settings class="appButton settingsButton" />
  </div>
  <div v-if="loaded" class="halves-container">
    <div class="main">
      <h1>LOCKED</h1>
      <ic-outline-lock-person
        v-if="locked === 0"
        width="150px"
        height="150px"
        :class="shakeRedLock ? 'shakeLock' : ''"
      />
      <ic-outline-lock-open v-else-if="locked === 1" width="150px" height="150px" />
      <mdi-lock-open-variant-outline v-else width="150px" height="150px" />
      <StepProgress :steps="NUMBER_OF_TASKS" :current-step="currentTask" class="steps" />
    </div>
    <Task
      v-if="currentTask < NUMBER_OF_TASKS"
      :key="currentTask"
      :task-type="tasks[currentTask].taskType"
      :difficulty="DIFFICULTY"
      :locale="LOCALE"
      @response="(resp) => taskResponse(resp)"
    />
  </div>
</template>

<style lang="less">
@import 'assets/css/styles.scss';

.steps {
  margin-top: 50px;
}

.halves-container {
  display: grid;
  grid-template-rows: 1fr 1fr;
  height: 100vh;
  user-select: none;
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

.closeButton {
  top: 15px;
  right: 15px;
}

.settingsButton {
  top: 15px;
  left: 15px;
  height: 65px;
  width: 65px;
}

.appButton {
  position: absolute;
  height: 75px;
  width: 75px;
}

.appButton:hover {
  color: #7e0202;
}

.shakeLock {
  animation: shake 0.5s;
  animation-iteration-count: infinite;
  color: #a90606;
}

@keyframes shake {
  0% {
    transform: translate(1px, 1px) rotate(0deg);
  }
  10% {
    transform: translate(-1px, -2px) rotate(-1deg);
  }
  20% {
    transform: translate(-3px, 0px) rotate(1deg);
  }
  30% {
    transform: translate(3px, 2px) rotate(0deg);
  }
  40% {
    transform: translate(1px, -1px) rotate(1deg);
  }
  50% {
    transform: translate(-1px, 2px) rotate(-1deg);
  }
  60% {
    transform: translate(-3px, 1px) rotate(0deg);
  }
  70% {
    transform: translate(3px, 1px) rotate(-1deg);
  }
  80% {
    transform: translate(-1px, -1px) rotate(1deg);
  }
  90% {
    transform: translate(1px, 2px) rotate(0deg);
  }
  100% {
    transform: translate(1px, -2px) rotate(-1deg);
  }
}
</style>
