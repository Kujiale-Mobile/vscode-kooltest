import * as vscode from 'vscode';

export abstract class AbstractWebview implements vscode.Disposable {
  protected readonly viewType: string = 'test-rpa.webview';
  protected panel: vscode.WebviewPanel | undefined;

  public dispose(): void {
    if (this.panel) {
      this.panel.dispose();
    }
  }

  protected showWebviewInternal(): void {
    const { title, viewColumn, preserveFocus } = this.getWebviewOption();
    this.panel = vscode.window.createWebviewPanel(
      this.viewType,
      title,
      {
        viewColumn,
        preserveFocus,
      },
      {
        enableScripts: true,
      },
    );
    this.panel.webview.html = this.getWebviewContent();
  }

  protected onDidDisposeWebview(): void {
    this.panel = undefined;
  }

  protected abstract getWebviewOption(): IWebviewOption;

  protected abstract getWebviewContent(): string;
}

export interface IWebviewOption {
  title: string;
  viewColumn: vscode.ViewColumn;
  preserveFocus?: boolean;
}
