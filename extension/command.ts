/* eslint-disable no-template-curly-in-string */

import type * as vscode from 'vscode';
import { Buffer } from 'node:buffer';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { decode } from 'iconv-lite';
import ps from 'ps-tree';
import kill from 'tree-kill';

const execExt = process.platform === 'win32' ? '.exe' : '';

/**
 * Evaluates a command template by replacing placeholders with actual values from the provided document.
 *
 * @param template The command template containing placeholders to be replaced.
 * @param document The text document from which values will be extracted to replace placeholders.
 * @returns The command with placeholders replaced by actual values.
 */
export function evalCommand(template: string, document: vscode.TextDocument) {
  const file = path.parse(document.fileName);
  return template
    .replaceAll('${file}', document.fileName)
    .replaceAll('${fileNoExt}', file.dir + path.sep + file.name)
    .replaceAll('${execExt}', execExt);
}

function transformSocketOutput(output: any) {
  return output === null
    ? ''
    : Buffer.isBuffer(output)
      ? decode(output, /* 'utf8' */ 'gb2312')
      : output;
}

export interface ExecuteCommandResult {
  stdout?: string
  exitCode?: number
  duration?: number
}

/**
 * Executes a command in a child process.
 * @param command The command to execute.
 * @param args An array of string arguments for the command.
 * @param stdin The string to write to the stdin of the command.
 * @param stderr The output channel to write stderr to. Once it is written to, it will be shown.
 * @param cwd The current working directory for the command.
 * @param signal The {@link AbortSignal} that can be for cancel the execution
 * @throws {AbortError} If aborted
 * @returns A promise that resolves
 */
export function executeCommand(command: string, args: string[], stdin?: string, stderr?: vscode.OutputChannel, cwd?: string, signal?: AbortSignal) {
  return new Promise<ExecuteCommandResult>((resolve, reject) => {
    let startTime: number;
    let stderrOpened = false;

    const child = spawn(command, args, {
      cwd,
      shell: true,
      signal,
    });

    signal?.addEventListener('abort', () => {
      if (!child.pid)
        return;
      ps(child.pid, (_, children) => {
        for (const cpid of children)
          kill(Number(cpid.PID));
      });
    });

    child.stdin.end(stdin ?? '');
    if (stderr) {
      child.stderr.on('data', (data) => {
        if (!stderrOpened) {
          stderrOpened = true;
          stderr.show();
        }
        stderr.append(transformSocketOutput(data));
      });
    }

    child.once('spawn', () => startTime = Date.now());
    child.once('error', (e) => {
      if (e instanceof Error && e.name === 'AbortError')
        reject(e);
      else
        resolve({});
    });
    child.once('exit', () => {
      const stdout = child.stdout.read();
      resolve({
        stdout: transformSocketOutput(stdout),
        exitCode: child.exitCode!,
        duration: Date.now() - startTime,
      });
    });
  });
}
