<script lang="ts" setup>
import type { RunStep, TaskAttributes } from '../../shared/events';
import type { RunnerCase, RunnerState } from '../utils';
import { IconDiffSingle } from '@iconify-prerendered/vue-codicon';
import { nanoid } from 'nanoid';
import { computed, ref, toRaw, useTemplateRef, watch } from 'vue';
import { logger, postEvent } from '../utils';
import IOPanel from './IOPanel.vue';
import RunnerHint from './RunnerHint.vue';
import Sidebar from './Sidebar.vue';
import Toolbar from './Toolbar.vue';
import type { ProblemIOSample } from 'un-oj';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

const { state } = defineProps<{
  state: RunnerState
  tasks: TaskAttributes[]
  sourceDirty: boolean
}>();

const stdin = useTemplateRef('stdin'), stdout = useTemplateRef('stdout');
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
    stdin: stdin.value?.getFileChannel() ?? stdin.value?.getContent(),
    stdout: stdout.value?.getFileChannel(),
  });
}

function cancel() {
  state.status = 'cancelling';
  postEvent({
    type: 'run:kill',
    file: state.file,
  });
}

function updateModel(path: string, content: string) {
  const p = monaco.Uri.parse(path);
  const model = monaco.editor.getModel(p);
  if (!model)
    monaco.editor.createModel(content, undefined, p);
  else
    model.setValue(content);
}

function handleAdd(sample?: ProblemIOSample) {
  const case_: RunnerCase = { id: nanoid(), diff: !!sample };
  state.case = state.cases.push(case_) - 1;
  if (sample) {
    updateModel(`inmemory://stdin/${case_.id}`, sample.input);
    updateModel(`inmemory://expected/${case_.id}`, sample.output);
  }
  logger.log(toRaw(state.cases));
}

function handleRemove(index: number) {
  state.cases.splice(index, 1);
  if (state.case > index)
    state.case--;
  logger.log(toRaw(state.cases));
}

defineExpose({
  redirect(channel: 'stdin' | 'stdout') {
    return channel === 'stdin'
      ? stdin.value?.requestLinkFile()
      : stdout.value?.requestLinkFile();
  },

  handleExecuteResult(result: string) {
    stdout.value?.setContent(result);
  },
});
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
        ref="stdin"
        v-model:linked-file="case_.stdinFile"
        title="Input"
        :model-path="`inmemory://stdin/${case_.id}`"
        :disabled="state.status !== 'idle' || !!case_.stdinFile"
        :disable-redirect="state.status !== 'idle'"
      >
        <template #extra>
          <RunnerHint type="stdin" :state />
        </template>
      </IOPanel>

      <IOPanel
        ref="stdout"
        v-model:linked-file="case_.stdoutFile"
        title="Output"
        :model-path="`inmemory://stdout/${case_.id}`"
        readonly
        :disabled="state.status !== 'idle' || !!state.hint || !!case_.stdoutFile"
        :disable-redirect="state.status !== 'idle'"
        :diff="case_.diff"
        :expected-model-path="`inmemory://expected/${case_.id}`"
      >
        <template v-if="case_.duration !== undefined" #info>
          <span class="exit-info">
            Exited with code {{ case_.exitCode }} in {{ case_.duration / 1000 }}s
          </span>
        </template>

        <template #extra>
          <RunnerHint type="stdout" :state />
        </template>

        <template #tools>
          <a
            :title="`${case_.diff ? 'Disable' : 'Enable'} Diff`"
            :aria-selected="case_.diff"
            :aria-disabled="!!case_.stdoutFile"
            @click="!case_.stdoutFile && (case_.diff = !case_.diff)"
          >
            <IconDiffSingle />
          </a>
        </template>
      </IOPanel>
    </div>

    <Sidebar
      :state
      :disabled="state.status !== 'idle'"
      @switch="(to) => state.case = to"
      @add="handleAdd"
      @remove="handleRemove"
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
