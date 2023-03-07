<script setup lang="ts"></script>

<template>
  <div class="circle-container">
    <div class="circle">
      <div class="halo"></div>
      <material-symbols-lock-outline class="lock-icon"></material-symbols-lock-outline>
    </div>
  </div>
</template>

<style>
html {
  overflow: hidden;
}

body {
  background-color: #2f3241;
  overflow: hidden;
}
.circle-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
}

.circle {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #ffffff;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
}

.halo {
  background-color: #86a5b144;
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border-radius: 50%;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
}

.lock-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  background-size: contain;
  background-repeat: no-repeat;
}
</style>
