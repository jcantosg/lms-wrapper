import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class StudentRecoveryPasswordTokenExpiredException extends ConflictException {
  constructor() {
    super('student.student-recovery-pasword-token-expired');
  }
}
