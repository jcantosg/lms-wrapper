import { NotFoundException } from '#shared/domain/exception/not-found.exception';

export class StudentRecoveryPasswordTokenNotFoundException extends NotFoundException {
  constructor() {
    super('student.student-recovery-password-token.not-found');
  }
}
