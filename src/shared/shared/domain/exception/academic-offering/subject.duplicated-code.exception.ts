import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class SubjectDuplicatedCodeException extends ConflictException {
  constructor() {
    super('sga.subject.duplicated-code');
  }
}
