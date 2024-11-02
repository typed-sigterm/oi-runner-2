<script lang="ts" setup>
import type { RunStep, TaskAttributes } from '../../shared/events';
import { IconError } from '@iconify-prerendered/vue-codicon';
import { computed } from 'vue';
import { postEvent } from '../utils';
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
}>();
const toolbarStatus = computed(() => {
  if (!state.file)
    return 'disabled';
  if (state.status === 'cancelling')
    return 'cancelling';
  if (state.status === 'idle')
    return 'idle';
  return 'running';
});

function handleRun(step: RunStep) {
  if (state.task === undefined || state.file === undefined)
    return;
  if (step === 'execute')
    state.status = 'excuting';
  else
    state.status = 'compiling';
  state.hint = state.duration = state.exitCode = undefined;

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
    @run="handleRun"
    @cancel="handleCancel"
  />

  <div class="io-area">
    <IOPanel v-model="state.stdin" title="Input" />

    <IOPanel
      v-model="state.stdout"
      title="Output"
      readonly
      :disabled="state.status !== 'idle' || !!state.hint"
    >
      <template v-if="state.duration !== undefined" #info>
        <span class="exit-info">
          Exited with code {{ state.exitCode }} in {{ state.duration / 1000 }}s
        </span>
      </template>

      <template #extra>
        <div v-if="state.hint === 'compile-failed'" class="stdout-mask run-failed">
          <IconError style="font-size: 32px;" />
          Compilation failed
        </div>
        <div v-else-if="state.hint === 'execute-failed'" class="stdout-mask run-failed">
          <IconError style="font-size: 32px;" />
          Execution failed
        </div>
        <div v-else-if="state.hint === 'cancelled'" class="stdout-mask run-failed">
          <IconCircleSlash style="font-size: 32px;" />
          Run Cancelled
        </div>
        <Spin v-else-if="state.status === 'compiling'" class="stdout-mask">
          Compiling...
        </Spin>
        <Spin v-else-if="state.status === 'excuting'" class="stdout-mask">
          Executing...
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
  gap: 8px;
}

.exit-info {
  color: var(--vscode-descriptionForeground);
  margin-left: 8px;
}

.stdout-mask {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 50% auto;
}

.run-failed {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
