<script setup lang="ts">
import { ref } from 'vue'
import CounterSetting from './components/CounterSetting.vue'
import { Difficulty, IPC, Settings, TaskType } from '../../types/types'
import ISO6391 from 'iso-639-1'
interface Window {
  ipc?: IPC
  data?: any
}

const getSettings = async (): Promise<any> => {
  return await window.ipc.getSettings()
}

const setSettings = async (settings: Settings): Promise<boolean> => {
  return window.ipc.setSettings(JSON.stringify(settings))
}

function convertLocale(): string {
  try {
    return ISO6391.getCode(selectedLocale.value)
  } catch {
    return 'en-US'
  }
}

const closeSettings = async (): Promise<void> => {
  console.log(selectedLocale.value)
  setSettings({
    difficulty: selectedDifficulty.value,
    allowedTasks: selectedTaskTypes.value,
    numberOfTasks: taskCounter.value,
    locale: ISO6391.validate(selectedLocale.value) ? selectedLocale.value : convertLocale()
  }).then(() => {
    window.ipc.closeSettings()
  })
}

const taskCounter = ref(3)

const selectedLocale = ref<string>('en-US')
const selectLocales = ISO6391.getLanguages(ISO6391.getAllCodes()).map((locale) => ({
  title: locale.name,
  value: locale.code
}))

const selectedDifficulty = ref<Difficulty>(Difficulty.medium)
const selectDifficulties = [
  { title: 'Very Easy', value: Difficulty.very_easy },
  { title: 'Easy', value: Difficulty.easy },
  { title: 'Medium', value: Difficulty.medium },
  { title: 'Hard', value: Difficulty.hard },
  { title: 'Very Hard', value: Difficulty.very_hard }
]

const selectedTaskTypes = ref<TaskType[]>([TaskType.WeekdayCalculating])
let lastValidState = [...selectedTaskTypes.value]
const selectTaskTypes = [
  { title: 'Calculating', value: TaskType.Calculating },
  { title: 'Weekday Calculating', value: TaskType.WeekdayCalculating }
]

getSettings().then((settings: Settings) => {
  console.log(settings)
  taskCounter.value = settings.numberOfTasks
  selectedDifficulty.value = settings.difficulty
  selectedTaskTypes.value = settings.allowedTasks
  selectedLocale.value = ISO6391.getName(settings.locale)
})

function checkValidTaskTypes(e): void {
  if (selectedTaskTypes.value.length == 0) {
    selectedTaskTypes.value = lastValidState
  }
  lastValidState = selectedTaskTypes.value
}
</script>

<template>
  <v-container class="settings-container">
    <v-card class="settings-window">
      <v-card-title class="headline">Settings</v-card-title>
      <div class="settingRow">
        <div class="settingLabel">Number of Tasks</div>
        <CounterSetting
          :value="taskCounter"
          :min="1"
          :max="20"
          @increment="taskCounter++"
          @decrement="taskCounter--"
        />
      </div>
      <div class="settingRow">
        <div class="settingLabel">Difficulty</div>
        <div class="select">
          <v-select
            v-model="selectedDifficulty"
            :items="selectDifficulties"
            :menu-props="{ maxHeight: 'unset' }"
            hide-details
            variant="solo"
          />
        </div>
      </div>
      <div class="settingRow">
        <div class="settingLabel">Allowed Tasks</div>
        <div class="select">
          <v-select
            v-model="selectedTaskTypes"
            :items="selectTaskTypes"
            multiple
            variant="solo"
            chips
            hide-details
            @update:modelValue="checkValidTaskTypes"
          >
          </v-select>
        </div>
      </div>
      <div class="settingRow">
        <div class="settingLabel">Language/Region</div>
        <div class="select">
          <v-autocomplete
            v-model="selectedLocale"
            :items="selectLocales"
            hide-details
            variant="solo"
          />
        </div>
      </div>
    </v-card>
    <v-btn class="mt-4" @click="closeSettings">Save and Back</v-btn>
  </v-container>
</template>

<style>
html {
  overflow: hidden;
  user-select: none;
}

body {
  background-color: #2f3241;
  overflow: hidden;
}
.settings-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
}

.settingRow {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 10px;
  padding: 10px;
  border-radius: 5px;
  background-color: #2f324122;
}

.settingLabel {
  font-size: 18px;
  font-weight: bold;
}

.settings-window {
  width: 600px;
  max-height: 90vh;
  min-height: 250px;
  font-size: 18px;
}

.select {
  width: 300px;
  font-size: 18px;
}

v-card {
  max-width: 500px;
  font-size: 18px;
}
</style>
