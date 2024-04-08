import { CommandHandler } from '#shared/domain/bus/command.handler';
import { AcademicPeriodRepository } from '#academic-offering/domain/repository/academic-period.repository';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period-getter.service';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program-getter.service';
import { RemoveAcademicProgramFromAcademicPeriodCommand } from '#academic-offering/applicaton/remove-academic-program-from-academic-period/remove-academic-program-from-academic-period.command';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

export class RemoveAcademicProgramFromAcademicPeriodHandler
  implements CommandHandler
{
  constructor(
    private readonly academicPeriodGetter: AcademicPeriodGetter,
    private readonly academicProgramGetter: AcademicProgramGetter,
    private readonly repository: AcademicPeriodRepository,
  ) {}

  async handle(
    command: RemoveAcademicProgramFromAcademicPeriodCommand,
  ): Promise<void> {
    const academicPeriod = await this.academicPeriodGetter.getByAdminUser(
      command.academicPeriodId,
      command.adminUser.businessUnits.map((bu) => bu.id),
      command.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    const academicProgram = await this.academicProgramGetter.getByAdminUser(
      command.academicProgramId,
      command.adminUser.businessUnits.map((bu) => bu.id),
      command.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    academicPeriod.removeAcademicProgram(academicProgram);
    academicPeriod.updated();

    await this.repository.update(academicPeriod);
  }
}
