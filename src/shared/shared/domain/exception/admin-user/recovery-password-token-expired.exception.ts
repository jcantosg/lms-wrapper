import { ForbiddenException } from '#shared/domain/exception/forbidden.exception';

export class RecoveryPasswordTokenExpiredException extends ForbiddenException {
  constructor() {
    super('sga.user.recovery-password-token-exception');
  }
}
