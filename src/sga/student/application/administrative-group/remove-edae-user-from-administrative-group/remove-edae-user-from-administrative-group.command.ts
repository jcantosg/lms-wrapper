import { Command } from '#shared/domain/bus/command';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class RemoveEdaeUserFromAdministrativeGroupCommand implements Command {
  constructor(
    public readonly administrativeGroupId: string,
    public readonly edaeUserId: string,
    public readonly adminUser: AdminUser,
  ) {}
}
