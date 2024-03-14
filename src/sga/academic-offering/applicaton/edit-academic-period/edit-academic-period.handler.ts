import { CommandHandler } from '#shared/domain/bus/command.handler';
import { AcademicPeriodRepository } from '#academic-offering/domain/repository/academic-period.repository';
import { EditAcademicPeriodCommand } from '#academic-offering/applicaton/edit-academic-period/edit-academic-period.command';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period-getter.service';

export class EditAcademicPeriodHandler implements CommandHandler {
  constructor(
    private readonly getter: AcademicPeriodGetter,
    private readonly repository: AcademicPeriodRepository,
  ) {}

  async handle(command: EditAcademicPeriodCommand): Promise<void> {
    const academicPeriod = await this.getter.getByAdminUser(
      command.id,
      command.adminUsersBusinessUnits,
      command.isSuperAdmin,
    );

    academicPeriod.name = command.name;
    academicPeriod.code = command.code;
    academicPeriod.startDate = command.startDate;
    academicPeriod.endDate = command.endDate;
    academicPeriod.updated();

    await this.repository.update(academicPeriod);
  }
}
