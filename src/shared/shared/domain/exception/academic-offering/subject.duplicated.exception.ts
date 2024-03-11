import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class SubjectDuplicatedException extends ConflictException {
  constructor() {
    super('sga.subject.duplicated');
  }
}
