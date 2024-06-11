import { File } from '#shared/domain/file-manager/file';
import { FileManager } from '#shared/domain/file-manager/file-manager';
import { Logger } from '@nestjs/common';
import * as fs from 'fs';

export class LocalStorageManager implements FileManager {
  private logger: Logger;
  constructor() {
    this.logger = new Logger(LocalStorageManager.name);
  }
  async uploadFile(file: File): Promise<string> {
    fs.writeFileSync(`files/${file.directory}/${file.fileName}`, file.content);

    return `files/${file.directory}/${file.fileName}`;
  }
  async deleteFile(url: string): Promise<void> {
    try {
      fs.unlinkSync(url);
    } catch (e) {
      this.logger.error('Local file not found.');
    }
  }
}
