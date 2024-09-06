import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class InvalidSubjectTypeException extends ConflictException {
  constructor() {
    super('sga.subject.invalid-type');
  }
}
