<script setup lang="ts">
import type { RunnerState } from '../utils';
import { IconPlus } from '@iconify-prerendered/vue-line-md';

defineProps<{
  state: RunnerState
  disabled?: boolean
}>();

defineEmits<{
  switch: [to: number]
  add: []
}>();
</script>

<template>
  <ul>
    <li
      v-for="(_, i) in state.cases"
      :key="i"
      role="tab"
      :title="`Test Case ${i + 1}`"
      :aria-selected="i === state.case"
      :aria-disabled="disabled"
      @click="i !== state.case && $emit('switch', i)"
    >
      #{{ i + 1 }}
    </li>
    <li
      title="New Test Case"
      role="tab"
      :aria-disabled="disabled"
      @click="!disabled && $emit('add')"
    >
      <IconPlus />
    </li>
  </ul>
</template>

<style scoped>
ul {
  height: 100%;
  all: unset;
}

li {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  font-size: 16px;
  cursor: pointer;
  list-style: none;
  color: var(--vscode-tab-inactiveForeground);
}

li[aria-selected="true"] {
  color: var(--vscode-tab-activeForeground);
  border-right: 2px solid var(--vscode-tab-activeForeground);
}

li[aria-disabled="true"] {
  pointer-events: none;
  color: var(--vscode-tab-inactiveForeground);
  border-right-color: var(--vscode-tab-inactiveForeground);
}
</style>
