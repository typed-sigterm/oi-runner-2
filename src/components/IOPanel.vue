<script lang="ts" setup>
import type { IOFileChannel } from '../../shared/events';
import { VueMonacoDiffEditor, VueMonacoEditor } from '@guolao/vue-monaco-editor';
import { IconFileSymlinkFile } from '@iconify-prerendered/vue-codicon';
import { IconLoadingLoop } from '@iconify-prerendered/vue-line-md';
import * as monaco from 'monaco-editor';
import { computed, inject, ref, shallowRef, watchEffect } from 'vue';
import { readClipboard, selectFile, ThemeInjectKey, useFontSize } from '../utils';

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

const outputEditor = shallowRef<monaco.editor.IStandaloneCodeEditor>();
const diffEditor = shallowRef<monaco.editor.IStandaloneDiffEditor>();

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
    lightbulb: { enabled: monaco.editor.ShowLightbulbIconMode.Off },
    lineNumbersMinChars: 3,
    readOnly: props.readonly && !props.diff,
    renderGutterMenu: false,
    showFoldingControls: 'never',
  } satisfies monaco.editor.IEditorOptions & monaco.editor.IDiffEditorOptions,
}));

watchEffect(() => {
  const mp = monaco.Uri.parse(props.modelPath);
  outputEditor.value?.setModel(monaco.editor.getModel(mp) ?? monaco.editor.createModel('', undefined, mp));
  if (props.expectedModelPath) {
    const emp = monaco.Uri.parse(props.expectedModelPath);
    diffEditor.value?.setModel({
      original: monaco.editor.getModel(mp) ?? monaco.editor.createModel('', undefined, mp),
      modified: monaco.editor.getModel(emp) ?? monaco.editor.createModel('', undefined, emp),
    });
  }
});

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

function handleMount(editor: monaco.editor.IStandaloneCodeEditor) {
  outputEditor.value = editor;
  // Bridge clipboard paste through the extension host: in production VS Code
  // webviews Monaco's built-in paste fails because `navigator.clipboard.readText()`
  // requires `clipboard-read` permission that the prod webview lacks (see issue #26).
  // Only register on editable editors (Input panel); skip readonly / diff editors.
  if (props.readonly || props.diff)
    return;
  editor.addAction({
    id: 'oi-runner-2.clipboard.paste',
    label: 'Paste',
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV],
    run: async (ed) => {
      const text = await readClipboard();
      const sels = ed.getSelections();
      if (sels)
        ed.executeEdits('oi-runner-2.clipboard-paste', sels.map(range => ({ range, text, forceMoveMarkers: true })));
    },
  });
}

defineExpose({
  getContent() {
    if (!props.diff)
      return outputEditor.value?.getModel()?.getValue();
  },

  setContent(to: string) {
    diffEditor.value?.getModel()?.original.setValue(to);
    outputEditor.value?.setValue(to);
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
      @mount="handleMount"
    />

    <VueMonacoDiffEditor
      v-show="diff"
      v-bind="monacoProps"
      @mount="(e: any) => diffEditor = e"
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
  font-size: 16px;
  font-weight: normal;
  line-height: 16px;
  margin-bottom: 8px;
}

.tools {
  float: right;
  font-size: 18px;
  height: 20px;
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

  svg {
    display: inline;
    vertical-align: text-top;
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
