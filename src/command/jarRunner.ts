import * as vscode from "vscode";
import * as cp from "child_process";
import * as fs from "fs";
import { resolve } from "path";
import * as path from "path";
import builder from "./builder";
import { store } from "../store";
import killPort from "./killPort";
import spider from "../utils/spider";
import realPath from "../utils/path";
/**
 * TODO: 指向当前目录
 */
export default async (
  file: string,
  context: vscode.ExtensionContext,
  scenario?: string
) => {
  store.setLogs("scenario", scenario, context.extensionUri.path);

  let path1 = resolve(context.extensionUri.path, "media");
  let path2 =
    vscode.workspace.workspaceFolders?.length &&
    vscode.workspace.workspaceFolders[0]?.uri.path;
  if (!path2) {
    vscode.window.showErrorMessage("请打开正确的 workspace");
    return;
  }
  if (process.platform === "win32") {
    path2 = realPath(path2);
    path1 = realPath(path1);
    file = realPath(file);
  }

  store.setLogs("path1", path1);
  store.setLogs("path2", path2);
  const dir = fs.readdirSync(path1);
  const arr = dir.filter((ele) => ele.endsWith(".jar"));
  let choice: string | undefined;
  if (arr.length === 0) {
    vscode.window.showErrorMessage("没有检查到 jar 文件");
    return;
  }
  if (arr.length === 1) {
    choice = arr[0];
  } else {
    choice = await vscode.window.showQuickPick(arr, {
      placeHolder: "检查到当前目录有多个jar脚本请选择",
    });
  }

  if (!choice) return;
  const jarPath = resolve(path1, choice);

  if (!fs.existsSync(jarPath)) {
    vscode.window.showErrorMessage("您的目录下没有 KoolTest");
  } else {
    store.setLogs("file", file);
    const isDir = fs.lstatSync(file).isDirectory();
    store.setLogs("isDir", isDir);
    const isDebugging = isDir
      ? false
      : checkIsDebugging(fs.readFileSync(file).toString(), scenario);

    await killPort();

    const command =
      `java -jar ${jarPath} ${file} --script ${path2} --logDir ${path2}/.test --showProcess` +
      (scenario ? ` --name "^${scenario}$"` : "") +
      (isDebugging ? ` --remote-debugging-port 9222` : "");
    store.setLogs(command);
    // store.getChannel()?.show()
    vscode.window.showInformationMessage(command);
    const commandParams = command.split(/\s+/);
    vscode.window.showInformationMessage("KoolTest 正在运行");
    let terminal = store.getTerminal();
    if (!terminal) {
      terminal = vscode.window.createTerminal("KoolTest");
      store.setTerminal(terminal);
    }
    terminal.show();
    terminal.sendText(command);

    let watcher = store.getCucumberWatcher();
    if (watcher) {
      watcher.close();
    }
    watcher = fs.watch(
      path.resolve(path2 || "", ".test", "cucumber", "index.html"),
      async () => {
        const content = await spider.buildPage({
          url: path.resolve(path2 || "", ".test", "cucumber", "index.html"),
          timeout: 5000,
        });

        fs.writeFileSync(
          path.resolve(path2 || "", ".test", "cucumber", "index2.html"),
          content
        );
        store
          .getSideBar()
          ?.resolveWebviewView()
          .then(() => {
            vscode.commands.executeCommand("kool-rpa.focus");
            vscode.window.showInformationMessage("cucumber updated!");
          })
          .then(async () => {
            await store.getSideBar()?.refresh();
          });
      }
    );
    store.setCucumberWatcher(watcher);
  }
};

const checkIsDebugging = (content: string, scenario?: string): boolean => {
  let arr = content.split("\n").map((ele) => ele.trim());
  let key = `Scenario: ${scenario}`;
  let flag = false;
  for (let i in arr) {
    if (arr[i] === key) {
      flag = true;
    } else if (flag && arr[i].startsWith("Scenario")) {
      return false;
    }
    if (flag && arr[i] === "debugger") {
      return true;
    }
  }
  return false;
};
