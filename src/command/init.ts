import * as vscode from 'vscode';
import { addAllListenersScript, controller } from './../shared/excuteScript';
import { EVENTS } from './../shared/domEventsToRecord';
import stopRecorder from './stopRecorder';
import builder from './builder';
import { store } from '../store';
const index = async (
  document: vscode.TextDocument,
  context: string,
  scenario?: string,
) => {
  try {
    const driver = await builder();
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
      return;
    }
    const currentPage = currentPages[0];
    await currentPage.evaluate(controller(false));
    await currentPage.evaluate(addAllListenersScript(EVENTS));
    await currentPage.on('console', store.consoleHandler);
    await currentPage!.evaluate(controller(true));
    vscode.window
      .showInformationMessage('正在录制', '结束录制')
      .then(async res => {
        if (res === '结束录制') {
          await stopRecorder(document, context);
          await currentPage.off('console', store.consoleHandler);
        }
      });
    return currentPage;
  } catch (error) {
    vscode.window.showErrorMessage(error.message);
    throw error;
  }
};

export default index;
