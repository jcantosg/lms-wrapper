import { ForbiddenException } from '#shared/domain/exception/forbidden.exception';

export class RefreshTokenRevokedException extends ForbiddenException {
  constructor() {
    super('sga.user.refresh_token_revoked');
  }
}
