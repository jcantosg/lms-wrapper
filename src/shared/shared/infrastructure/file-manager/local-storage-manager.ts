import { File } from '#shared/domain/file-manager/file';
import { FileManager } from '#shared/domain/file-manager/file-manager';
import * as fs from 'fs';

export class LocalStorageManager implements FileManager {
  async uploadFile(file: File): Promise<string> {
    fs.writeFileSync(`files/${file.directory}/${file.fileName}`, file.content);

    return `files/${file.directory}/${file.fileName}`;
  }
  async deleteFile(url: string): Promise<void> {
    try {
      fs.unlinkSync(url);
    } catch (e) {
      console.log('Local file not found.');
    }
  }
}
