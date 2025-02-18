<script setup lang="ts">
import type { EventMessage, TaskAttributes } from '../shared/events';
import type { RunnerState } from './utils';
import { onMounted, provide, readonly, ref } from 'vue';
import { EventMarker } from '../shared/events';
import Runner from './components/Runner.vue';
import { logger, postEvent, ThemeInjectKey } from './utils';

provide(ThemeInjectKey, 'dark');

const DefaultState = readonly<RunnerState>({
  status: 'idle',
  stdin: '',
  stdout: '',
});

const states = new Map<string, RunnerState>();
const currentState = ref<RunnerState>({ ...DefaultState });
const sourceDirty = ref(false);

const tasks = ref<TaskAttributes[]>([]);

window.addEventListener('message', (ev) => {
  if (ev.data[EventMarker] !== true)
    return;
  const data: EventMessage = ev.data;
  logger.debug('WebView received message:', data);

  switch (data.type) {
    case 'setup':
      tasks.value = data.tasks;
      break;

    case 'context:switch':
      if (states.has(data.file)) {
        currentState.value = states.get(data.file)!;
      } else {
        currentState.value = {
          ...DefaultState,
          file: data.file,
          task: data.defaultTask,
        };
        states.set(data.file, currentState.value);
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
      currentState.value.status = data.skipExcuting ? 'idle' : 'excuting';
      break;

    case 'run:compile-failed':
      currentState.value.status = 'idle';
      currentState.value.hint = 'compile-failed';
      break;

    case 'run:executed':
      currentState.value.status = 'idle';
      if (data.stdout !== undefined) // Don't update if it's redirected to a file
        currentState.value.stdout = data.stdout;
      currentState.value.exitCode = data.exitCode;
      currentState.value.duration = data.duration;
      break;

    case 'run:execute-failed':
      currentState.value.status = 'idle';
      currentState.value.hint = 'execute-failed';
      break;

    case 'run:killed':
      currentState.value.status = 'idle';
      currentState.value.hint = 'cancelled';
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
  <Runner :state="currentState" :tasks :source-dirty />
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
