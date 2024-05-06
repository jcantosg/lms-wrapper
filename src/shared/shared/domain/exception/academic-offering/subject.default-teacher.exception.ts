import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class SubjectDefaultTeacherException extends ConflictException {
  constructor() {
    super('sga.subject.default-teacher');
  }
}
