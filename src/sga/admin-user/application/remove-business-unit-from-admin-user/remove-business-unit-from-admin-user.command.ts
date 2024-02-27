import { Command } from '#shared/domain/bus/command';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class RemoveBusinessUnitFromAdminUserCommand implements Command {
  constructor(
    readonly id: string,
    readonly businessUnit: string,
    readonly user: AdminUser,
  ) {}
}
