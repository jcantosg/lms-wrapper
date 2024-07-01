import { NotFoundException } from '#shared/domain/exception/not-found.exception';

export class EdaeUserRefreshTokenNotFoundException extends NotFoundException {
  constructor() {
    super('edae360.edae-user.refresh-token-not-found');
  }
}
