<script setup lang="ts">
import type { EventMessage, TaskAttributes } from '../shared/events';
import type { RunnerState } from './components/Runner.vue';
import { onMounted, provide, readonly, ref } from 'vue';
import { EventMarker } from '../shared/events';
import Runner from './components/Runner.vue';
import { consola, postEvent, ThemeInjectKey } from './utils';

provide(ThemeInjectKey, 'dark');

const DefaultState = readonly<RunnerState>({
  file: '',
  task: '',
  status: 'idle',
  stdin: '',
  stdout: '',
});
const states = new Map<string, RunnerState>();
const currentState = ref<RunnerState>({ ...DefaultState });

const tasks = ref<TaskAttributes[]>([]);

window.addEventListener('message', (ev) => {
  if (ev.data[EventMarker] !== true)
    return;
  const data: EventMessage = ev.data;
  consola.debug('WebView received message:', data);
  switch (data.type) {
    case 'config':
      tasks.value = data.tasks;
      break;
    case 'context:switch':
      if (states.has(data.file)) {
        currentState.value = states.get(data.file)!;
      } else {
        currentState.value = {
          ...DefaultState,
          file: data.file,
          task: tasks.value[0].name,
        };
        states.set(data.file, currentState.value);
      }
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
  <Runner :state="currentState" :tasks />
</template>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  user-select: none;
}
</style>
