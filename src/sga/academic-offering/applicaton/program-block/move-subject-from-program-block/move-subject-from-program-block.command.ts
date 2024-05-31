import { Command } from '#shared/domain/bus/command';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class MoveSubjectFromProgramBlockCommand implements Command {
  constructor(
    public readonly subjectIds: string[],
    public readonly newBlockId: string,
    public readonly adminUser: AdminUser,
    public readonly currentBlockId: string,
  ) {}
}
