import { FSWatcher } from "fs";
import * as puppeteer from "puppeteer-core";
import * as vscode from "vscode";
import { commands } from "vscode";
import { removeColor } from "./shared/utils";
import { SidebarProvider } from "./webview/siderBarWebview";
class Store {
  driver?: puppeteer.Browser;
  isShoting?: boolean;
  shotHash: {
    [key: string]: true;
  } = {};
  logsCache: string[] = [];
  consoleManager: string[] = [];
  channel?: vscode.OutputChannel;
  sideBar?: SidebarProvider;
  dp: any;
  terminal?: vscode.Terminal;
  cucumberWatcher?: FSWatcher;
  setDriver(d: puppeteer.Browser) {
    this.driver = d;
  }
  getDriver() {
    return this.driver;
  }
  setShoting(b: boolean) {
    this.isShoting = b;
  }
  getShoting() {
    return this.isShoting;
  }
  /**
   * 设置截图
   */
  setShotHash(key: string) {
    this.shotHash[key] = true;
    return this.shotHash;
  }
  /**
   * 比对是否截图
   */
  getShotHash() {
    return this.shotHash;
  }
  /**
   * log 表
   */
  getLogs() {
    return this.logsCache;
  }
  /**
   * log 表
   * TODO: 不同颜色
   */
  async setLogs(...strs: any[]) {
    let pureStrings = strs.map((str) => {
      return removeColor(str);
    });
    this.channel?.appendLine(pureStrings.join(" "));
    this.logsCache.unshift(pureStrings.join(" "));
    console.log(...strs);
    if (this.logsCache.length > 2000) {
      this.logsCache.length = 2000;
    }
    await commands.executeCommand("kool-rpa.refresh");
    return this.logsCache;
  }
  setChannel(val: vscode.OutputChannel) {
    this.channel = val;
  }
  getChannel() {
    return this.channel;
  }

  setConsoleManager(msg: string) {
    this.consoleManager.push(msg);
  }
  clearConsoleManager() {
    this.consoleManager = [];
  }
  getConsoleManager() {
    return this.consoleManager;
  }
  consoleHandler = (message: { text: () => string }) => {
    console.log(message.text());
    this.setConsoleManager(message.text());
  };
  setSideBar(sb: SidebarProvider) {
    this.sideBar = sb;
  }
  getSideBar() {
    return this.sideBar;
  }
  setDp(dp: any) {
    this.dp = dp;
  }
  getDp() {
    return this.dp;
  }
  setTerminal(terminal: vscode.Terminal) {
    this.terminal = terminal;
  }
  getTerminal() {
    return this.terminal;
  }
  setCucumberWatcher(watch: FSWatcher) {
    this.cucumberWatcher = watch;
  }
  getCucumberWatcher() {
    return this.cucumberWatcher;
  }
}

export const store = new Store();
