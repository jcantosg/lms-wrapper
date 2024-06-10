import { Command } from '#shared/domain/bus/command';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class RemoveSubjectCallCommand implements Command {
  constructor(
    public readonly subjectCallId: string,
    public readonly adminUser: AdminUser,
  ) {}
}
