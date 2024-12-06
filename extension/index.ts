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

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(async (event) => {
      if (event.affectsConfiguration('oi-runner-2')) {
        const ans = await vscode.window.showInformationMessage('Configuration changed, do you want to reload extensions to apply these changes?', 'Reload');
        if (ans === 'Reload')
          vscode.commands.executeCommand('workbench.action.restartExtensionHost');
      }
    }),
  );
}
