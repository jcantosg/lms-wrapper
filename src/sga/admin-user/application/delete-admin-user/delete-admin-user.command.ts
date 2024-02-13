import { Command } from '#shared/domain/bus/command';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class DeleteAdminUserCommand implements Command {
  constructor(
    readonly userId: string,
    readonly user: AdminUser,
  ) {}
}
