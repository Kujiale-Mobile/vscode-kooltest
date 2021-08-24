import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { store } from '../store';

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public async resolveWebviewView(webviewView?: vscode.WebviewView) {
    if (webviewView) {
      this._view = webviewView;
    }
    let root = vscode.workspace.workspaceFolders?.length
      ? [this._extensionUri].concat(vscode.workspace.workspaceFolders[0]?.uri)
      : [this._extensionUri];
    if (!this._view) {
      return;
    }
    this._view.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,
      localResourceRoots: root,
    };
    try {
      this._view.webview.html = this._getHtmlForWebview(this._view.webview);
      return;
    } catch (error) {
      console.log('error', error);
      return;
    }
  }

  private _onDidChangeTreeData: vscode.EventEmitter<
    any
  > = new vscode.EventEmitter<any>();
  private _onDidDispose: vscode.EventEmitter<any> = new vscode.EventEmitter<
    any
  >();
  readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData
    .event;
  refresh() {
    this._onDidChangeTreeData.fire(undefined);
    if (this._view) {
      this._view.webview.html = this._getHtmlForWebview(this._view.webview);
      this._view.show(true);
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    let path1 =
      vscode.workspace.workspaceFolders?.length &&
      vscode.workspace.workspaceFolders[0]?.uri.path;
    if (path1 && process.platform === 'win32') {
      path1 = path1.slice(1);
    }
    const path2 = path.resolve(path1 || '', '.test', 'cucumber', 'index2.html');
    store.setLogs(
      path1,
      path2,
      fs.existsSync(path2),
      vscode.workspace.workspaceFolders,
    );
    if (!path1 || !path2 || !fs.existsSync(path2)) {
      return `loading...`;
    }
    store.setLogs('webview path', path2);
    let html = fs.readFileSync(path2, 'utf8');
    html = html.replace(
      /(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g,
      (m, $1, $2) => {
        return (
          $1 +
          vscode.Uri.file(
            path.resolve(path.resolve(path1 || '', '.test', 'cucumber'), $2),
          )
            .with({ scheme: 'vscode-resource' })
            .toString() +
          '"'
        );
      },
    );
    let arr = html.split('\n');
    arr.splice(6, 1);
    arr.splice(
      6,
      0,
      `<style type="text/css">.failed,.skipped,.passed,.error { background: transparent!important; } .failed,.error { color: #de1c3f!important;border: none!important; } .skipped { color: #4490c8!important; } .passed { color: #54b857!important; }</style>`,
    );
    store.setLogs(arr.join('\n'));
    return arr.join('\n');
  }
}
