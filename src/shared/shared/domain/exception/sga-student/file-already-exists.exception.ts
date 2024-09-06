import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class FileAlreadyExistsException extends ConflictException {
  constructor() {
    super('sga.student.file-already-exists');
  }
}
