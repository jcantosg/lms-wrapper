import { Command } from '#shared/domain/bus/command';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class RemoveTeacherFromInternalGroupCommand implements Command {
  constructor(
    public readonly internalGroupId: string,
    public readonly edaeUserId: string,
    public readonly adminUser: AdminUser,
  ) {}
}
