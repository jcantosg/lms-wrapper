import { ForbiddenException } from '#shared/domain/exception/forbidden.exception';

export class EdaeUserRefreshTokenRevokedException extends ForbiddenException {
  constructor() {
    super('edae360.edae-user.refresh-token-revoked');
  }
}
