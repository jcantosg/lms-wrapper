import { UnauthorizedException } from '#shared/domain/exception/unauthorized.exception';

export class MaximumLoginAttemptsException extends UnauthorizedException {
  constructor() {
    super('sga.admin-user.blocked');
  }
}
