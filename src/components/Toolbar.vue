<script lang="ts" setup>
import type { RunStep, TaskAttributes } from '../../shared/events';
import {
  IconDebugStart,
  IconDebugStop,
  IconExtensions,
  IconRunAll,
} from '@iconify-prerendered/vue-codicon';
import { computed } from 'vue';
import '@vscode-elements/elements/dist/vscode-button';
import '@vscode-elements/elements/dist/vscode-single-select';
import '@vscode-elements/elements/dist/vscode-option';

const props = defineProps<{
  tasks: TaskAttributes[]
  running: boolean
  stopping: boolean
}>();
defineEmits<{
  run: [step: RunStep]
  stop: []
}>();

const currentTask = defineModel<string>('currentTask');
const currentTaskCompilable = computed(() => {
  const task = props.tasks.find(t => t.name === currentTask.value);
  // If task is not found, the webview is not ready, so treat it as compilable by default
  return !task || task.compilable;
});
</script>

<template>
  <div class="toolbar">
    <vscode-single-select
      :value="currentTask"
      :disabled="running || stopping"
      @change="currentTask = $event.srcElement.value"
    >
      <vscode-option v-for="task in tasks" :key="task">
        {{ task.name }}
      </vscode-option>
    </vscode-single-select>

    <vscode-button v-if="currentTaskCompilable" title="Compile" :disabled="running" @click="$emit('run', 'compile')">
      <IconExtensions />
    </vscode-button>
    <vscode-button title="Run" :disabled="running" @click="$emit('run', 'execute')">
      <IconDebugStart />
    </vscode-button>
    <vscode-button v-if="currentTaskCompilable" title="Compile & Run" :disabled="running" @click="$emit('run', 'compile-execute')">
      <IconRunAll />
    </vscode-button>
    <vscode-button
      :style="{ cursor: stopping ? 'progress' : 'pointer' }"
      title="Stop"
      :disabled="!running || stopping"
      @click="$emit('stop')"
    >
      <IconDebugStop />
    </vscode-button>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: 8px 0;
}

vscode-single-select {
  width: 10em;
  margin-right: 8px;
}
vscode-button {
  --vscode-button-background: transparent;
  --vscode-button-hoverBackground: rgba(90, 93, 94, 0.31);
  border: none;
  padding: 1px 7px;
  font-size: medium;
}
</style>
