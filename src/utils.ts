import type { InjectionKey } from 'vue';
import { basicSetup } from 'codemirror';
import Consola, { LogLevels } from 'consola/browser';
import { inject, shallowRef } from 'vue';
import { EventMarker, type EventMessage } from '../shared/events';
import * as cmThemes from './cm-theme';

export const consola = Consola.withTag('OI Runner++');
consola.options.level = import.meta.env.DEV ? LogLevels.debug : LogLevels.info;

export const vscode = acquireVsCodeApi();

export function postEvent(message: EventMessage) {
  vscode.postMessage({
    ...message,
    [EventMarker]: true,
  });
}

export type Theme = 'dark' | 'light';
export const ThemeInjectKey: InjectionKey<Theme> = Symbol('theme');

export function useCmExtensions() {
  const ret = shallowRef([basicSetup]);
  const theme = inject(ThemeInjectKey);
  if (theme === 'light')
    ret.value.push(cmThemes.light);
  else
    ret.value.push(cmThemes.dark);
  return ret;
}
