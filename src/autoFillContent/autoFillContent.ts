import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

const types = ['.feature', '.macro'];

function checkIsValidateType(fsPath: string) {
  return types.includes(path.extname(fsPath));
}

const macroSource = ``;

const featureSource = `Feature: 脚本名称
  此处填写用户故事...

  Background: 共性步骤名称

  Scenario: 场景名称
    * open "https://www.kujiale.com"
    debugger
`;

async function filContent(fsPath: string): Promise<string> {
  let newFsPath = fsPath;

  let source =
    path.extname(newFsPath) === '.feature' ? featureSource : macroSource;
  fs.writeFileSync(newFsPath, source);

  return newFsPath;
}

export default function() {
  vscode.workspace.onDidCreateFiles(async ({ files }) => {
    await Promise.all(
      files.map(async file => {
        const { fsPath } = file;
        const isValidateType = checkIsValidateType(fsPath);
        if (isValidateType) {
          await filContent(fsPath);
        }
      }),
    );
  });

  /**
   * TODO
   *
   * When the file name changes, judge whether the file has been modified.
   * If not, rename the component with the latest file name.
   */
  vscode.workspace.onDidRenameFiles(() => {
    console.log('onDidRenameFiles');
  });
}
