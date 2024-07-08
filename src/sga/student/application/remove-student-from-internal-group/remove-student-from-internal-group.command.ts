import { Command } from '#shared/domain/bus/command';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class RemoveStudentFromInternalGroupCommand implements Command {
  constructor(
    public readonly internalGroupId: string,
    public readonly studentId: string,
    public readonly adminUser: AdminUser,
  ) {}
}
