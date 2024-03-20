import { Command } from '#shared/domain/bus/command';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class AddEdaeUsersToSubjectCommand implements Command {
  constructor(
    public readonly id: string,
    public readonly edaeUsers: string[],
    public readonly adminUser: AdminUser,
  ) {}
}
