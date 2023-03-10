<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps({
  steps: {
    type: Number,
    required: true
  },
  currentStep: {
    type: Number,
    required: true
  }
})

console.log(props)
</script>

<template>
  <div>
    <ul class="progressbar">
      <!-- step is 1-indexed -->
      <li
        v-for="step in props.steps"
        :key="step"
        :class="
          (step <= props.currentStep + 1
            ? step < props.currentStep + 1
              ? 'stepComplete'
              : 'stepActive'
            : 'stepIncomplete') + ' step'
        "
      >
        {{ step }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.progressbar {
  display: flex;
  justify-content: stretch;
  flex-direction: row;
  align-items: center;
  width: 600px;
  height: 40px;
  list-style: none;
}

.step {
  flex-grow: 1;
  width: available;
  border-radius: 5px;
  margin: 3px;
  font-size: 15px;
  text-align: center;
}

.stepComplete {
  background-color: #005400;
}
.stepActive {
  background-color: rgba(166, 100, 19, 0.93);
}
.stepIncomplete {
  background-color: #7e0202;
}
</style>
