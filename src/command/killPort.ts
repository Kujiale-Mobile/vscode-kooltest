import { exec, ChildProcess } from 'child_process';
import { kill } from 'process';
import { store } from '../store';
const pids = require('port-pid');

export default async () => {
  let cp: ChildProcess;
  if (store.getDriver()) {
    store.getDriver()?.close();
    return;
  }
  const isRunning = await new Promise(res => {
    cp = exec('curl http://localhost:9222', error => {
      if (error) {
        res(false);
        return;
      }
      res(true);
    });
  });
  // @ts-ignore
  isRunning && cp.kill();
  if (isRunning) {
    let pid = await pids(9222, 3);
    /**
     * 只 kill tcp 协议
     */
    for await (const id of pid.tcp) {
      await kill(id);
    }
  }
  return;
};
