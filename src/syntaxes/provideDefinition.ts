import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
/**
 * cmd + click 跳转到对应的 macro 文件
 */
export default (document: vscode.TextDocument, position: vscode.Position) => {
  let line = position.line;
  let text = document.lineAt(line).text.trim();
  let arr = document.fileName.split("/");
  arr.pop();
  let path1 = arr.join("/");

  if (process.platform === "win32") {
    path1 = path1.slice(1);
  }
  const path2 = path.resolve(path1, text.slice(8).trim() + ".macro");
  if (text.startsWith("* macro") && fs.existsSync(path2)) {
    return new vscode.Location(
      vscode.Uri.file(path2),
      new vscode.Position(0, 0)
    );
  } else {
    let p = text
      .slice(8)
      .trim()
      .split(" ")[0];
    let path3 = path.resolve(path1, p + ".macro");
    if (text.startsWith("* macro") && fs.existsSync(path3)) {
      return new vscode.Location(
        vscode.Uri.file(path3),
        new vscode.Position(0, 0)
      );
    }

    return;
  }
};
