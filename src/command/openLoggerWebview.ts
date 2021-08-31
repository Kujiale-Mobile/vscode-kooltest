import { LoggerWebview } from '../webview/loggerWebview';

export async function openLogger(log: string): Promise<void> {
  const loggerWebview: LoggerWebview = new LoggerWebview(log);
  loggerWebview.show();
  return;
}
