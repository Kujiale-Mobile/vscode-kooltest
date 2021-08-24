import * as vscode from 'vscode';
import { controller, screenShotCommand } from '../shared/excuteScript';
import { store } from '../store';
import * as fs from 'fs';
import * as path from 'path';
import init from './init';
import { Page } from 'puppeteer-core';
/**
 * 如果是从 feature 触发，push进当前文件
 * 如果从 marco 触发 走正常流程
 */
export default async (
  document: vscode.TextDocument,
  context: string,
  isFeature: boolean = false,
  scenario?: string,
) => {
  let page = await init(document, context, scenario);

  try {
    if (!store.getShoting()) {
      /**
       * 需点击生成截图 截图记录才会被保存
       */
      vscode.window
        .showInformationMessage('正在截图...', '生成截图', '取消')
        .then(async val => {
          try {
            if (val === '生成截图') {
              // 获取截图 log
              let arr = store.getConsoleManager();
              let re = /\{(.+?)\}/i;
              let logs = arr.filter(ele => ele.startsWith('recorder event'));
              if (page === undefined) {
                vscode.window.showErrorMessage('请运行脚本！');
                return;
              }
              for (let i = logs.length - 1; i >= 0; i--) {
                logs[i].match(re);
                let type = RegExp.$1;
                if (!type) {
                  return '';
                }
                let str = `recorder event {${type}}: `;
                // logger 是截图，发出截图命令
                if (type === 'screenshot') {
                  logs[i].replace(str, '');
                  const pathName = logs[i].replace(str, '').split(' ')[0];
                  const position = logs[i]
                    .replace(str, '')
                    .split(' ')[1]
                    .slice(1, -1);
                  await page.evaluate(screenShotCommand(false));
                  vscode.workspace.workspaceFolders?.length &&
                    checkDir(
                      path.resolve(
                        vscode.workspace.workspaceFolders[0].uri.path,
                        'output',
                      ),
                    );
                  vscode.workspace.workspaceFolders?.length &&
                    (await page!.screenshot({
                      path: path.resolve(
                        vscode.workspace.workspaceFolders[0].uri.path,
                        'output/' + pathName + '.png',
                      ),
                    }));

                  if (scenario) {
                    let contentArr = context.split('\n');
                    contentArr.splice(
                      searchScenarioLine(context, scenario),
                      0,
                      `    * assert_exists "image://output/${pathName}.png" ${position}`,
                    );
                    fs.writeFileSync(document.fileName, contentArr.join('\n'));
                    break;
                  }
                  fs.writeFileSync(
                    document.fileName,
                    context +
                      '\n' +
                      `      * assert_exists "image://output/${pathName}.png" ${position}`,
                  );
                  break;
                }
              }
              // 截图
              await page.evaluate(screenShotCommand(false));
              await page.evaluate(controller(false));
              return true;
            } else {
              return false;
            }
          } catch (error) {
            // 主要捕捉 浏览器被删情况
            store.setLogs(error);
          }
        });
    }
    if (!page) {
      return;
    }
    await page!.evaluate(controller(false));
    await page!.evaluate(`
  window.KOOLTESTMASKSTART = ''
  window.KOOLTESTMASKEND = ''
  window.KOOLTESTMASK = document.createElement('div')
  window.KOOLTESTMASKSHOW = true
  window.KOOLTESTMASK.id = 'KOOLTESTMASK'
  window.KOOLTESTMASK.style = 'z-index: 99999; width: 100vw; height:100vh; position: fixed; top: 0; left: 0'
  window.shotSelector = document.createElement('div')
  document.body.appendChild(window.KOOLTESTMASK)
  window.KOOLTESTMASK.appendChild(window.shotSelector)
  !window.KOOLTESTMASKADDED && window.addEventListener('click', (e) => {
    if (!window.KOOLTESTMASKSHOW) return;
    if (window.KOOLTESTMASKSTART) {
      window.KOOLTESTMASKEND = [e.clientX ,e.clientY]
      let left = Math.min(window.KOOLTESTMASKEND[0], window.KOOLTESTMASKSTART[0])
      let top = Math.min(window.KOOLTESTMASKEND[1], window.KOOLTESTMASKSTART[1])
      let width = Math.abs(window.KOOLTESTMASKEND[0] - window.KOOLTESTMASKSTART[0])
      let height = Math.abs(window.KOOLTESTMASKEND[1] - window.KOOLTESTMASKSTART[1])
      console.warn('recorder event {screenshot}:', +new Date(), left + ',' + top + ',' + width + ',' + height)
      window.KOOLTESTMASKSTART = ''
    } else {
      window.KOOLTESTMASKSTART = [e.clientX ,e.clientY]
    }
  })
  !window.KOOLTESTMASKADDED && window.addEventListener('mousemove', (e) => {
    if (window.KOOLTESTMASKSTART) {
      let left = Math.min(e.clientX, window.KOOLTESTMASKSTART[0])
      let top = Math.min(e.clientY, window.KOOLTESTMASKSTART[1])
      let width = Math.abs(e.clientX - window.KOOLTESTMASKSTART[0])
      let height = Math.abs(e.clientY - window.KOOLTESTMASKSTART[1])
      window.shotSelector.style = 'border: 2px red solid; position: absolute; left:' + left + 'px;top:' + top + 'px;width:' + width+ 'px;height:' + height + 'px;';
    }
  })
  window.KOOLTESTMASKADDED = true
  `);
    vscode.window.showInformationMessage('开始截图...');
  } catch (error) {
    vscode.window.showErrorMessage('请在调试模式下使用截图功能');
    return;
  }
};

// scenario 最后的换行
const searchScenarioLine = (content: string, scenario: string) => {
  let contentArr = content.split('\n');
  let target = `Scenario: ${scenario}`;
  for (let i = 0; i < contentArr.length; i++) {
    const line = contentArr[i].trim();
    const res = line.startsWith(target);
    if (res) {
      i++;
      while (i < contentArr.length) {
        if (contentArr[i].trim() === '') {
          return i;
        } else if (
          contentArr[i].trim().startsWith('Scenario') ||
          contentArr[i].trim().startsWith('debugger')
        ) {
          return i;
        }
        i++;
      }
      return contentArr.length;
    }
  }
  return contentArr.length;
};

const checkDir = (path: string) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
  return;
};
