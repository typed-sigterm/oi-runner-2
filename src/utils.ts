import type { InjectionKey, Ref } from 'vue';
import type { EventMessage } from '../shared/events';
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
export const ThemeInjectKey: InjectionKey<Ref<Theme>> = Symbol('theme');

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

export interface RunnerCase {
  id: string
  stdinFile?: string
  stdoutFile?: string
  diff?: boolean
  exitCode?: number
  duration?: number
}

export interface RunnerState {
  id: string
  file: string
  task: string
  status: RunnerStatus
  case: number
  cases: RunnerCase[]
  hint?: RunnerHint
}

/**
 * Ask user to select one file.
 * @returns Resolves the selected file path, or `undefined` if cancelled.
 */
export async function selectFile() {
  postEvent({ type: 'file:select' });
  return (await waitEvent('file:selected')).path;
}

export function waitEvent<T extends EventMessage['type']>(type: T) {
  return new Promise<EventMessage & { type: T }>((resolve) => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type !== type)
        return;
      window.removeEventListener('message', handleMessage);
      resolve(event.data);
    };
    window.addEventListener('message', handleMessage);
  });
}
