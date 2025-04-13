import type { InjectionKey } from 'vue';
import type { EventMessage, IOChannel } from '../shared/events';
import Consola, { LogLevels } from 'consola/browser';
import { ref } from 'vue';
import { EventMarker } from '../shared/events';

export const logger = Consola.withTag('OI Runner++');
logger.options.level = import.meta.env.DEV ? LogLevels.verbose : LogLevels.info;

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

/**
 * @returns Reactive current font size of the editor.
 */
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

export type RunnerStatus = 'idle' | 'compiling' | 'excuting' | 'cancelling';
export type RunnerHint = 'compile-failed' | 'execute-failed' | 'cancelled';
export interface RunnerState {
  file: string
  task: string
  status: RunnerStatus
  stdin: IOChannel
  stdout: IOChannel
  exitCode?: number
  duration?: number
  hint?: RunnerHint
}

/**
 * Ask user to select one file.
 * @returns Resolves the selected file path, or `undefined` if cancelled.
 */
export function selectFile() {
  return new Promise<string | undefined>((resolve) => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type !== 'file:selected')
        return;
      window.removeEventListener('message', handleMessage);
      resolve(event.data.path);
    };
    postEvent({ type: 'file:select' });
    window.addEventListener('message', handleMessage);
  });
}
