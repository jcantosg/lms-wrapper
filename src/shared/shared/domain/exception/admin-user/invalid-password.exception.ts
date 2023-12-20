import { ForbiddenException } from '#shared/domain/exception/forbidden.exception';

export class InvalidPasswordException extends ForbiddenException {
  constructor() {
    super('sga.user.invalid_password');
  }
}
