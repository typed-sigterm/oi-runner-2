<script setup lang="ts">
import type { EventMessage, TaskAttributes } from '../shared/events';
import type { RunnerState } from './utils';
import { nanoid } from 'nanoid';
import { computed, onMounted, provide, ref, useTemplateRef } from 'vue';
import { EventMarker } from '../shared/events';
import Empty from './components/Empty.vue';
import Loading from './components/Loading.vue';
import Runner from './components/Runner.vue';
import { logger, postEvent, ThemeInjectKey } from './utils';

provide(ThemeInjectKey, ref('dark' as const));

const runner = useTemplateRef('runner');
const loading = ref(true);
const states = new Map<string, RunnerState>();
const state = ref<RunnerState | undefined>();
const sourceDirty = ref(false);

const case_ = computed(() => state.value?.cases[state.value.case]);
const tasks = ref<TaskAttributes[]>([]);
const extensions = ref<string[]>([]);

window.addEventListener('message', (ev) => {
  if (ev.data[EventMarker] !== true)
    return;
  const data: EventMessage = ev.data;
  logger.debug('WebView received message:', data);

  const s = state.value!; // shorthand
  switch (data.type) {
    case 'setup':
      tasks.value = data.tasks;
      extensions.value = data.extensions;
      loading.value = false;
      break;

    case 'context:switch':
      if (states.has(data.file)) {
        state.value = states.get(data.file)!;
      } else {
        state.value = {
          id: nanoid(),
          file: data.file,
          task: data.defaultTask,
          status: 'idle',
          case: 0,
          cases: [{ id: nanoid() }],
        };
        states.set(data.file, state.value);
      }
      break;

    case 'context:rename': {
      const state = states.get(data.from);
      if (state) {
        states.delete(data.from);
        states.set(data.to, state);
      }
      break;
    }

    case 'context:state-changed':
      sourceDirty.value = data.isDirty;
      break;

    case 'context:redirect':
      runner.value?.redirect(data.channel);
      break;

    case 'run:compiled':
      s.status = data.skipExcuting ? 'idle' : 'excuting';
      break;

    case 'run:compile-failed':
      s.status = 'idle';
      s.hint = 'compile-failed';
      break;

    case 'run:executed':
      s.status = 'idle';
      if (data.stdout !== undefined) // Don't update if it's redirected to a file
        runner.value?.handleExecuteResult(data.stdout);
      case_.value!.exitCode = data.exitCode;
      case_.value!.duration = data.duration;
      break;

    case 'run:execute-failed':
      s.status = 'idle';
      s.hint = 'execute-failed';
      break;

    case 'run:killed':
      s.status = 'idle';
      s.hint = 'cancelled';
      break;
  }
});

let ready = false;
onMounted(() => {
  if (ready)
    return;
  ready = true;
  postEvent({ type: 'webview:ready' });
});
</script>

<template>
  <Loading v-if="loading" />
  <Runner v-else-if="state" ref="runner" :state :tasks :source-dirty />
  <Empty v-else :extensions />
</template>
