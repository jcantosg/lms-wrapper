import { ApplicationException } from '#shared/domain/exception/application.exception';

export class DeleteFileException extends ApplicationException {
  constructor() {
    super('sga.shared.delete-file-exception');
  }
}
