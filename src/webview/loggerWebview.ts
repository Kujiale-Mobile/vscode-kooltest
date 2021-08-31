import * as vscode from 'vscode';
import { AbstractWebview, IWebviewOption } from './abstractWebview';

export class LoggerWebview extends AbstractWebview {
  protected getWebviewOption(): IWebviewOption {
    return {
      title: `logger`,
      viewColumn: vscode.ViewColumn.One,
      preserveFocus: true,
    };
  }
  protected readonly viewType: string = 'test-rpa.logger';
  constructor(private log: string) {
    super();
  }
  public show(): void {
    this.showWebviewInternal();
  }
  protected getWebviewContent(): string {
    const defaultErrorMsg = '资源加载失败';
    if (!this.log) {
      return defaultErrorMsg;
    }
    return this.log;
  }
  protected onDidDisposeWebview(): void {
    super.onDidDisposeWebview();
  }
}
