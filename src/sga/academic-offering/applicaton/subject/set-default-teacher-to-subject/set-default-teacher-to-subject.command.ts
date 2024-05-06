import { Command } from '#shared/domain/bus/command';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class SetDefaultTeacherToSubjectCommand implements Command {
  constructor(
    public readonly id: string,
    public readonly teacherId: string,
    public readonly adminUser: AdminUser,
  ) {}
}
