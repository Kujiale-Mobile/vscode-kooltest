import * as vscode from "vscode";
export class LogManager implements vscode.Disposable {
  public _outputChannel: vscode.OutputChannel;
  // private _process;
  private _isRunning: boolean | undefined;
  constructor() {
    this._outputChannel = vscode.window.createOutputChannel("KoolTest");
  }

  dispose() {
    this.stopRunning();
  }

  private stopRunning() {
    if (this._isRunning) {
        this._isRunning = false;
    }
  }

}
