<script setup lang="ts">
import { Difficulty, TaskType } from '../../../types/types'
import { PropType, ref, watch } from 'vue'
import { generateDate, randomMathTermString } from './sharedFunctions'
import MathTerm from '../../../types/MathTerm'

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
watch([props.taskType, props.difficulty, props.locale], () => {
  displayNewDate()
})
const emit = defineEmits(['response'])

enum InputType {
  wholeNumber = 'wholeNumber',
  text = 'text'
}

const solutionInputs = ref([])
const taskText = ref('TASK')
const taskContent = ref('CONTENT')
const selectType = ref('')

const weekdays = new Array(7)
  .fill(0)
  .map((_, index) =>
    new Date(Date.UTC(2000, 0, index + 2)).toLocaleString(props.locale, { weekday: 'long' })
  )

const showInput = ref(false)
const showSelect = ref(false)
const showFractionInput = ref(false)

const inputType = ref(InputType.wholeNumber)
const selectOptions = ref<string[]>([])
const selectLabel = ref('OptionCategory')

let currentDate = new Date()
let currentCalculation: MathTerm
let currentCalculationString: string

function testDate(): boolean {
  const solution = solutionInputs.value[0]
  return weekdays.indexOf(solution) == currentDate.getDay()
}

function testCalculation(): boolean {
  if (showFractionInput.value) {
    // fraction
    const solutionWhole = solutionInputs.value[0]
    const solutionNumerator = solutionInputs.value[1]
    const solutionDenominator = solutionInputs.value[2]
    if (
      Number(solutionWhole) % 1 != 0 ||
      Number(solutionNumerator) % 1 != 0 ||
      Number(solutionDenominator) % 1 != 0
    ) {
      return false
    }
    const solutionNumber = new MathTerm(
      `${solutionWhole} ${
        solutionWhole.trim().startsWith('-') ? '-' : '+' // if the whole number is negative, the fraction is negative
      } ${solutionNumerator}/${solutionDenominator}`
    )
    console.log(solutionNumber.evaluate(), currentCalculation.evaluate())
    console.log(
      `${solutionWhole} ${
        solutionWhole.trim().startsWith('-') ? '-' : '+' // if the whole number is negative, the fraction is negative
      } ${solutionNumerator}/${solutionDenominator}`
    )

    if (solutionNumber.evaluate() == currentCalculation.evaluate()) {
      return true
    }
  } else {
    // whole number
    const solution = solutionInputs.value[0]
    if (solution == '') {
      return false
    }
    const solutionNumber = Number(solution)
    if (isNaN(solutionNumber)) {
      return false
    }
    if (Math.round(solutionNumber) == Math.round(currentCalculation.evaluate())) {
      return true
    }
  }
}

const solutionTesters = {
  [TaskType.Calculating]: testCalculation,
  [TaskType.WeekdayCalculating]: testDate
}

const reloaders = {
  [TaskType.Calculating]: displayNewCalculation,
  [TaskType.WeekdayCalculating]: displayNewDate
}

function reloadTask(): void {
  reloaders[props.taskType]()
}

function testSolution(): void {
  const result = solutionTesters[props.taskType]()
  if (!result) {
    reloaders[props.taskType]()
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

function displayNewCalculation(): void {
  currentCalculationString = randomMathTermString(props.difficulty)
  currentCalculation = new MathTerm(currentCalculationString)
  taskContent.value = currentCalculationString
  const solutionValue = currentCalculation.evaluate()
  if (solutionValue % 1 != 0) {
    showFractionInput.value = true
    solutionInputs.value = ['', '', '']
    showInput.value = false
  } else {
    showFractionInput.value = false
    solutionInputs.value = ['']
    showInput.value = true
  }
}

switch (props.taskType) {
  case TaskType.Calculating:
    taskText.value = 'Solve the following equation:'
    // create a random calculation
    showSelect.value = false
    showInput.value = true
    inputType.value = InputType.wholeNumber
    displayNewCalculation()
    break

  case TaskType.WeekdayCalculating:
    taskText.value = 'Select the weekday of the following date'
    solutionInputs.value = ['']
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
        v-model="solutionInputs[0]"
        type="text"
        :class="'solution' + ' ' + inputType"
        :placeholder="inputType != 'wholeNumber' ? 'Solution' : ''"
      />
      <div v-if="showFractionInput" class="solution fraction">
        <input v-model="solutionInputs[0]" type="text" placeholder="" class="Whole" />
        <div class="fractionComponent">
          <input v-model="solutionInputs[1]" type="text" placeholder="" class="Numerator" />
          <div class="fractionBar"></div>
          <input v-model="solutionInputs[2]" type="text" placeholder="" class="Denominator" />
        </div>
      </div>
      <v-select
        v-if="showSelect"
        v-model="solutionInputs[0]"
        :label="selectLabel"
        :items="selectOptions"
        :class="'solution ' + selectType"
        :menu-props="{ maxHeight: 'unset' }"
      >
      </v-select>

      <div class="buttonContainer">
        <v-btn variant="tonal" class="submitButton" height="60px" @click="reloadTask">
          <ci-redo height="45px" width="45px" />
        </v-btn>
        <v-btn variant="tonal" class="submitButton" type="submit" height="60px">
          <ic-round-navigate-next height="50px" width="50px" />
        </v-btn>
      </div>
    </form>
  </div>
</template>

<style lang="scss">
@import '../assets/css/styles';

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
  color: white;
  background-color: #f5f5f511;
  border-radius: 10px;
}

input {
  outline: none;
  color: white;
}

.solution.wholeNumber {
  width: 180px;
  height: 80px;
  font-size: 50px;
}

.solution.fraction {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 180px;
  height: 150px;

  .Whole {
    width: 70px;
    background-color: #f5f5f511;
    border-radius: 10% 0% 0% 10%;
    text-align: center;
    padding: 5px;
    font-size: 40px;
  }
  .fractionComponent {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f511;
    border-radius: 10%;
    padding: 2px;
    font-size: 30px;
    height: 120px;
    width: 90px;
    .Numerator {
      text-align: center;
      width: 50px;
    }
    .fractionBar {
      width: 60px;
      height: 2px;
      background-color: white;
      margin-bottom: 5px;
      margin-top: 5px;
    }
    .Denominator {
      text-align: center;
      width: 50px;
    }
  }
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
