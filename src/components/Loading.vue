<script setup lang="ts">
import { onUnmounted, ref } from 'vue';

const dots = ref(0);
const interval = setInterval(() => {
  dots.value = (dots.value + 1) % 4;
}, 300);

onUnmounted(() => clearInterval(interval));
</script>

<template>
  <div class="container">
    Booting{{ '.'.repeat(dots) }}
  </div>
</template>

<style scoped>
.container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}
</style>
