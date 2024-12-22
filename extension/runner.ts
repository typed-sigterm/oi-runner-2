// @todo rewrite with state machine

import type { EventMessage, IOChannel, IOFileChannel, RunStep } from '../shared/events';
import type { Task } from './config';
import { createWriteStream } from 'node:fs';
import * as vscode from 'vscode';
import { evalCommand, executeCommand } from './command';
import { getConfiguredTasks } from './config';
import { logger } from './utils';

class RunError extends Error {}

export class Runner extends vscode.EventEmitter<EventMessage> {
  constructor(public document: vscode.TextDocument) {
    super();
  }

  private _stderrChannel = vscode.window.createOutputChannel('OI Runner++ Task');
  private _currentController?: AbortController;

  private _evalTask(task: string) {
    const config = getConfiguredTasks()[task];
    if (!config)
      throw new Error(`Task "${task}" not found in configuration.`);
    const result: any = {};
    for (const [step, item] of Object.entries(config)) {
      result[step] = [
        evalCommand(item[0], this.document),
        item[1].map(arg => evalCommand(arg, this.document)),
      ];
    }
    return result as Task;
  }

  public startRun(task: string, step: RunStep, stdin?: IOChannel, stdout?: IOFileChannel) {
    let t: Task;
    try {
      t = this._evalTask(task);
    } catch (e) {
      vscode.window.showErrorMessage('Cannot parse config, please check [oi-runner-2.tasks] settings.');
      logger.error(e);
    }

    const workspace = vscode.workspace.getWorkspaceFolder(this.document.uri);
    const cwd = workspace && workspace.uri.fsPath;
    const { signal } = this._currentController = new AbortController();

    Promise.resolve()
      .then(() => { // compile
        if (step !== 'execute' && t.compile)
          return executeCommand(t.compile[0], t.compile[1], undefined, undefined, this._stderrChannel, cwd, signal);
      })
      .then((p) => { // compile completed
        if (p && p.exitCode) {
          this.fire({ type: 'run:compile-failed', exitCode: p.exitCode });
          throw new RunError(`Compilation failed with exit code ${p.exitCode}`);
        } else {
          this.fire({
            type: 'run:compiled',
            skipExcuting: step === 'compile',
          });
        }
      })
      .then(() => { // execute
        const out = stdout ? createWriteStream(stdout.file) : undefined;
        if (step !== 'compile' && t.execute)
          return executeCommand(t.execute[0], t.execute[1], stdin, out, this._stderrChannel, cwd, signal);
      })
      .then((p) => { // execute completed
        if (!p)
          return;
        if (p.exitCode === undefined) {
          this.fire({ type: 'run:execute-failed' });
          throw new RunError('Execution failed');
        } else {
          // @ts-expect-error All attributes either `undefined` or not `undefined` together
          this.fire({
            type: 'run:executed',
            ...p,
          });
        }
      })
      .catch((e) => {
        if (e instanceof RunError)
          return;
        if (e instanceof Error && e.name === 'AbortError')
          return this.fire({ type: 'run:killed' });
        logger.error(e);
        vscode.window.showErrorMessage(String(e));
      });
  }

  public stopRun() {
    this._currentController!.abort();
    this._currentController = undefined;
  }
}
