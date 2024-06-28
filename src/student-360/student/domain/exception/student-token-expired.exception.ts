import { ForbiddenException } from '#shared/domain/exception/forbidden.exception';

export class StudentTokenExpiredException extends ForbiddenException {
  constructor() {
    super('student.student.expired-token');
  }
}
