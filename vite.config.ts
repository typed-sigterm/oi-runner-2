import path from 'node:path';
import pluginTailwindcss from '@tailwindcss/vite';
import pluginVscode from '@tomjs/vite-plugin-vscode';
import pluginVue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    chunkSizeWarningLimit: Infinity,
  },

  plugins: [
    pluginVscode({ recommended: true }),
    pluginVue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag.startsWith('vscode-'),
        },
      },
    }),
    pluginTailwindcss(),
  ],

  envPrefix: ['RUNNER_'],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
