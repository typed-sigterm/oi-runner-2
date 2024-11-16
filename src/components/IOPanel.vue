<script lang="ts" setup>
import { VueMonacoEditor } from '@guolao/vue-monaco-editor';
import { inject } from 'vue';
import { ThemeInjectKey, useFontSize } from '../utils';

defineProps<{
  title: string
  readonly?: boolean
  disabled?: boolean
}>();
const value = defineModel<string>();

const theme = inject(ThemeInjectKey);
const fontSize = useFontSize();
</script>

<template>
  <div class="io-panel">
    <div>
      <h3>{{ title }}</h3>
      <slot name="info" />
    </div>
    <VueMonacoEditor
      v-model="value"
      class="monaco-editor"
      :disabled
      :theme="theme === 'light' ? 'vs' : 'vs-dark'"
      :options="{
        automaticLayout: true,
        folding: false,
        fontSize,
        lineNumbersMinChars: 3,
        minimap: { enabled: false },
        readOnly: readonly,
      }"
    />
    <slot name="extra" />
  </div>
</template>

<style scoped>
.io-panel {
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
}

h3 {
  display: inline-block;
  height: 16px;
  line-height: 16px;
  font-weight: normal;
  margin-top: 0;
  margin-bottom: 8px;
}

.monaco-editor[disabled="true"] {
  opacity: 0.3;
  overscroll-behavior: none;
  pointer-events: none;
}
</style>
