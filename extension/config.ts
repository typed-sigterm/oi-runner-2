import path from 'node:path';
import * as vscode from 'vscode';
import { z } from 'zod/v4';
import { contributes } from '../package.json';
import { cachedFn } from './utils';

const ConfigManifest = contributes.configuration[0].properties;

const CommandSchema = z.tuple([z.string(), z.array(z.string())]);
const TaskSchema = z.object({
  compile: CommandSchema.optional(),
  execute: CommandSchema,
});
export type Task = z.infer<typeof TaskSchema>;

const TasksSchema = z.record(z.string(), TaskSchema);
const DefaultTaskSchema = z.record(z.string(), z.string());

export const getConfiguredTasks = cachedFn(() => {
  return TasksSchema.parse(
    vscode.workspace.getConfiguration('oi-runner-2').get(
      'tasks',
      ConfigManifest['oi-runner-2.tasks'].default,
    ),
  );
});

export const getConfiguredDefaultTask = cachedFn(() => {
  return DefaultTaskSchema.parse(
    vscode.workspace.getConfiguration('oi-runner-2').get(
      'defaultTask',
      ConfigManifest['oi-runner-2.defaultTask'].default,
    ),
  );
});

/**
 * Retrieves the default task for a given file path.
 * @param file The path to the file
 * @returns The default task or `false` if disabled.
 */
export function getDefaultTask(file: string): string | undefined {
  const { ext } = path.parse(file);
  return getConfiguredDefaultTask()[ext];
}

export function getAutoSave(): boolean {
  return vscode.workspace.getConfiguration('oi-runner-2').get<boolean>('autoSave', true) !== false;
}

export function gettextareaMaxSize(): number {
  return vscode.workspace.getConfiguration('oi-runner-2').get<number>('textareaMaxSize', 1e4);
}
