<script lang="ts" setup>
import type { IOChannel } from '../../shared/events';
import { VueMonacoEditor } from '@guolao/vue-monaco-editor';
import { IconFileSymlinkFile } from '@iconify-prerendered/vue-codicon';
import { IconLoadingLoop } from '@iconify-prerendered/vue-line-md';
import { computed, inject, ref } from 'vue';
import { selectFile, ThemeInjectKey, useFontSize } from '../utils';

const { disabled, disableRedirect } = defineProps<{
  title: string
  readonly?: boolean
  disabled?: boolean
  disableRedirect?: boolean
}>();

const emit = defineEmits<{
  linkFile: [to?: string]
}>();

defineSlots<{
  info: () => any
  extra: () => any
}>();

const value = defineModel<IOChannel>({ required: true });

const theme = inject(ThemeInjectKey);
const fontSize = useFontSize();

const isLinked = computed(() => typeof value.value === 'object');
const isLinking = ref(false);
async function linkFile() {
  if (disableRedirect)
    return;
  if (isLinked.value) { // unlink
    value.value = '';
    emit('linkFile');
  } else { // link
    isLinking.value = true;
    const file = await selectFile();
    if (file)
      value.value = { file };
    isLinking.value = false;
    emit('linkFile', file);
  }
}
</script>

<template>
  <div class="io-panel" :aria-disabled="disabled || typeof value === 'object'">
    <div>
      <h3>{{ title }}</h3>
      <slot name="info" />

      <a
        class="link-file"
        :title="isLinked ? 'Unlink File' : 'Link File'"
        :aria-selected="isLinked"
        :aria-disabled="disableRedirect"
        @click="linkFile"
      >
        <IconLoadingLoop v-if="isLinking" />
        <IconFileSymlinkFile v-else />
      </a>
    </div>

    <VueMonacoEditor
      class="monaco-editor"
      :value="typeof value === 'string' ? value : ''"
      :theme="theme === 'light' ? 'vs' : 'vs-dark'"
      :options="{
        automaticLayout: true,
        folding: false,
        fontSize,
        lineNumbersMinChars: 3,
        minimap: { enabled: false },
        readOnly: readonly,
      }"
      @update:value="value = $event"
    />

    <slot name="extra" />
  </div>
</template>

<style scoped>
.io-panel {
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;

  &:deep() .margin-view-overlays { /* hack */
    cursor: initial;
  }
}

h3 {
  display: inline-block;
  height: 16px;
  line-height: 16px;
  font-weight: normal;
  margin-top: 0;
  margin-bottom: 8px;
}

.link-file {
  float: right;
  font-size: 18px;
  color: var(--vscode-editor-foreground);
}

.link-file[aria-selected="true"] {
  color: var(--vscode-editorLink-activeForeground);
}

.io-panel[aria-disabled="true"] .monaco-editor {
  opacity: 0.3;
  overscroll-behavior: none;

  &:deep() * {
    pointer-events: none;
  }
}
</style>
