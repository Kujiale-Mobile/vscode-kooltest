import { exec } from "child_process";

export default async (): Promise<boolean> => {
  return new Promise((res, rej) => {
    exec('curl http://localhost:9515', (error, stdout, stderr) => {
      if (error) {
        res(false);
        return;
      }
      res(true);
    });
  });
}