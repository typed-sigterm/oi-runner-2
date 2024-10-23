<script lang="ts" setup>
import type { RunStep } from '../../shared/events';
import {
  IconDebugStart,
  IconDebugStop,
  IconExtensions,
  IconRunAll,
} from '@iconify-prerendered/vue-codicon';
import '@vscode-elements/elements/dist/vscode-button';
import '@vscode-elements/elements/dist/vscode-single-select';
import '@vscode-elements/elements/dist/vscode-option';

defineProps<{
  tasks: string[]
  running: boolean
  stopping: boolean
}>();
defineEmits<{
  run: [step: RunStep]
  stop: []
}>();

const currentTask = defineModel<string>('currentTask');
</script>

<template>
  <div class="toolbar">
    <vscode-single-select
      :value="currentTask"
      :disabled="running || stopping"
      @change="currentTask = $event.srcElement.value"
    >
      <vscode-option v-for="s in tasks" :key="s">
        {{ s }}
      </vscode-option>
    </vscode-single-select>

    <vscode-button title="Compile" :disabled="running" @click="$emit('run', 'compile')">
      <IconExtensions />
    </vscode-button>
    <vscode-button title="Run" :disabled="running" @click="$emit('run', 'execute')">
      <IconDebugStart />
    </vscode-button>
    <vscode-button title="Compile & Run" :disabled="running" @click="$emit('run', 'compile-execute')">
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
