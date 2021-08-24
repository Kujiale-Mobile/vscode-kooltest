import { readFileSync } from "fs";
import { resolve } from "path";
import {
  Event,
  EventEmitter,
  ExtensionContext,
  ProviderResult,
  TreeDataProvider,
  TreeItem,
  workspace,
} from "vscode";

export default class Rpa implements TreeDataProvider<Macro> {
  constructor(private context: ExtensionContext) {}
  private _onDidChangeTreeData: EventEmitter<any> = new EventEmitter<any>();
  readonly onDidChangeTreeData: Event<any> = this._onDidChangeTreeData.event;
  getTreeItem(element: Macro): TreeItem | Thenable<TreeItem> {
    return element;
  }
  getChildren(element?: Macro): ProviderResult<Macro[]> {
    let path1 =
      workspace.workspaceFolders?.length &&
      workspace.workspaceFolders[0]?.uri.path;
    let pkgPath = resolve(path1 || "", "kool-test.json");
    let pkg = readFileSync(pkgPath, {
      encoding: "utf8",
    });
    let pkgJson = JSON.parse(pkg);
    return (pkgJson.macros || []).map(
      (ele: { name: string; version: string }) =>
        new Macro(ele.name, ele.version)
    );
  }
  refresh() {
    this._onDidChangeTreeData.fire(undefined);
  }
}

export class Macro extends TreeItem {
  constructor(public readonly label: string, public readonly version: string) {
    super(label);
    this.tooltip = `${this.label}`;
    this.command = {
      command: "kool-rpa.clickMacro",
      title: "",
      arguments: [this.tooltip],
    };
  }

  public iconPath? = "";
}
