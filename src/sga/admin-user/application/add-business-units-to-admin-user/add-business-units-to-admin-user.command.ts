import { Command } from '#shared/domain/bus/command';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class AddBusinessUnitsToAdminUserCommand implements Command {
  constructor(
    readonly id: string,
    readonly businessUnits: string[],
    readonly user: AdminUser,
  ) {}
}
