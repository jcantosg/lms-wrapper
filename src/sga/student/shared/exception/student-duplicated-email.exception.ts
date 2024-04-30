import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class StudentDuplicatedEmailException extends ConflictException {
  constructor() {
    super('sga.student.duplicated-email');
  }
}
