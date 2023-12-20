import { ForbiddenException } from '#shared/domain/exception/forbidden.exception';

export class TokenExpiredException extends ForbiddenException {
  constructor() {
    super('sga.token.expired');
  }
}
