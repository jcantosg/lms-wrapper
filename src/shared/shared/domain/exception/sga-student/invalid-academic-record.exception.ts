import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class InvalidAcademicRecordException extends ConflictException {
  constructor() {
    super('student-360.academic-record.invalid');
  }
}
