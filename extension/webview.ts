import * as vscode from 'vscode';
import { EventMarker, type EventMessage } from '../shared/events';
import { getConfiguredTasks, getDefaultTask } from './config';
import { Runner } from './runner';
import { logger } from './utils';

function getHtml(webview: vscode.Webview, context: vscode.ExtensionContext) {
  return process.env.VITE_DEV_SERVER_URL
    ? __getWebviewHtml__(process.env.VITE_DEV_SERVER_URL)
    : __getWebviewHtml__(webview, context);
}

class PanelProvider implements vscode.WebviewViewProvider {
  static readonly VIEW_TYPE = 'oi-runner-2.panel';

  constructor(private _context: vscode.ExtensionContext) {
    vscode.window.onDidChangeActiveTextEditor(this._handleActiveEditorChange, this);
  }

  private _view?: vscode.WebviewView;
  private _runners = new Map<string, Runner>();

  private _currentFileDirty = false;

  public resolveWebviewView(view: vscode.WebviewView) {
    this._view = view;
    view.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this._context.extensionUri, 'dist'),
      ],
    };
    view.webview.html = getHtml(view.webview, this._context);
    view.webview.onDidReceiveMessage(this._handleMessage, this);

    vscode.workspace.onDidChangeTextDocument(this._handleDocumentChange, this);
  }

  public postEvent(message: EventMessage) {
    return this._view?.webview.postMessage({
      ...message,
      [EventMarker]: true,
    });
  }

  private _handleActiveEditorChange(editor: vscode.TextEditor | undefined) {
    if (editor?.document.uri.scheme !== 'file') // skip non-fs editors
      return;
    const file = editor.document.fileName;

    // Create runner if not exists
    if (!this._runners.has(file)) {
      const runner = new Runner(editor.document);
      runner.event(this.postEvent, this);
      this._runners.set(file, runner);
    }

    this._currentFileDirty = editor.document.isDirty;
    // Notify webview
    this.postEvent({
      type: 'context:switch',
      file,
      defaultTask: getDefaultTask(file),
      isDirty: editor.document.isDirty,
    });
  }

  private _handleDocumentChange(event: vscode.TextDocumentChangeEvent) {
    const { isDirty } = event.document;
    if (isDirty !== this._currentFileDirty) {
      this._currentFileDirty = isDirty;
      this.postEvent({
        type: 'context:state-changed',
        isDirty,
      });
    }
  }

  private _handleMessage(message: EventMessage) {
    logger.debug('Extension received message:', message);

    switch (message.type) {
      case 'webview:ready': // pass config and initial state to webview
        this.postEvent({
          type: 'config',
          tasks: Object.entries(getConfiguredTasks()).map(([k, v]) => ({
            name: k,
            compilable: !!v.compile,
          })),
        });
        this._handleActiveEditorChange(vscode.window.activeTextEditor);
        break;

      case 'context:goto-source':
        vscode.window.showTextDocument(vscode.Uri.file(message.file), {
          selection: new vscode.Selection(0, 0, 0, 0),
        });
        break;

      case 'run:launch':
        this._runners.get(message.file)!.startRun(message.task, message.step, message.stdin);
        break;
      case 'run:kill':
        this._runners.get(message.file)!.stopRun();
        break;
    }
  }
}

export function createWebviewProvider(context: vscode.ExtensionContext) {
  return vscode.window.registerWebviewViewProvider(
    PanelProvider.VIEW_TYPE,
    new PanelProvider(context),
    {
      webviewOptions: {
        retainContextWhenHidden: true,
      },
    },
  );
}
