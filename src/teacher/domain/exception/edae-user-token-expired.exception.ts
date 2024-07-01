import { ForbiddenException } from '#shared/domain/exception/forbidden.exception';

export class EdaeUserTokenExpiredException extends ForbiddenException {
  constructor() {
    super('edae360.edae-user.expired-token');
  }
}
