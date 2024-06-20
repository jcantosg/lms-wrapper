import { File } from '#shared/domain/file-manager/file';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { UploadFileException } from '#shared/domain/exception/shared/upload-file.exception';
import { FileManager } from '#shared/domain/file-manager/file-manager';
import { DeleteFileException } from '#shared/domain/exception/shared/delete-file.exception';
import { Logger } from '@nestjs/common';

export class AWSStorageManager implements FileManager {
  private s3;

  constructor(
    private readonly bucketName: string,
    readonly region: string,
    private readonly logger: Logger,
  ) {
    this.s3 = new S3Client({
      region,
    });
  }

  public async uploadFile(file: File): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: `${file.directory}/${file.fileName}`,
      Body: file.content,
      ACL: 'public-read',
      ContentType: file.contentType ?? 'image',
    });

    try {
      await this.s3.send(command);
    } catch (e) {
      this.logger.error(e.mesagge);
      throw new UploadFileException();
    }

    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${file.directory}/${file.fileName}`;
  }

  public async deleteFile(url: string): Promise<void> {
    const key = this.getKeyFromUrl(url);

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      await this.s3.send(command);
    } catch (e) {
      this.logger.error(e.mesagge);
      throw new DeleteFileException();
    }
  }

  private getKeyFromUrl(url: string) {
    const parts = url.split('.amazonaws.com/');

    return parts[1];
  }
}
