import { File } from '#shared/domain/file-manager/file';
import { FileManager } from '#shared/domain/file-manager/file-manager';
import * as fs from 'fs';

export class LocalStorageManager implements FileManager {
  async uploadFile(file: File): Promise<string> {
    fs.writeFileSync(`files/${file.directory}/${file.fileName}`, file.content);

    return `files/${file.directory}/${file.fileName}`;
  }
}
