import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { Command } from '#shared/domain/bus/command';

export class RemoveAcademicProgramFromAcademicPeriodCommand implements Command {
  constructor(
    public readonly academicPeriodId: string,
    public readonly academicProgramId: string,
    public readonly adminUser: AdminUser,
  ) {}
}
