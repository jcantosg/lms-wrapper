import { Command } from '#shared/domain/bus/command';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class AddStudentToInternalGroupCommand implements Command {
  constructor(
    public readonly internalGroupId: string,
    public readonly studentIds: string[],
    public readonly adminUser: AdminUser,
  ) {}
}
