import * as vscode from 'vscode';
import { z } from 'zod';

const CommandSchema = z.tuple([z.string(), z.array(z.string())]);
const TaskSchema = z.object({
  compile: CommandSchema.optional(),
  execute: CommandSchema.optional(),
  // @todo
  // judge: CommandSchema,
});
const TasksSchema = z.record(TaskSchema);

export type Task = z.infer<typeof TaskSchema>;

export function getConfiguredTasks(): Record<string, Task> {
  return TasksSchema.parse(
    vscode.workspace.getConfiguration('oi-runner-2').get('tasks', {}),
  );
}
