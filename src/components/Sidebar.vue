<script setup lang="ts">
import type { ProblemIOSample } from 'un-oj';
import type { RunnerState } from '../utils';
import { IconConfirm, IconMinus, IconPlus, IconTrash } from '@iconify-prerendered/vue-line-md';
import { ref } from 'vue';
import ImportCases from './ImportCases.vue';

const { state } = defineProps<{
  state: RunnerState
  disabled?: boolean
}>();

const emit = defineEmits<{
  switch: [to: number]
  add: [sample?: ProblemIOSample]
  remove: [index: number]
}>();

const removing = ref(false);

function handleClick(index: number) {
  if (state.case === index)
    return;
  if (removing.value)
    emit('remove', index);
  else
    emit('switch', index);
}

function handleImport(cases: ProblemIOSample[]) {
  for (const c of cases)
    emit('add', c);
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
      <IconTrash v-if="removing && i !== state.case" />
      <template v-else>
        #{{ i + 1 }}
      </template>
    </li>

    <li
      v-if="!removing"
      title="Add Test Case"
      role="button"
      :aria-disabled="disabled"
      @click="!disabled && $emit('add')"
    >
      <IconPlus />
    </li>

    <li
      v-if="removing || state.cases.length > 1"
      title="Remove Test Case"
      role="button"
      :aria-disabled="disabled"
      @click="!disabled && (removing = !removing)"
    >
      <IconConfirm v-if="removing" />
      <IconMinus v-else />
    </li>

    <ImportCases :disabled @import="handleImport" />
  </ol>
</template>

<style scoped>
ol {
  height: 100%;
  all: unset;
}

ol:deep() > li {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  font-size: 16px;
  cursor: pointer;
  list-style: none;
  color: var(--vscode-tab-inactiveForeground);

  &[aria-selected="true"] {
    color: var(--vscode-tab-activeForeground);
    border-right: 2px solid var(--vscode-tab-activeForeground);
  }

  &[aria-disabled="true"] {
    pointer-events: none;
    color: var(--vscode-tab-inactiveForeground);
    border-right-color: var(--vscode-tab-inactiveForeground);
  }
}
</style>
