import { Command } from '#shared/domain/bus/command';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class DeleteSubjectResourceCommand implements Command {
  constructor(
    public readonly subjectId: string,
    public readonly resourceId: string,
    public readonly adminUser: AdminUser,
  ) {}
}
