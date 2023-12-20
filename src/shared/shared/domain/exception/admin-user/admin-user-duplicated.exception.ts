import { ConflictException } from '#shared/domain/exception/conflict.exception';

export class AdminUserDuplicatedException extends ConflictException {
  constructor() {
    super('sga.admin-user.duplicated');
  }
}
