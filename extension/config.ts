import path from 'node:path';
import * as vscode from 'vscode';
import { z } from 'zod';
import { cachedFn } from './utils';

const CommandSchema = z.tuple([z.string(), z.array(z.string())]);
const TaskSchema = z.object({
  compile: CommandSchema.optional(),
  execute: CommandSchema,
  // @todo
  // judge: CommandSchema,
});
export type Task = z.infer<typeof TaskSchema>;

const TasksSchema = z.record(TaskSchema);
const DefaultTaskSchema = z.record(z.string(), z.string());

export const getConfiguredTasks = cachedFn(() => {
  return TasksSchema.parse(
    vscode.workspace.getConfiguration('oi-runner-2').get('tasks', {}),
  );
});

export const getConfiguredDefaultTask = cachedFn(() => {
  return DefaultTaskSchema.parse(
    vscode.workspace.getConfiguration('oi-runner-2').get('defaultTask', {}),
  );
});

/**
 * Retrieves the default task for a given file path.
 * @param file The path to the file
 * @returns The default task or `undefined`.
 */
export function getDefaultTask(file: string): string | undefined {
  const { ext } = path.parse(file);
  const config = getConfiguredDefaultTask();
  return config[ext] ?? config['.'];
}
