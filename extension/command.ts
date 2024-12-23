/* eslint-disable no-template-curly-in-string */

import type { WriteStream } from 'node:fs';
import type * as vscode from 'vscode';
import type { IOChannel } from '../shared/events';
import { Buffer } from 'node:buffer';
import { spawn } from 'node:child_process';
import { accessSync, constants, createReadStream } from 'node:fs';
import path from 'node:path';
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
      ? output.toString('utf-8')
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
 * @param stdin The string / file to write to the stdin of the command.
 * @param stdout The output stream to write stdout to.
 * @param stderr The output channel to write stderr to. Once it is written to, it will be shown.
 * @param cwd The current working directory for the command.
 * @param signal The {@link AbortSignal} that can be for cancel the execution
 * @throws {AbortError} If aborted
 * @returns A promise that resolves
 */
export function executeCommand(command: string, args: string[], stdin?: IOChannel, stdout?: WriteStream, stderr?: vscode.OutputChannel, cwd?: string, signal?: AbortSignal) {
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

    if (typeof stdin === 'string') {
      child.stdin.end(stdin);
    } else if (typeof stdin === 'object') {
      accessSync(stdin.file, constants.F_OK | constants.R_OK);
      createReadStream(stdin.file)
        .pipe(child.stdin)
        .on('end', () => child.stdin.end());
    } else {
      child.stdin.end();
    }

    if (stdout) {
      child.stdout.pipe(stdout);
    }

    if (stderr) {
      child.stderr.on('data', (data) => {
        if (!stderrOpened) {
          stderrOpened = true;
          stderr.show();
        }
        stderr.append(transformSocketOutput(data));
      });
    }

    child.once('spawn', () => startTime = performance.now());
    child.once('error', (e) => {
      if (e instanceof Error && e.name === 'AbortError')
        reject(e);
      else
        resolve({});
    });

    child.once('exit', () => {
      // If stdout is redirected, resolve `stdout: undefined`
      let printed: string | undefined;
      if (!stdout)
        printed = transformSocketOutput(child.stdout.read());
      resolve({
        stdout: printed,
        exitCode: child.exitCode!,
        duration: Math.round(performance.now() - startTime),
      });
    });
  });
}
