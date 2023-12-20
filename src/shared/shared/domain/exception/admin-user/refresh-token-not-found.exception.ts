import { NotFoundException } from '#shared/domain/exception/not-found.exception';

export class RefreshTokenNotFoundException extends NotFoundException {
  constructor() {
    super('sga.user.refresh_token_not_found');
  }
}
