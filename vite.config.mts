import pluginVscode from '@tomjs/vite-plugin-vscode';
import pluginVue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    chunkSizeWarningLimit: Infinity,
  },

  envPrefix: ['RUNNER_'],

  plugins: [
    pluginVscode({ recommended: true }),
    pluginVue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag.startsWith('vscode-'),
        },
      },
    }),
  ],
});
