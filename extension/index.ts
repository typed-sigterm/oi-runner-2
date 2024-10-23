import type * as vscode from 'vscode';
import { createWebviewProvider } from './webview';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    createWebviewProvider(context),
  );
}
