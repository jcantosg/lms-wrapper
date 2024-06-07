import { Command } from '#shared/domain/bus/command';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class AddSubjectCallCommand implements Command {
  constructor(
    public readonly enrollmentId: string,
    public readonly subjectCallId: string,
    public readonly adminUser: AdminUser,
  ) {}
}
