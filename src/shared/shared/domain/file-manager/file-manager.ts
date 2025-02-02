import { File } from './file';

export abstract class FileManager {
  public abstract uploadFile(file: File): Promise<string>;
  public abstract deleteFile(url: string): Promise<void>;
}
