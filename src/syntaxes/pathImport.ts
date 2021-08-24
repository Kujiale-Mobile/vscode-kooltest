import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { FileInfo } from './fileInfo';

interface ICodeInfo {
  line: string;
  word: string;
  fileName: string;
  directory: string;
}

function getFocusCodeInfo(
  document: vscode.TextDocument,
  position: vscode.Position,
): ICodeInfo {
  return {
    // Code info
    line: document.getText(document.lineAt(position).range),
    word: document.getText(document.getWordRangeAtPosition(position)),

    // File info
    fileName: document.fileName,
    directory: path.dirname(document.fileName),
  };
}
function unique(arr: FileInfo[]) {
  const hash: { [key: string]: boolean } = {};
  const res: FileInfo[] = [];
  arr.forEach(info => {
    if (!hash[info.getName()]) {
      hash[info.getName()] = true;
      res.push(info);
    }
  });
  return res;
}

export default function provideCompletionItems(
  document: vscode.TextDocument,
  position: vscode.Position,
): vscode.CompletionItem[] {
  const completions: vscode.CompletionItem[] = [];
  const { word, directory, line } = getFocusCodeInfo(document, position);

  let macros: FileInfo[] = [];
  let curToken = '';
  for (let i = Number(position.character) - 1; i >= 0; i--) {
    if (line[i] === ' ') {
      break;
    }
    curToken = line[i] + curToken;
  }
  const dir = `${directory}${
    curToken.endsWith('/') ? '/' + curToken.slice(0, -1) : ''
  }`;
  fs.readdirSync(dir).forEach(file => {
    const filePath = `${dir}/${file}`;
    const newFile = new FileInfo(filePath);
    if (
      path.extname(file) === '.macro' ||
      path.extname(file) === '.feature' ||
      newFile.isDirectory()
    ) {
      macros.push(newFile);
    }
  });

  return unique(macros).map(macro => {
    const completionItem = new vscode.CompletionItem(
      `${macro.getName()}`,
      macro.isDirectory()
        ? vscode.CompletionItemKind.Folder
        : vscode.CompletionItemKind.File,
    );
    completionItem.detail = 'kool-test';
    completionItem.insertText = `${macro.getName().split('.')[0]}`;
    return completionItem;
  });
}
