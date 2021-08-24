import * as vscode from "vscode";
import init from "./init";
export default async (document: vscode.TextDocument, context: string) => {
  try {
    await init(document, context);
  } catch (error) {
    vscode.window.showInformationMessage(error.message);
    await init(document, context);
  }
};
