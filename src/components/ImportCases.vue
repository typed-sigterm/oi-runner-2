<script lang="ts">
import type { ProblemIOSample } from 'un-oj';
import type { OJ } from '../../shared/events';
import { IconCloudAltDownloadFilled, IconLoadingLoop, IconQuestionCircle } from '@iconify-prerendered/vue-line-md';
import { ref, watch } from 'vue';
import { postEvent, waitEvent } from '../utils';
import OJSelector from './OJSelector.vue';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export interface ImportedCase {
  input: string
  expected: string
}

const PROBLEM_EXAMPLE: Record<OJ, string> = {
  Codeforces: '2050E',
  AtCoder: 'abc403_a',
  Hydro: 'H1026',
  LeetCode: 'two-sum',
  Luogu: 'P2573',
  LibreOJ: '1',
  MXOJ: 'A1',
};
</script>

<script setup lang="ts">
const emit = defineEmits<{
  import: [cases: ProblemIOSample[]]
  reportIssue: []
}>();

const selecting = ref(false);
const source = ref<{
  oj: OJ | undefined
  problem: string
}>({ oj: undefined, problem: '' });
watch(selecting, (v) => {
  if (v)
    source.value = { oj: undefined, problem: '' };
});

const importing = ref(false);
async function handleImport() {
  importing.value = true;
  postEvent({
    type: 'oj:fetch-samples',
    provider: source.value.oj!,
    problem: source.value.problem,
  });
  const res = await waitEvent('oj:samples-fetched');
  if (res.samples) {
    emit('import', res.samples);
    selecting.value = importing.value = false;
  }
}

const reportIssue = () => postEvent({ type: 'file:open-url', url: 'https://github.com/un-oj/core' });
</script>

<template>
  <Dialog v-model:open="selecting" modal>
    <DialogTrigger as-child>
      <li
        v-bind="$attrs"
        title="Import from OJ"
        role="tab"
        @click="selecting = true"
      >
        <IconCloudAltDownloadFilled />
      </li>
    </DialogTrigger>

    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          Import Cases from OJ
        </DialogTitle>
      </DialogHeader>

      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-5 items-center gap-4">
          <Label class="justify-end">
            Provider
          </Label>

          <div class="col-span-4 flex items-center gap-2">
            <OJSelector v-model="source.oj" />
            <Tooltip>
              <TooltipTrigger>
                <IconQuestionCircle class="text-base" @click="reportIssue" />
              </TooltipTrigger>
              <TooltipContent side="bottom">
                This feature is backed by UnOJ.
                <br>
                If you find any issues, click the icon to report.
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div class="grid grid-cols-5 items-center gap-4">
          <Label class="justify-end">
            Problem
          </Label>
          <Input
            v-model="source.problem"
            class="col-span-4"
            :placeholder="source.oj ? PROBLEM_EXAMPLE[source.oj] : ''"
          />
        </div>
      </div>

      <DialogFooter>
        <Button
          :disabled="importing || !source.oj || !source.problem"
          @click="handleImport"
        >
          <IconLoadingLoop v-if="importing" />
          Import
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
