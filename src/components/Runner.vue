<script lang="ts" setup>
import type { RunStep, TaskAttributes } from '../../shared/events';
import type { RunnerState } from '../utils';
import { ref, toRaw, watch } from 'vue';
import { postEvent } from '../utils';
import IOPanel from './IOPanel.vue';
import RunnerHint from './RunnerHint.vue';
import Toolbar from './Toolbar.vue';

const { state } = defineProps<{
  state: RunnerState
  tasks: TaskAttributes[]
  sourceDirty: boolean
}>();

// Use `ref` instead of `computed`, because `computed` is always batched, but
// `postEvent` sometimes takes a long time, UI updates need to be prioritized
const toolbarStatus = ref<'idle' | 'running' | 'disabled' | 'cancelling'>('disabled');
watch(() => [state.file, state.status], ([file, status]) => {
  if (!file)
    toolbarStatus.value = 'disabled';
  else if (status === 'cancelling')
    toolbarStatus.value = 'cancelling';
  else if (status === 'idle')
    toolbarStatus.value = 'idle';
  else
    toolbarStatus.value = 'running';
}, {
  immediate: true,
  flush: 'sync',
});

async function run(step: RunStep) {
  if (state.task === undefined || state.file === undefined)
    return;
  if (step === 'execute')
    state.status = 'excuting';
  else
    state.status = 'compiling';
  state.hint = state.duration = state.exitCode = undefined;
  toolbarStatus.value = 'running';

  // Note that some properties are `reactive`, which cannot be `structuredClone` or `postMessage`.
  // So we need to convert them back to raw
  postEvent({
    type: 'run:launch',
    file: state.file,
    task: state.task,
    step,
    stdin: toRaw(state.stdin),
    stdout: typeof state.stdout === 'object' ? toRaw(state.stdout) : undefined,
  });
}
function cancel() {
  state.status = 'cancelling';
  postEvent({
    type: 'run:kill',
    file: state.file,
  });
}
</script>

<template>
  <Toolbar
    v-model:current-task="state.task"
    :tasks
    :status="toolbarStatus"
    :source-file="state.file"
    :source-dirty
    @run="run"
    @cancel="cancel"
  />

  <div class="io-area">
    <IOPanel
      v-model="state.stdin"
      title="Input"
      :disabled="!state.file"
    >
      <template #extra>
        <RunnerHint type="stdin" :state />
      </template>
    </IOPanel>

    <IOPanel
      v-model="state.stdout"
      title="Output"
      readonly
      :disabled="state.status !== 'idle' || !!state.hint || !state.file"
    >
      <template v-if="state.duration !== undefined" #info>
        <span class="exit-info">
          Exited with code {{ state.exitCode }} in {{ state.duration / 1000 }}s
        </span>
      </template>

      <template #extra>
        <RunnerHint type="stdout" :state />
      </template>
    </IOPanel>
  </div>
</template>

<style scoped>
.io-area {
  display: grid;
  flex: 1;
  align-items: stretch;
  grid-template-rows: 1fr 1fr;
  height: 0;
}

.exit-info {
  color: var(--vscode-descriptionForeground);
  margin-left: 8px;
}
</style>
