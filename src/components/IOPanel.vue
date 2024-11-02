<script lang="ts" setup>
import CodeMirror from 'vue-codemirror6';
import { useCmExtensions } from '../utils';

defineProps<{
  title: string
  readonly?: boolean
  disabled?: boolean
}>();
const value = defineModel<string>();

const cmExtensions = useCmExtensions();
</script>

<template>
  <div class="io-panel">
    <div>
      <h3>{{ title }}</h3>
      <slot name="info" />
    </div>
    <CodeMirror
      v-model="value"
      :style="{ opacity: disabled ? 0.3 : 1 }"
      :extensions="cmExtensions"
      :readonly
      :disabled
    />
    <slot name="extra" />
  </div>
</template>

<style scoped>
.io-panel {
  display: flex;
  flex-direction: column;
  overflow: auto;
}

h3 {
  display: inline-block;
  height: 16px;
  line-height: 16px;
  font-weight: normal;
  margin-top: 0;
  margin-bottom: 8px;
}

.vue-codemirror {
  flex: 1;
}
</style>
