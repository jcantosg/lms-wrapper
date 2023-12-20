import { ForbiddenException } from '#shared/domain/exception/forbidden.exception';

export class TokenMalformedException extends ForbiddenException {
  constructor() {
    super('sga.token.malformed');
  }
}
