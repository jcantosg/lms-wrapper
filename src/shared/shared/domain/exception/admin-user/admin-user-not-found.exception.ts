import { NotFoundException } from '#shared/domain/exception/not-found.exception';

export class AdminUserNotFoundException extends NotFoundException {
  constructor() {
    super('sga.admin-user.not-found');
  }
}
