<script setup lang="ts">
import type { EventMessage, TaskAttributes } from '../shared/events';
import type { RunnerState } from './utils';
import { onMounted, provide, ref } from 'vue';
import { EventMarker } from '../shared/events';
import Empty from './components/Empty.vue';
import Loading from './components/Loading.vue';
import Runner from './components/Runner.vue';
import { logger, postEvent, ThemeInjectKey } from './utils';

provide(ThemeInjectKey, 'dark');

const loading = ref(true);
const states = new Map<string, RunnerState>();
const state = ref<RunnerState | undefined>();
const sourceDirty = ref(false);

const tasks = ref<TaskAttributes[]>([]);
const extensions = ref<string[]>([]);

window.addEventListener('message', (ev) => {
  if (ev.data[EventMarker] !== true)
    return;
  const data: EventMessage = ev.data;
  logger.debug('WebView received message:', data);

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
          file: data.file,
          task: data.defaultTask,
          status: 'idle',
          stdin: '',
          stdout: '',
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

    case 'run:compiled':
      state.value!.status = data.skipExcuting ? 'idle' : 'excuting';
      break;

    case 'run:compile-failed':
      state.value!.status = 'idle';
      state.value!.hint = 'compile-failed';
      break;

    case 'run:executed':
      state.value!.status = 'idle';
      if (data.stdout !== undefined) // Don't update if it's redirected to a file
        state.value!.stdout = data.stdout;
      state.value!.exitCode = data.exitCode;
      state.value!.duration = data.duration;
      break;

    case 'run:execute-failed':
      state.value!.status = 'idle';
      state.value!.hint = 'execute-failed';
      break;

    case 'run:killed':
      state.value!.status = 'idle';
      state.value!.hint = 'cancelled';
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
  <Runner v-else-if="state" :state :tasks :source-dirty />
  <Empty v-else :extensions />
</template>

<style>
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  user-select: none;

  /* @todo This is not a good practice, but I can't find a better way to do it */
  --spinner-size: 40px;
}

a {
  cursor: pointer;
}

a[aria-disabled="true"] {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
