// @todo rewrite with state machine

import type { EventMessage, IOChannel, IOFileChannel, RunStep } from '../shared/events';
import type { Task } from './config';
import { createWriteStream } from 'node:fs';
import * as vscode from 'vscode';
import { evalCommand, executeCommand } from './command';
import { getConfiguredTasks, gettextareaMaxSize as getTextareaMaxSize } from './config';
import { logger } from './utils';

export interface RunOptions {
  task: string
  step: RunStep
  stdin?: IOChannel
  stdout?: IOFileChannel
}

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

  public startRun(options: RunOptions) {
    const { task, step, stdin, stdout } = options;

    let t: Task;
    try {
      t = this._evalTask(task);
    } catch (e) {
      vscode.window.showErrorMessage('Cannot parse config, please check [oi-runner-2.tasks] settings.');
      logger.error(e);
      return;
    }

    const workspace = vscode.workspace.getWorkspaceFolder(this.document.uri);
    const cwd = workspace && workspace.uri.fsPath;
    const { signal } = this._currentController = new AbortController();
    this._stderrChannel.clear();

    Promise.resolve()
      .then(() => { // compile
        if (step !== 'execute' && t.compile)
          return executeCommand(t.compile[0], t.compile[1], undefined, undefined, this._stderrChannel, cwd, signal);
      })

      .then((p) => { // compile completed
        if (!p)
          return;

        if ('exitCode' in p) {
          if (p.exitCode) {
            this.fire({ type: 'run:compile-failed', exitCode: p.exitCode });
            throw new RunError(`Compilation failed with exit code ${p.exitCode}`);
          } else {
            this.fire({
              type: 'run:compiled',
              skipExcuting: step === 'compile',
            });
          }
        } else {
          this.fire({ type: 'run:compile-failed' });
          throw new RunError('Compilation failed');
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

        if ('exitCode' in p) {
          this.fire({
            type: 'run:executed',
            ...p,
          });
          if (p.overflow) {
            return vscode.window.showWarningMessage(
              `Output is truncated to ${getTextareaMaxSize()} bytes to avoid hanging the editor. It's recommended to redirect stdout to a file, or you can increase the limit in settings.`,
              'Redirect',
              'Modify settings',
            );
          }
        } else {
          this.fire({ type: 'run:execute-failed' });
          throw new RunError('Execution failed');
        }
      })

      .then((choice) => {
        if (choice === 'Redirect') {
          this.fire({
            type: 'context:redirect',
            channel: 'stdout',
          });
        } else if (choice === 'Modify settings') {
          vscode.commands.executeCommand('workbench.action.openSettings', 'oi-runner-2.maxOutputSize');
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
