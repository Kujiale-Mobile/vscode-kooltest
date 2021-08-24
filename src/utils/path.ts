import { existsSync } from "fs";

/**
 * 对 vscode 导出路径的 bug 进行处理
 */
export default (path: string) => {
  if (process.platform !== "win32") {
    return path;
  }
  if (existsSync(path)) {
    return path;
  } else if (existsSync(path.slice(1))) {
    return path.slice(1);
  }
  return path.slice(3);
};
