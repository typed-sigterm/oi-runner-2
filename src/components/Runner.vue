<script lang="ts" setup>
import type { RunStep, TaskAttributes } from '../../shared/events';
import type { RunnerState } from '../utils';
import { computed, ref, toRaw, watch } from 'vue';
import { postEvent } from '../utils';
import IOPanel from './IOPanel.vue';
import RunnerHint from './RunnerHint.vue';
import Toolbar from './Toolbar.vue';
import Sidebar from './Sidebar.vue';

const { state } = defineProps<{
  state: RunnerState
  tasks: TaskAttributes[]
  sourceDirty: boolean
}>();

const case_ = computed(() => state.cases[state.case]);

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
  state.hint = case_.value.duration = case_.value.exitCode = undefined;
  toolbarStatus.value = 'running';

  // Note that some properties are `reactive`, which cannot be `structuredClone` or `postMessage`.
  // So we need to convert them back to raw
  postEvent({
    type: 'run:launch',
    file: state.file,
    task: state.task,
    step,
    stdin: toRaw(case_.value.stdin),
    stdout: typeof case_.value.stdout === 'object'
      ? toRaw(case_.value.stdout)
      : undefined,
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

  <main>
    <div class="io-area">
      <IOPanel
        v-model="case_.stdin"
        title="Input"
        :disabled="state.status !== 'idle'"
        :disable-redirect="state.status !== 'idle'"
      >
        <template #extra>
          <RunnerHint type="stdin" :state />
        </template>
      </IOPanel>

      <IOPanel
        v-model="case_.stdout"
        title="Output"
        readonly
        :disabled="state.status !== 'idle' || !!state.hint"
        :disable-redirect="state.status !== 'idle'"
      >
        <template v-if="case_.duration !== undefined" #info>
          <span class="exit-info">
            Exited with code {{ case_.exitCode }} in {{ case_.duration / 1000 }}s
          </span>
        </template>

        <template #extra>
          <RunnerHint type="stdout" :state />
        </template>
      </IOPanel>
    </div>

    <Sidebar
      :state
      :disabled="state.status !== 'idle'"
      @switch="(to) => state.case = to"
      @add="state.cases.push({ stdin: '', stdout: '' })"
    />
  </main>
</template>

<style scoped>
main {
  display: flex;
  height: 100%;
  gap: 4px;
}

.io-area {
  display: grid;
  align-items: stretch;
  grid-template-rows: 1fr 1fr;
  height: 100%;
  flex: 1;
}

.exit-info {
  color: var(--vscode-descriptionForeground);
  margin-left: 8px;
}
</style>
