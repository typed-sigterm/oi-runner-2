import * as vscode from 'vscode';
import { createWebviewProvider } from './webview';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    createWebviewProvider(context),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('oi-runner-2.runCode', () => {
      vscode.commands.executeCommand('oi-runner-2.panel.focus');
    }),
  );
}
