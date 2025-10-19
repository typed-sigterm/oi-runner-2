<script setup lang="ts">
defineProps<{
  extensions: string[]
}>();
</script>

<template>
  <div v-if="extensions.length" class="container">
    <h1>Open a file to start</h1>
    <p>
      Supported extensions (configured in settings):
    </p>
    <p class="extensions">
      <code v-for="ext in extensions" :key="ext" v-text="ext" />
    </p>
  </div>

  <div v-else class="container">
    <h1>
      Configuration error
    </h1>
    <p>
      Please specify key-value pairs in
      <code>
        oi-runner-2.defaultTask
      </code>
      configuration.
    </p>
  </div>
</template>

<style scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

h1 {
  font-size: 28px;
  font-weight: bold;
}

p {
  font-size: 16px;
}

code {
  font-size: 14px;
}

.extensions {
  display: flex;
  gap: .25em;
  margin-top: 4px;
}
</style>
