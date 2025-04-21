<script setup lang="ts">
import type { RunnerState } from '../utils';
import { IconConfirm, IconMinus, IconPlus, IconTrash } from '@iconify-prerendered/vue-line-md';

const { state } = defineProps<{
  state: RunnerState
  disabled?: boolean
}>();

const emit = defineEmits<{
  switch: [to: number]
  add: []
  remove: [index: number]
}>();

const removing = defineModel('removing');

function handleClick(index: number) {
  if (state.case === index)
    return;
  if (removing.value)
    emit('remove', index);
  else
    emit('switch', index);
}
</script>

<template>
  <ol>
    <li
      v-for="(_, i) in state.cases"
      :key="i"
      role="tab"
      :title="`${(i !== state.case && removing) ? 'Remove ' : ''}Test Case ${i + 1}`"
      :aria-selected="i === state.case"
      :aria-disabled="disabled"
      @click="handleClick(i)"
    >
      <IconTrash v-if="removing && i !== state.case" @click="$emit('remove', i)" />
      <template v-else>
        #{{ i + 1 }}
      </template>
    </li>

    <li
      v-if="!removing"
      title="Add Test Case"
      role="tab"
      :aria-disabled="disabled"
      @click="!disabled && $emit('add')"
    >
      <IconPlus />
    </li>

    <li
      v-if="state.cases.length > 1"
      title="Remove Test Case"
      role="tab"
      :aria-disabled="disabled"
      @click="!disabled && (removing = !removing)"
    >
      <IconConfirm v-if="removing" />
      <IconMinus v-else />
    </li>
  </ol>
</template>

<style scoped>
ol {
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
