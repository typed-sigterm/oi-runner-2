import { install as pluginMonacoEditor } from '@guolao/vue-monaco-editor';
import mixpanel from 'mixpanel-browser';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { createApp } from 'vue';
import App from './App.vue';
import './main.css';
import './tailwind.css';
import '@vscode/codicons/dist/codicon.css';

const token = import.meta.env.RUNNER_MIXPANEL_TOKEN;
if (token)
  mixpanel.init(token);

createApp(App)
  .use(pluginMonacoEditor, { monaco })
  .mount('#app');
