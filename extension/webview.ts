import type { EventMessage } from '../shared/events';
import * as vscode from 'vscode';
import { version } from '../package.json';
import { EventMarker } from '../shared/events';
import { getAutoSave, getConfiguredDefaultTask, getConfiguredTasks, getDefaultTask, isConfigured } from './config';
import { Runner } from './runner';
import { logger } from './utils';
import { OJ_INSTANCE } from './oj';

class PanelProvider implements vscode.WebviewViewProvider, vscode.Disposable {
  static readonly VIEW_TYPE = 'oi-runner-2.panel';

  constructor(private _context: vscode.ExtensionContext) {
    this.subscriptions.push(
      vscode.window.onDidChangeActiveTextEditor(this._handleActiveEditorChange, this),
      vscode.workspace.onDidChangeTextDocument(this._handleDocumentChange, this),
      vscode.workspace.onDidRenameFiles(this._handleFilesRename, this),
    );
  }

  public dispose() {
    this.subscriptions.forEach(s => s.dispose());
    this.subscriptions = [];
  }

  private subscriptions: vscode.Disposable[] = [];

  private _view?: vscode.WebviewView;
  private _runners = new Map<string, Runner>();

  private _currentFile: string | undefined;
  private _currentFileDirty = false;

  public resolveWebviewView(view: vscode.WebviewView) {
    this._view = view;
    view.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this._context.extensionUri, 'dist'),
      ],
    };
    view.webview.html = __getWebviewHtml__({
      serverUrl: process.env.VITE_DEV_SERVER_URL,
      webview: view.webview,
      context: this._context,
    });

    this.subscriptions.push(
      view.webview.onDidReceiveMessage(this._handleMessage, this),
    );
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
    if (file === this._currentFile) // noop
      return;
    const task = getDefaultTask(file);
    if (task === undefined)
      return;

    // Create runner if not exists
    if (!this._runners.has(file)) {
      const runner = new Runner(editor.document);
      runner.event(this.postEvent, this);
      this._runners.set(file, runner);
    }

    this._currentFile = editor.document.uri.toString();
    this._currentFileDirty = editor.document.isDirty;
    // Notify webview
    this.postEvent({
      type: 'context:switch',
      file,
      defaultTask: task,
      isDirty: editor.document.isDirty,
    });
  }

  private _handleDocumentChange(event: vscode.TextDocumentChangeEvent) {
    if (this._currentFile !== event.document.uri.toString())
      return;

    const { isDirty } = event.document;
    if (isDirty !== this._currentFileDirty) {
      this._currentFileDirty = isDirty;
      this.postEvent({
        type: 'context:state-changed',
        isDirty,
      });
    }
  }

  private _handleFilesRename(event: vscode.FileRenameEvent) {
    for (const file of event.files) {
      const from = file.oldUri.fsPath;
      const to = file.newUri.fsPath;
      const runner = this._runners.get(from);

      if (this._currentFile === from)
        this._currentFile = to;
      if (runner) {
        this._runners.delete(from);
        this._runners.set(to, runner);
        this.postEvent({
          type: 'context:rename',
          from,
          to,
        });
      }
    }
  }

  private async _handleMessage(message: EventMessage) {
    logger.debug('Extension received message:', message);

    switch (message.type) {
      case 'webview:ready': // pass config and initial state to webview
        this.postEvent({
          type: 'setup',
          tasks: Object.entries(getConfiguredTasks()).map(([k, v]) => ({
            name: k,
            compilable: !!v.compile,
          })),
          extensions: Object.keys(getConfiguredDefaultTask()),

          id: vscode.env.machineId,
          telemetry: vscode.env.isTelemetryEnabled && {
            'Version': version,
            'VSCode Version': vscode.version,
            'Language': vscode.env.language,
            'Configured': isConfigured(),
          },
        });
        this._handleActiveEditorChange(vscode.window.activeTextEditor);
        break;

      case 'run:launch':
        if (getAutoSave() && this._currentFileDirty) {
          const ret = await vscode.workspace.save(vscode.Uri.file(message.file));
          if (!ret)
            vscode.window.showWarningMessage('Failed to auto-save file before running. Please save manually.');
        }
        this._runners.get(message.file)!.startRun(message);
        break;

      case 'run:kill':
        this._runners.get(message.file)!.stopRun();
        break;

      case 'file:open-in-editor':
        vscode.window.showTextDocument(vscode.Uri.file(message.path), {
          selection: new vscode.Selection(0, 0, 0, 0),
        });
        break;

      case 'file:select':
        vscode.window.showOpenDialog({
          title: 'Select File',
        }).then((uri) => {
          this.postEvent({
            type: 'file:selected',
            path: uri?.[0].fsPath,
          });
        });
        break;
      
      case 'file:open-url':
        vscode.env.openExternal(vscode.Uri.parse(message.url));
        break;

      case 'oj:fetch-samples':
        try {
          const res = await OJ_INSTANCE[message.provider].getProblem(message.problem);
          this.postEvent({
            type: 'oj:samples-fetched',
            samples: res.samples,
          })
        } catch (e) {
          logger.error('Failed to fetch samples:', e);
          this.postEvent({ type: 'oj:samples-fetched' })
          const res = await vscode.window.showErrorMessage('Failed to fetch samples', 'Copy Details');
          if (res === 'Copy Details')
            vscode.env.clipboard.writeText(e instanceof Error && e.stack || String(e));
        }
    }
  }
}

export function createWebviewProvider(context: vscode.ExtensionContext) {
  const provider = new PanelProvider(context);
  context.subscriptions.push(provider);
  return vscode.window.registerWebviewViewProvider(
    PanelProvider.VIEW_TYPE,
    provider,
    {
      webviewOptions: {
        retainContextWhenHidden: true,
      },
    },
  );
}
