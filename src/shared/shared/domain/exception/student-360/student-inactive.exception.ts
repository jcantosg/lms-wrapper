import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class StudentInactiveException extends ConflictException {
  constructor() {
    super('student-360.student.inactive');
  }
}
