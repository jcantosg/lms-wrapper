import { v4 as uuid } from 'uuid';
import { CommandHandler } from '#shared/domain/bus/command.handler';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { AcademicProgramNotFoundException } from '#shared/domain/exception/academic-offering/academic-program.not-found.exception';
import { AcademicPeriodRepository } from '#academic-offering/domain/repository/academic-period.repository';
import { AddAcademicProgramToAcademicPeriodCommand } from '#academic-offering/applicaton/academic-program/add-academic-program-to-academic-period/add-academic-program-to-academic-period.command';
import { BlockRelationRepository } from '#academic-offering/domain/repository/block-relation.repository';
import { BlockRelation } from '#academic-offering/domain/entity/block-relation.entity';

export class AddAcademicProgramToAcademicPeriodHandler
  implements CommandHandler
{
  constructor(
    private readonly academicPeriodRepository: AcademicPeriodRepository,
    private readonly academicPeriodGetter: AcademicPeriodGetter,
    private readonly academicProgramGetter: AcademicProgramGetter,
    private readonly blockRelationRepository: BlockRelationRepository,
  ) {}

  async handle(
    command: AddAcademicProgramToAcademicPeriodCommand,
  ): Promise<void> {
    const adminUserBusinessUnits = command.user.businessUnits.map(
      (bu) => bu.id,
    );

    const academicPeriod = await this.academicPeriodGetter.getByAdminUser(
      command.id,
      adminUserBusinessUnits,
      command.user.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    const academicProgramToAdd =
      await this.academicProgramGetter.getByAdminUser(
        command.academicProgramId,
        adminUserBusinessUnits,
        command.user.roles.includes(AdminUserRoles.SUPERADMIN),
      );

    if (
      academicPeriod.businessUnit.id !== academicProgramToAdd.businessUnit.id
    ) {
      throw new AcademicProgramNotFoundException();
    }

    academicPeriod.addAcademicProgram(academicProgramToAdd);

    await this.academicPeriodRepository.save(academicPeriod);

    const programBlocksSorted = academicProgramToAdd.programBlocks.sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    );
    const periodBlocksSorted = academicPeriod.periodBlocks.sort(
      (a, b) => a.startDate.getTime() - b.startDate.getTime(),
    );

    await Promise.all([
      periodBlocksSorted.map(
        async (periodBlock, index) =>
          await this.blockRelationRepository.save(
            BlockRelation.create(
              uuid(),
              periodBlock,
              programBlocksSorted[index],
              command.user,
            ),
          ),
      ),
    ]);
  }
}
