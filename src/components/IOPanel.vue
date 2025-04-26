<script lang="ts" setup>
import type { IOFileChannel } from '../../shared/events';
import { VueMonacoDiffEditor, VueMonacoEditor } from '@guolao/vue-monaco-editor';
import { IconFileSymlinkFile } from '@iconify-prerendered/vue-codicon';
import { IconLoadingLoop } from '@iconify-prerendered/vue-line-md';
import { editor } from 'monaco-editor/esm/vs/editor/editor.api';
import { computed, inject, ref, shallowRef } from 'vue';
import { selectFile, ThemeInjectKey, useFontSize } from '../utils';

const props = defineProps<{
  modelPath: string
  title: string
  readonly?: boolean
  disabled?: boolean
  disableRedirect?: boolean
  diff?: boolean
  expectedModelPath?: string
}>();

defineSlots<{
  info: () => any
  extra: () => any
  tools: () => any
}>();

const linkedFile = defineModel<string | undefined>('linkedFile');

const codeEditor = shallowRef<editor.IStandaloneCodeEditor>();
const diffEditor = shallowRef<editor.IStandaloneDiffEditor>();

const theme = inject(ThemeInjectKey);
const fontSize = useFontSize();
const monacoProps = computed(() => ({
  class: 'monaco-editor',
  theme: theme?.value === 'light' ? 'vs' : 'vs-dark',
  options: {
    automaticLayout: true,
    compactMode: true,
    folding: false,
    fontSize: fontSize.value,
    lightbulb: { enabled: editor.ShowLightbulbIconMode.Off },
    lineNumbersMinChars: 3,
    readOnly: props.readonly && !props.diff,
    renderGutterMenu: false,
    showFoldingControls: 'never' as const,
  },
}));

const isLinking = ref(false);
async function linkFile() {
  if (props.disableRedirect || props.diff) // @todo
    return;

  if (linkedFile.value) { // unlink
    linkedFile.value = undefined;
  } else { // link
    isLinking.value = true;
    linkedFile.value = await selectFile();
    isLinking.value = false;
  }
}

defineExpose({
  getContent() {
    if (!props.diff)
      return codeEditor.value?.getModel()?.getValue();
  },

  setContent(to: string) {
    diffEditor.value?.getModel()?.original.setValue(to);
    codeEditor.value?.setValue(to);
  },

  requestLinkFile: linkFile,
  getFileChannel(): IOFileChannel | undefined {
    if (linkedFile.value)
      return { file: linkedFile.value };
  },
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
          :title="`${linkedFile ? 'Unlink' : 'Link'} File`"
          :aria-selected="!!linkedFile"
          :aria-disabled="disableRedirect || diff"
          @click="linkFile"
        >
          <IconLoadingLoop v-if="isLinking" />
          <IconFileSymlinkFile v-else />
        </a>
        <slot name="tools" />
      </div>
    </div>

    <VueMonacoEditor
      v-show="!diff"
      v-bind="monacoProps"
      :path="modelPath"
      @mount="e => codeEditor = e"
    />

    <VueMonacoDiffEditor
      v-show="diff"
      v-bind="monacoProps"
      :original-model-path="modelPath"
      :modified-model-path="expectedModelPath"
      @mount="e => diffEditor = e"
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

  > a[aria-disabled="true"] {
    cursor: not-allowed;
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
