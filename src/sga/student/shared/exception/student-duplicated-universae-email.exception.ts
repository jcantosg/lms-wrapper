import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class StudentDuplicatedUniversaeEmailException extends ConflictException {
  constructor() {
    super('sga.student.duplicated-universae-email');
  }
}
