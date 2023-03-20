<template>
  <div class="d-flex align-center">
    <div class="button buttonMinus" @click="decrement">
      <mdi-minus height="40px" width="40px" />
    </div>
    <div class="number">{{ value }}</div>
    <div class="button buttonPlus" @click="increment">
      <mdi-plus height="40px" width="40px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps({
  value: {
    type: Number,
    default: 0
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  }
})

const emit = defineEmits(['increment', 'decrement'])

function increment(): void {
  if (props.value < props.max) {
    emit('increment')
  }
}
function decrement(): void {
  if (props.value > props.min) {
    emit('decrement')
  }
}
</script>

<style>
.number {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  width: 80px;
  height: 50px;
  margin: 0;
  background-color: #2f324122;
}

.button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  background-color: #2f3241;
  color: #fff;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
}

.buttonPlus {
  border-radius: 0 10% 10% 0;
}

.buttonMinus {
  border-radius: 10% 0 0 10%;
}

.button:hover {
  background-color: #3f4251;
}
</style>
