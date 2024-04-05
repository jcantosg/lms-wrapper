import { Command } from '#shared/domain/bus/command';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class AddAcademicProgramToAcademicPeriodCommand implements Command {
  constructor(
    readonly id: string,
    readonly academicProgramId: string,
    readonly user: AdminUser,
  ) {}
}
