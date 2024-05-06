import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class SubjectInvalidDefaultTeacherException extends ConflictException {
  constructor() {
    super('sga.subject.invalid-default-teacher');
  }
}
