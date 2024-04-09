import { Command } from '#shared/domain/bus/command';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class RemoveEdaeUserFromSubjectCommand implements Command {
  constructor(
    public readonly id: string,
    public readonly edaeUser: string,
    public readonly adminUser: AdminUser,
  ) {}
}
