import * as vscode from 'vscode';

export class CustomCodeLensProvider implements vscode.CodeLensProvider {
  private onDidChangeCodeLensesEmitter: vscode.EventEmitter<
    void
  > = new vscode.EventEmitter<void>();

  get onDidChangeCodeLenses(): vscode.Event<void> {
    return this.onDidChangeCodeLensesEmitter.event;
  }

  public refresh(): void {
    this.onDidChangeCodeLensesEmitter.fire();
  }

  public provideCodeLenses(
    document: vscode.TextDocument,
  ): vscode.ProviderResult<vscode.CodeLens[]> {
    const content: string = document.getText();
    let ext: string | undefined;
    if (document.fileName.endsWith('.macro')) {
      ext = 'macro';
    }
    if (document.fileName.endsWith('.feature')) {
      ext = 'feature';
    }

    let codeLensLine: number = 0;
    if (ext === 'macro' || ext === 'feature') {
      codeLensLine = 0;
    }
    if (ext === void 0) {
      return [];
    }
    const codeLens: vscode.CodeLens[] = [];
    codeLens.push(...addCodeLens(document, content, ext, codeLensLine));
    /**
     * 遍历到相应字段 添加 CodeLens
     */
    for (let i: number = 1; i < document.lineCount; i++) {
      if (
        ext === 'feature' &&
        document.lineAt(i).text.indexOf('Scenario:') >= 0
      ) {
        codeLens.push(...addCodeLens(document, content, ext, i));
      }
    }
    return codeLens;
  }
}

function addCodeLens(
  document: vscode.TextDocument,
  content: string,
  ext: string,
  codeLensLine: number,
) {
  const range: vscode.Range = new vscode.Range(
    codeLensLine,
    0,
    codeLensLine,
    0,
  );
  const codeLens: vscode.CodeLens[] = [];
  let lineStr: string | undefined;

  if (codeLensLine !== 0) {
    lineStr = document
      .lineAt(codeLensLine)
      .text.trim()
      .split(' ')[1];
  }
  if (codeLensLine > 0) {
    codeLens.push(
      new vscode.CodeLens(range, {
        title: '✂️ 截图',
        command: 'kool-rpa.screenShot',
        arguments: [document, content, ext === 'feature', lineStr],
      }),
    );
    ext === 'feature' &&
      codeLens.push(
        new vscode.CodeLens(range, {
          title: '✅ 脚本回放',
          command: 'kool-rpa.play',
          arguments: [document.fileName, lineStr],
        }),
      );
  }

  if (ext === 'feature') {
    return codeLens;
  }

  codeLens.unshift(
    new vscode.CodeLens(range, {
      title: '⏺️ 开启录制',
      command: 'kool-rpa.start',
      arguments: [document, content],
    }),
  );

  codeLens.push(
    new vscode.CodeLens(range, {
      title: '✂️ 截图',
      command: 'kool-rpa.screenShot',
      arguments: [document, content, ext === 'feature'],
    }),
  );

  return codeLens;
}

export const customCodeLensProvider: CustomCodeLensProvider = new CustomCodeLensProvider();
