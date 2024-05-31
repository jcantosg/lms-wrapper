import { Command } from '#shared/domain/bus/command';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class AddInternalGroupToAcademicPeriodCommand implements Command {
  constructor(
    public readonly id: string,
    public readonly academicPeriodId: string,
    public readonly prefix: string | null,
    public readonly sufix: string | null,
    public readonly academicProgramId: string,
    public readonly subjectId: string,
    public readonly edaeUserIds: string[],
    public readonly isDefaultGroup: boolean,
    public readonly adminUser: AdminUser,
  ) {}
}
