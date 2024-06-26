import { Command } from '#shared/domain/bus/command';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class AddTeacherToInternalGroupCommand implements Command {
  constructor(
    public readonly internalGroupId: string,
    public readonly edaeUserIds: string[],
    public readonly adminUser: AdminUser,
  ) {}
}
