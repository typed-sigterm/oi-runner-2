<script lang="ts" setup>
import type { IOChannel } from '../../shared/events';
import { VueMonacoDiffEditor, VueMonacoEditor } from '@guolao/vue-monaco-editor';
import { IconFileSymlinkFile } from '@iconify-prerendered/vue-codicon';
import { IconLoadingLoop } from '@iconify-prerendered/vue-line-md';
import { editor } from 'monaco-editor';
import { computed, inject, ref, watch } from 'vue';
import { selectFile, ThemeInjectKey, useFontSize } from '../utils';

const props = defineProps<{
  title: string
  readonly?: boolean
  disabled?: boolean
  disableRedirect?: boolean
  diff?: boolean
}>();

const emit = defineEmits<{
  linkFile: [to?: string]
}>();

defineSlots<{
  info: () => any
  extra: () => any
  tools: () => any
}>();

const value = defineModel<IOChannel>({ required: true });
const diffValue = ref('');
watch(() => props.diff, (diff) => {
  if (diff) {
    if (typeof value.value !== 'string')
      value.value = '';
    diffValue.value = value.value;
  }
});

const theme = inject(ThemeInjectKey);
const fontSize = useFontSize();
const monacoProps = computed(() => ({
  class: 'monaco-editor',
  theme: theme === 'light' ? 'vs' : 'vs-dark',
  options: {
    automaticLayout: true,
    // compactMode: true,
    folding: false,
    fontSize: fontSize.value,
    lightbulb: { enabled: editor.ShowLightbulbIconMode.Off },
    lineNumbersMinChars: 3,
    readOnly: props.readonly && !props.diff,
    renderGutterMenu: false,
    showFoldingControls: 'never' as const,
  },
}));

const isLinked = computed(() => typeof value.value === 'object');
const isLinking = ref(false);
async function linkFile() {
  if (props.disableRedirect || props.diff) // @todo
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

defineExpose({
  redirect: linkFile,
});
</script>

<template>
  <div class="io-panel" :aria-disabled="disabled">
    <div>
      <h3>{{ title }}</h3>
      <slot name="info" />

      <div class="tools">
        <a
          class="link-file"
          :title="`${isLinked ? 'Unlink' : 'Link'} File`"
          :aria-selected="isLinked"
          :aria-disabled="disableRedirect || diff"
          @click="linkFile"
        >
          <IconLoadingLoop v-if="isLinking" />
          <IconFileSymlinkFile v-else />
        </a>
        <slot name="tools" />
      </div>
    </div>

    <VueMonacoDiffEditor
      v-if="diff"
      v-bind="monacoProps"
      v-model:modified="diffValue"
      :original="typeof value === 'string' ? value : ''"
    />

    <VueMonacoEditor
      v-else
      v-bind="monacoProps"
      :value="typeof value === 'string' ? value : ''"
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

.tools {
  float: right;
  font-size: 18px;
  color: var(--vscode-editor-foreground);
}

.tools:deep() {
  > a {
    color: unset;
  }

  > a[aria-selected="true"] {
    color: var(--vscode-editorLink-activeForeground);
  }
}

.io-panel[aria-disabled="true"] .monaco-editor {
  opacity: 0.3;
  overscroll-behavior: none;

  &:deep() * {
    pointer-events: none;
  }
}

/* Ensure diff editor takes full height */
.monaco-editor {
  flex-grow: 1;
  min-height: 100px; /* Or adjust as needed */
}
</style>
