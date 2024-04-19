import { Command } from '#shared/domain/bus/command';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class RemoveSubjectFromProgramBlockCommand implements Command {
  constructor(
    public readonly subjectIds: string[],
    public readonly programBlockId: string,
    public readonly adminUser: AdminUser,
  ) {}
}
