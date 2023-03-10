<script setup lang="ts">
import { Difficulty, TaskType } from '../types/types'
import { PropType, ref } from 'vue'
import { generateDate } from './sharedFunctions'

const props = defineProps({
  taskType: {
    type: Number as PropType<TaskType>,
    required: true
  },
  difficulty: {
    type: Number as PropType<Difficulty>,
    default: Difficulty.medium,
    required: false
  },
  locale: {
    type: String,
    required: true
  }
})
console.log(props)

const emit = defineEmits(['response'])

const solutionInput = ref('')
const taskText = ref('TASK')
const taskContent = ref('CONTENT')
const weekdays = new Array(7)
  .fill(0)
  .map((_, index) =>
    new Date(Date.UTC(2000, 0, index + 2)).toLocaleString(props.locale, { weekday: 'long' })
  )

const showInput = ref(false)
const showSelect = ref(false)

const selectOptions = ref<string[]>([])
const selectLabel = ref('OptionCategory')
const selectType = ref('')
let currentDate = new Date()

function testDate(): boolean {
  const solution = solutionInput.value
  return weekdays.indexOf(solution) == currentDate.getDay()
}

function testCalculation(): boolean {
  // TODO
  //  const solution = solutionInput.value
  return true
}

const solutionTesters = {
  [TaskType.Calculating]: testCalculation,
  [TaskType.WeekdayCalculating]: testDate
}

function testSolution(): void {
  const result = solutionTesters[props.taskType]()
  if (!result) {
    displayNewDate()
  }
  emit('response', result)
}

function displayNewDate(): void {
  currentDate = generateDate(props.difficulty)
  taskContent.value = currentDate.toLocaleDateString(props.locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

switch (props.taskType) {
  case TaskType.Calculating:
    taskText.value = 'Solve the following equation:'

    showInput.value = true
    showSelect.value = false
    break

  case TaskType.WeekdayCalculating:
    taskText.value = 'Select the weekday of the following date'
    displayNewDate()
    selectOptions.value = weekdays
    selectLabel.value = 'Weekday'
    selectType.value = 'weekdaySelect'

    showInput.value = false
    showSelect.value = true
}
</script>

<template>
  <div class="taskArea">
    <div class="taskText">{{ taskText }}</div>
    <div class="taskContent">{{ taskContent }}</div>
    <form
      class="solutionForm"
      @submit="
        (e) => {
          e.preventDefault()
          testSolution()
        }
      "
    >
      <input
        v-if="showInput"
        v-model="solutionInput"
        type="text"
        class="solution"
        placeholder="Solution"
      />
      <v-select
        v-if="showSelect"
        v-model="solutionInput"
        :label="selectLabel"
        :items="selectOptions"
        :class="'solution ' + selectType"
        :menu-props="{ maxHeight: 'unset' }"
      >
      </v-select>

      <div class="buttonContainer">
        <v-btn variant="tonal" class="submitButton" :disabled="true" height="60px">
          <ci-redo height="45px" width="45px" />
        </v-btn>
        <v-btn variant="tonal" class="submitButton" type="submit" height="60px">
          <ic-round-navigate-next height="50px" width="50px" />
        </v-btn>
      </div>
    </form>
  </div>
</template>

<style lang="less">
@import '../assets/css/styles.less';

.taskArea {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  height: 100%;
  width: 100%;
  font-size: 25px;
}

.solutionForm {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
}
.taskText {
  height: 10%;
  font-size: 30px;
}

.taskContent {
  font-size: 40px;
  margin-top: 20px;
}

.solution {
  font-size: 30px;
  height: 70px;
  text-align: center;
}

.weekdaySelect {
  width: 300px;
}

.buttonContainer {
  width: 220px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 40px;
  .submitButton {
    margin: 10px;
    width: 80px;
    border-radius: 10px;
    border: none;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
    font-size: 30px;
    text-align: center;
  }
  .submitButton:hover {
    cursor: pointer;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  }
}
</style>
