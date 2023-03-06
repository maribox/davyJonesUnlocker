<template>
  <input v-model="solutionInput" type="text" class="input solution" placeholder="Enter text here" />
</template>
<script setup lang="ts">
import { Difficulty, TaskType } from '../types/types'
import { PropType, ref } from 'vue'

const props = defineProps({
  taskType: {
    type: Object as PropType<TaskType>,
    required: true
  },
  difficulty: {
    type: Object as PropType<Difficulty>,
    default: Difficulty.medium,
    required: false
  }
})

console.log(props)
const solutionInput = ref('')
</script>
<style lang="less">
@import '../assets/css/styles.less';

input {
  border-radius: 10px;
  border: none;
  padding: 20px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
  font-size: 2rem;
  height: 10%;
  width: 500px;
}
</style>
