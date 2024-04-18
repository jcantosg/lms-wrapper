import { Command } from '#shared/domain/bus/command';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class AddSubjectToProgramBlockCommand implements Command {
  constructor(
    public readonly programBlockId: string,
    public readonly subjectId: string,
    public readonly adminUser: AdminUser,
  ) {}
}
