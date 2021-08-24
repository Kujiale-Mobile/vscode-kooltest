import * as vscode from "vscode";
import * as webdriver from "selenium-webdriver";
import init from "./command/init";
import start from "./command/startRecorder";
import stop from "./command/stopRecorder";
import AutoComplete from "./syntaxes/auto-complete";
import Hover from "./syntaxes/hover";
import provideDefinition from "./syntaxes/provideDefinition";
import provideCSV from "./syntaxes/provideCSV";
import { codeLensController } from "./codelens/codelenController";
import screenShot from "./command/screenShot";
import play from "./command/jarRunner";
import Rpa from "./treeview/rpaTreeView";
import { openLogger } from "./command/openLoggerWebview";
import { LogManager } from "./logManager";
import { store } from "./store";
import { SidebarProvider } from "./webview/siderBarWebview";
import autoFillContent from "./autoFillContent/autoFillContent";
const SUPPORT_LANGUAGES = ["gherkin"];
export function activate(
  context: vscode.ExtensionContext & { driver: webdriver.WebDriver }
) {
  const rpaProvider = new Rpa(context);
  vscode.commands.registerCommand("kool-rpa.refresh", () => {
    rpaProvider.refresh();
  });
  vscode.commands.registerCommand("kool-rpa.init", (document, context) => {
    init(document, context);
  });
  vscode.commands.registerCommand("kool-rpa.start", (document, content) => {
    start(document, content);
  });
  vscode.commands.registerCommand("kool-rpa.logger", (log: string) => {
    openLogger(log);
  });
  vscode.commands.registerCommand("kool-rpa.run", (document) => {
    play(document.path, context);
  });
  vscode.commands.registerCommand("kool-rpa.runAll", (document) => {
    play(document.path, context);
  });
  /** 回放 */
  vscode.commands.registerCommand(
    "kool-rpa.play",
    (fileName: string, scenario?: string) => {
      play(fileName, context, scenario);
    }
  );
  vscode.commands.registerCommand("kool-rpa.stop", (document, content) => {
    stop(document, content);
  });
  vscode.commands.registerCommand(
    "kool-rpa.screenShot",
    (document, content, isFeature, scenario) => {
      screenShot(document, content, isFeature, scenario);
    }
  );
  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(SUPPORT_LANGUAGES, {
      provideDefinition,
    }),
    vscode.languages.registerDefinitionProvider(SUPPORT_LANGUAGES, {
      provideDefinition: provideCSV,
    })
  );
  context.subscriptions.push(codeLensController);
  AutoComplete(context);
  Hover(context);
  const logManager = new LogManager();
  store.setChannel(logManager._outputChannel);
  context.subscriptions.push(logManager);
  // -------- sidebar 相关 -----------
  const sidebarProvider = new SidebarProvider(context.extensionUri);

  store.setSideBar(sidebarProvider);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("kool-rpa", sidebarProvider)
  );
  autoFillContent();
}

export function deactivate() {}
