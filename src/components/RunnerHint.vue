<script lang="ts" setup>
import type { RunnerState } from '../utils';
import { IconCircleSlash, IconError } from '@iconify-prerendered/vue-codicon';
import { computed, ref } from 'vue';
import { postEvent } from '../utils';
import Spin from './Spin.vue';

const { type, state } = defineProps<{
  type: 'stdin' | 'stdout'
  state: RunnerState
}>();

const idle = ref(true);
const linkedFile = computed(() => state.cases[state.case][`${type}File`]);
function gotoRedirected() {
  linkedFile.value && postEvent({
    type: 'file:open-in-editor',
    path: linkedFile.value,
  });
}
</script>

<template>
  <template v-if="type === 'stdout'">
    <div v-if="state.hint === 'compile-failed'" class="mask run-failed">
      <IconError />
      Compilation failed
    </div>

    <div v-else-if="state.hint === 'execute-failed'" class="mask run-failed">
      <IconError />
      Execution failed
    </div>

    <div v-else-if="state.hint === 'cancelled'" class="mask run-failed">
      <IconCircleSlash />
      Run Cancelled
    </div>

    <Spin v-else-if="state.status === 'compiling'" class="mask">
      Compiling
    </Spin>

    <Spin v-else-if="state.status === 'excuting'" class="mask">
      Executing
    </Spin>

    <span v-else @vue:mounted="idle = true" @vue:unmounted="idle = false" />
  </template>

  <div v-if="idle && linkedFile" class="mask redirected">
    redirect
    {{ type === 'stdin' ? 'from' : 'to' }}
    <a :title="linkedFile" @click="gotoRedirected">file</a>
  </div>
</template>

<style scoped>
.mask {
  position: relative;
  top: calc(-50% - var(--spinner-size) / 2);
  left: 50%;
  transform: translate(-50%, 50%);
  height: 0; /* to prevent `.io-area` height changing when the mask is shown */
}

.mask > svg {
  font-size: 32px;
  overflow: visible; /* make icon visible */
  --spinner-size: 32px; /* correct alignment */
}

.run-failed {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.redirected {
  text-align: center;
  font-size: 24px;
}
</style>
