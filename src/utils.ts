import type { InjectionKey } from 'vue';
import Consola, { LogLevels } from 'consola/browser';
import { ref } from 'vue';
import { EventMarker, type EventMessage } from '../shared/events';

export const logger = Consola.withTag('OI Runner++');
logger.options.level = import.meta.env.DEV ? LogLevels.debug : LogLevels.info;

export const vscode = acquireVsCodeApi();

export function postEvent(message: EventMessage) {
  vscode.postMessage({
    ...message,
    [EventMarker]: true,
  });
}

export type Theme = 'dark' | 'light';
export const ThemeInjectKey: InjectionKey<Theme> = Symbol('theme');

const fontSize = ref(0);
let fontSizeInitialized = false;
function refreshFontSize() {
  const root = document.documentElement;
  const value = getComputedStyle(root).getPropertyValue('--vscode-editor-font-size');
  const size = Number(value.replace('px', ''));
  if (!Number.isNaN(size))
    fontSize.value = size;
}

export function useFontSize() {
  if (!fontSizeInitialized) {
    fontSizeInitialized = true;
    new MutationObserver(refreshFontSize).observe(
      document.documentElement,
      { attributes: true, attributeFilter: ['style'] },
    );
    refreshFontSize();
  }
  return fontSize;
}
