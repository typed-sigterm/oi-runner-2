<script lang="ts" setup>
import type { RunStep } from '../../shared/events';
import { IconError } from '@iconify-prerendered/vue-codicon';
import { computed, onMounted, ref } from 'vue';
import { consola, postEvent } from '../utils';
import IOPanel from './IOPanel.vue';
import Spin from './Spin.vue';
import Toolbar from './Toolbar.vue';

export type RunnerStatus = 'idle' | 'compiling' | 'excuting' | 'stopping';
export type RunnerHint = 'compile-failed' | 'execute-failed';
export interface RunnerState {
  file: string
  task: string
  status: RunnerStatus
  stdin: string
  stdout: string
  exitCode?: number
  duration?: number
  hint?: RunnerHint
}

const { state } = defineProps<{
  state: RunnerState
  tasks: string[]
}>();
const running = computed(() => state.status !== 'idle');
const stopping = computed(() => state.status === 'stopping');

const ioArea = ref<HTMLDivElement | null>(null);

const ioPanelHeight = ref('45vh');
const resizeHistory: number[] = [];
const resizeLimit = { repeat: 5, interval: 500 };
onMounted(() => {
  const observer = new ResizeObserver(() => {
    if (!ioArea.value)
      return;
    const value = `${ioArea.value.clientHeight / 2}px`;
    if (ioPanelHeight.value === value) // if not changed, don't trigger throttle
      return;
    ioPanelHeight.value = value;
    consola.debug('Panel resized to:', value);

    // Throttle: avoid infinite resize loop
    resizeHistory.push(Date.now());
    if (resizeHistory.length > resizeLimit.repeat)
      resizeHistory.splice(0, resizeHistory.length - resizeLimit.repeat);
    if (resizeHistory.length === resizeLimit.repeat
      && Date.now() - resizeHistory[0] <= resizeLimit.interval) {
      observer.disconnect();
      consola.error('Resize too frequently, stopped.');
    }
  });
  observer.observe(ioArea.value!);
});

function handleRun(step: RunStep) {
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
function handleStop() {
  state.status = 'stopping';
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
    :running
    :stopping
    @run="handleRun"
    @stop="handleStop"
  />

  <div ref="ioArea" class="io-area">
    <IOPanel v-model="state.stdin" title="Input" />
    <IOPanel
      v-model="state.stdout"
      title="Output"
      readonly
      :disabled="running || !!state.hint"
    >
      <template v-if="state.duration !== undefined" #info>
        <span class="exit-info">
          Exited with code {{ state.exitCode }} in {{ state.duration / 1000 }}s
        </span>
      </template>
      <template #extra>
        <div v-if="state.hint" class="stdout-mask run-failed">
          <IconError style="font-size: 32px;" />
          {{ state.hint === 'compile-failed' ? 'Compilation failed' : 'Execution failed' }}
        </div>
        <Spin v-else-if="running" class="stdout-mask">
          {{ state.status === 'compiling' ? 'Compiling...' : 'Excuting...' }}
        </Spin>
      </template>
    </IOPanel>
  </div>
</template>

<style scoped>
.io-area {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
}

.io-area > * {
  height: v-bind(ioPanelHeight);
}

.exit-info {
  color: var(--vscode-descriptionForeground);
  margin-left: 8px;
}

.stdout-mask {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: calc(v-bind(ioPanelHeight) / 2) auto;
}
.run-failed {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
