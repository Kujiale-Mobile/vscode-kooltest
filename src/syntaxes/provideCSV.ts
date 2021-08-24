import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
/**
 * cmd + click 跳转到对应的 csv 文件
 */
export default (document: vscode.TextDocument, position: vscode.Position) => {
  let line = position.line;
  let text = document.lineAt(line).text.trim();
  let path1 =
    (vscode.workspace.workspaceFolders?.length &&
      vscode.workspace.workspaceFolders[0]?.uri.path) ||
    "";

  if (process.platform === "win32") {
    path1 = path1.slice(1);
  }
  let configPath = path.resolve(path1, "config");
  if (!fs.existsSync(configPath) || !text.startsWith(`* tap "element://`)) {
    return;
  }
  let dir = fs.readdirSync(configPath) || [];
  for (let i = 0; i < dir.length; i++) {
    if (dir[i].endsWith(".csv")) {
      const cd = path.resolve(configPath, dir[i]);
      const str = fs.readFileSync(cd).toString();
      let rows = str.split("\n");
      for (let j = 0; j < rows.length; j++) {
        const row = rows[j].split(",");
        if (text.indexOf(row[0]) >= 0) {
          return new vscode.Location(
            vscode.Uri.file(path.resolve(configPath, dir[i])),
            new vscode.Position(j, 0)
          );
        }
      }
    }
    return;
  }
};
