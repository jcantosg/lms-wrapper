import { File } from '#shared/domain/file-manager/file';
import { FileManager } from '#shared/domain/file-manager/file-manager';
import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ImageUploader {
  private logger: Logger;
  constructor(private readonly fileManager: FileManager) {
    this.logger = new Logger(ImageUploader.name);
  }

  async uploadImage(image: string, imageName: string, directory: string) {
    const imageBuffer = Buffer.from(this.normalizeImage(image), 'base64');
    const fileUrl = await this.fileManager.uploadFile(
      new File(
        this.normalizeDirName(directory),
        this.generateFileName(image, imageName),
        imageBuffer,
        this.getMimeType(image),
      ),
    );

    return fileUrl;
  }

  private getMimeType(base64: string) {
    const part = base64.split(';')[0];

    return part.replace('data:', '');
  }

  private normalizeImage(base64: string): string {
    return base64.split(',')[1];
  }

  private normalizeDirName(name: string): string {
    return name.replaceAll(' ', '-');
  }

  private generateFileName(imageBase64: string, imageName: string): string {
    const extension = imageBase64.split(';')[0].split('/')[1];

    return `${imageName}-${uuid()}.${extension}`;
  }
}
