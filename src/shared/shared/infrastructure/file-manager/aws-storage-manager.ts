import { File } from '#shared/domain/file-manager/file';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { UploadFileException } from '#shared/domain/exception/shared/upload-file.exception';
import { FileManager } from '#shared/domain/file-manager/file-manager';

export class AWSStorageManager implements FileManager {
  private s3;

  constructor(
    readonly accessKeyId: string,
    readonly secretAccessKey: string,
    private readonly bucketName: string,
    readonly region: string,
  ) {
    this.s3 = new S3Client({
      credentials: {
        accessKeyId,
        secretAccessKey,
      },

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
      throw new UploadFileException();
    }

    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${file.directory}/${file.fileName}`;
  }
}
