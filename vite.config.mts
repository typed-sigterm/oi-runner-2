import pluginVscode from '@tomjs/vite-plugin-vscode';
import pluginVue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    pluginVscode({
      recommended: true,
    }),
    pluginVue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag.startsWith('vscode-'),
        },
      },
    }),
  ],
});
