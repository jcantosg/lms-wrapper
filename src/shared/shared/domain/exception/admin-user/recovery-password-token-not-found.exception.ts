import { NotFoundException } from '#shared/domain/exception/not-found.exception';

export class RecoveryPasswordTokenNotFoundException extends NotFoundException {
  constructor() {
    super('sga.user.recovery_password_token_not_found');
  }
}
