import pluginVscode from '@tomjs/vite-plugin-vscode';
import pluginVue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    chunkSizeWarningLimit: Infinity,
  },
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
