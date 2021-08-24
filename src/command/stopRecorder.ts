import * as vscode from 'vscode';
import { writeFileSync } from 'fs';
import { window } from 'vscode';
import { MARCROTYPE } from '../shared/domEventsToRecord';
import { controller } from '../shared/excuteScript';
import { store } from '../store';

export default async (document: vscode.TextDocument, content: string) => {
  const driver = await store.getDriver();
  if (driver === undefined) {
    throw Error('尚未开始录制');
  }
  const pages = await driver.pages();
  let currentPages = await Promise.all(
    pages.map(async page => {
      const visible = await page.evaluate(
        //@ts-ignore
        () => document['visibilityState'] === 'visible',
      );
      // @ts-ignore
      page.visibilityState = visible;
      return page;
    }),
  );
  // @ts-ignore
  currentPages = currentPages.filter(ele => ele.visibilityState);
  if (currentPages.length === 0) {
    return 'all pages hidden';
  }
  const currentPage = currentPages[0];
  currentPage.evaluate(controller(false));
  let arr = store.getConsoleManager();
  let re = /\{(.+?)\}/i;
  let lastMove: boolean = false;
  let prefix = (arr: string[]) => {
    arr.pop();
    arr.pop();
    let pre = arr.join(' ');
    return pre;
  };
  let logs = arr.filter(ele => ele.startsWith('recorder event'));
  let delta: number[] | null = null;
  logs = logs
    .map((ele, index) => {
      ele.match(re);
      let type = RegExp.$1;
      if (!type) {
        return '';
      }
      let str = `recorder event {${type}}:`;
      if (type === 'mousemove' && !lastMove) {
        lastMove = true;
      } else if (type !== 'mousemove') {
        lastMove = false;
      } else {
        if (
          logs[index + 1] &&
          logs[index + 1].startsWith('recorder event {mousemove}:')
        ) {
          return '';
        }
      }

      if (type === 'screenshot') {
        str = `recorder event {${type}}: `;
        const ret = ele.replace(str, '').split(' ');
        const pathName = ret[0];
        const position = ret[1].slice(1, -1);
        if (!store.shotHash[pathName]) {
          return '';
        }
        return `* assert_exists "image://output/${pathName}.png" ${position}`;
      }

      // @ts-ignore
      return ele.replace(str, `* ${MARCROTYPE[type]}`);
    })
    .filter(ele => ele);
  if (logs.length === 0) {
    window.showErrorMessage('录制记录为空');
    return;
  }

  document.fileName.endsWith('.macro') &&
    writeFileSync(document.fileName, logs.join('\n'));
  store.clearConsoleManager();
};
