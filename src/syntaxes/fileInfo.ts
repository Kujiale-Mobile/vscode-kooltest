import * as path from 'path';
import * as fs from 'fs';

/**
 * 文件信息
 */
export class FileInfo {
  private type: string;
  private name: string;
  private itemPath: string;
  public token?: string;

  constructor(itemPath: string) {
    this.itemPath = itemPath;
    this.type = fs.statSync(itemPath).isDirectory() ? 'dir' : 'file';
    this.name = path.basename(itemPath);
  }

  isDirectory(): boolean {
    return this.type ==='dir';
  }

  getPath() {
    return this.itemPath;
  }

  getName() {
    return this.name;
  }
}
