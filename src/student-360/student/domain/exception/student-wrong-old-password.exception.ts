import { UnauthorizedException } from '#shared/domain/exception/unauthorized.exception';

export class StudentWrongOldPasswordException extends UnauthorizedException {
  constructor() {
    super('student-360.student.old-password-wrong');
  }
}
