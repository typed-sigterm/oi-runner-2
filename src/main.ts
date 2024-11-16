import { install as pluginMonacoEditor } from '@guolao/vue-monaco-editor';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);
app.use(pluginMonacoEditor, {
  monaco,
});
app.mount('#app');
