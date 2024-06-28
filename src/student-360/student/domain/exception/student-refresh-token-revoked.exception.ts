import { ForbiddenException } from '#shared/domain/exception/forbidden.exception';

export class StudentRefreshTokenRevokedException extends ForbiddenException {
  constructor() {
    super('student.student.refresh-token-revoked');
  }
}
