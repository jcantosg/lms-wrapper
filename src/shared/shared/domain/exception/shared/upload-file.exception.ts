import { ApplicationException } from '#shared/domain/exception/application.exception';

export class UploadFileException extends ApplicationException {
  constructor() {
    super('sga.shared.upload-file-exception');
  }
}
