<script lang="ts" setup>
import type { RunStep, TaskAttributes } from '../../shared/events';
import { IconError } from '@iconify-prerendered/vue-codicon';
import { ref, watch } from 'vue';
import { logger, postEvent } from '../utils';
import IconCircleSlash from './icon/CircleSlash.vue';
import IOPanel from './IOPanel.vue';
import Spin from './Spin.vue';
import Toolbar from './Toolbar.vue';

export type RunnerStatus = 'idle' | 'compiling' | 'excuting' | 'cancelling';
export type RunnerHint = 'compile-failed' | 'execute-failed' | 'cancelled';
export interface RunnerState {
  file?: string
  task?: string
  status: RunnerStatus
  stdin: string
  stdout: string
  exitCode?: number
  duration?: number
  hint?: RunnerHint
}

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

async function handleRun(step: RunStep) {
  logger.debug('Run', step);
  if (state.task === undefined || state.file === undefined)
    return;
  if (step === 'execute')
    state.status = 'excuting';
  else
    state.status = 'compiling';
  state.hint = state.duration = state.exitCode = undefined;
  toolbarStatus.value = 'running';

  postEvent({
    type: 'run:launch',
    file: state.file,
    task: state.task,
    step,
    stdin: state.stdin,
  });
}
function handleCancel() {
  state.status = 'cancelling';
  postEvent({
    type: 'run:kill',
    file: state.file!,
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
    @run="handleRun"
    @cancel="handleCancel"
  />

  <div class="io-area">
    <IOPanel
      v-model="state.stdin"
      title="Input"
      :disabled="!state.file"
    />

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
        <div v-if="state.hint === 'compile-failed'" class="stdout-mask run-failed">
          <IconError />
          Compilation failed
        </div>
        <div v-else-if="state.hint === 'execute-failed'" class="stdout-mask run-failed">
          <IconError />
          Execution failed
        </div>
        <div v-else-if="state.hint === 'cancelled'" class="stdout-mask run-failed">
          <IconCircleSlash />
          Run Cancelled
        </div>
        <Spin v-else-if="state.status === 'compiling'" class="stdout-mask">
          Compiling
        </Spin>
        <Spin v-else-if="state.status === 'excuting'" class="stdout-mask">
          Executing
        </Spin>
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

.stdout-mask {
  position: relative;
  top: calc(-50% - var(--spinner-size) / 2);
  left: 50%;
  transform: translate(-50%, 50%);
  height: 0; /* to prevent `.io-area` height changing when the mask is shown */
}

.stdout-mask > svg {
  font-size: 32px;
  overflow: visible; /* make icon visible */
  --spinner-size: 32px; /* correct alignment */
}

.run-failed {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
