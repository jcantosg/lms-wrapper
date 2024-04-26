import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class StudentDuplicatedException extends ConflictException {
  constructor() {
    super('sga.student.duplicated');
  }
}
