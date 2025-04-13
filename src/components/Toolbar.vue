<script lang="ts" setup>
import type { RunStep, TaskAttributes } from '../../shared/events';
import {
  IconDebugStart,
  IconDebugStop,
  IconExtensions,
  IconFileCode,
  IconRunAll,
} from '@iconify-prerendered/vue-codicon';
import { computed } from 'vue';
import { postEvent } from '../utils';
import '@vscode-elements/elements/dist/vscode-badge';
import '@vscode-elements/elements/dist/vscode-button';
import '@vscode-elements/elements/dist/vscode-option';
import '@vscode-elements/elements/dist/vscode-single-select';

export type ToolbarStatus = 'idle' | 'disabled' | 'running' | 'cancelling';

const props = defineProps<{
  tasks: TaskAttributes[]
  status: ToolbarStatus
  sourceFile?: string
  sourceDirty: boolean
}>();
defineEmits<{
  run: [step: RunStep]
  cancel: []
  gotoSource: []
}>();

const currentTask = defineModel<string>('currentTask', { required: false });
const currentTaskCompilable = computed(() => {
  const task = props.tasks.find(t => t.name === currentTask.value);
  // If task is not found, the webview is not ready, so treat it as compilable by default
  return !task || task.compilable;
});

function gotoSource() {
  postEvent({
    type: 'file:open-in-editor',
    path: props.sourceFile!,
  });
}
</script>

<template>
  <header>
    <a v-if="sourceFile" class="source-link" :title="sourceFile" @click="gotoSource">
      <IconFileCode />
      Source File
      <vscode-badge v-if="sourceDirty">unsaved</vscode-badge>
    </a>

    <vscode-single-select
      :value="currentTask"
      :disabled="status !== 'idle'"
      @change="currentTask = $event.srcElement.value"
    >
      <vscode-option v-for="task in tasks" :key="task">
        {{ task.name }}
      </vscode-option>
    </vscode-single-select>

    <vscode-button
      v-if="currentTaskCompilable"
      title="Compile"
      :disabled="status !== 'idle'"
      @click="$emit('run', 'compile')"
    >
      <IconExtensions />
    </vscode-button>

    <vscode-button
      title="Run"
      :disabled="status !== 'idle'"
      @click="$emit('run', 'execute')"
    >
      <IconDebugStart />
    </vscode-button>

    <vscode-button
      v-if="currentTaskCompilable"
      title="Compile & Run"
      :disabled="status !== 'idle'"
      @click="$emit('run', 'compile-execute')"
    >
      <IconRunAll />
    </vscode-button>

    <vscode-button
      :style="{ cursor: status === 'cancelling' ? 'progress' : undefined }"
      title="Stop"
      :disabled="status !== 'running'"
      @click="$emit('cancel')"
    >
      <IconDebugStop />
    </vscode-button>
  </header>
</template>

<style scoped>
header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: 8px 0;
}

.source-link {
  height: 20px;
  margin-right: auto;
}

.source-link > svg {
  width: 16px;
  height: 16px;
  vertical-align: text-bottom;
}

vscode-badge {
  margin-left: 2px;
}

vscode-single-select {
  width: 10em;
  margin-right: 8px;
}

vscode-button {
  --vscode-button-background: transparent;
  --vscode-button-hoverBackground: rgba(90, 93, 94, 0.31);
  border: none;
  padding: 4px;
  font-size: medium;
  width: 16px;
  margin: 0 2px;
}

vscode-button::slotted {
  margin: 0;
}
</style>
