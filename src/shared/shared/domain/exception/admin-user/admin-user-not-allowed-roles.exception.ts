import { ForbiddenException } from '#shared/domain/exception/forbidden.exception';

export class AdminUserNotAllowedRolesException extends ForbiddenException {
  constructor() {
    super('sga.admin-user.not-allowed-roles');
  }
}
