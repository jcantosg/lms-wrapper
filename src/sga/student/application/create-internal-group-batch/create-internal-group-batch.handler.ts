import { CommandHandler } from '#shared/domain/bus/command.handler';
import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';
import { CreateInternalGroupsBatchCommand } from '#student/application/create-internal-group-batch/create-internal-group-batch.command';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { BlockRelationRepository } from '#academic-offering/domain/repository/block-relation.repository';
import { ProgramBlock } from '#academic-offering/domain/entity/program-block.entity';
import { PeriodBlock } from '#academic-offering/domain/entity/period-block.entity';
import { InternalGroup } from '#student/domain/entity/internal-group.entity';
import { AcademicProgramNotFoundException } from '#shared/domain/exception/academic-offering/academic-program.not-found.exception';
import { AcademicPeriodNotFoundException } from '#shared/domain/exception/academic-offering/academic-period.not-found.exception';
import { UUIDGeneratorService } from '#shared/domain/service/uuid-service';

export class CreateInternalGroupsBatchHandler implements CommandHandler {
  constructor(
    private readonly repository: InternalGroupRepository,
    private readonly academicPeriodGetter: AcademicPeriodGetter,
    private readonly academicProgramGetter: AcademicProgramGetter,
    private readonly blockRelationRepository: BlockRelationRepository,
    private readonly uuidGenerator: UUIDGeneratorService,
  ) {}

  async handle(command: CreateInternalGroupsBatchCommand): Promise<void> {
    const academicPeriod = await this.academicPeriodGetter.getByAdminUser(
      command.academicPeriodId,
      command.adminUser.businessUnits.map((bu) => bu.id),
      command.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );
    const internalGroups: InternalGroup[] = [];

    await Promise.all(
      command.academicPrograms.map(async (academicProgramId) => {
        const academicProgram = await this.academicProgramGetter.getByAdminUser(
          academicProgramId,
          command.adminUser.businessUnits.map((bu) => bu.id),
          command.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
        );

        if (
          !academicProgram.academicPeriods
            .map((period) => period.id)
            .includes(academicPeriod.id)
        ) {
          throw new AcademicPeriodNotFoundException();
        }

        await Promise.all(
          academicProgram.programBlocks.map(async (programBlock) => {
            const periodBlock = await this.getPeriodBlock(
              programBlock,
              command.academicPeriodId,
            );

            await Promise.all(
              programBlock.subjects.map(async (subject) => {
                const existentInternalGroups = await this.repository.getByKeys(
                  academicPeriod,
                  academicProgram,
                  subject,
                );

                if (existentInternalGroups.length > 0 && command.isDefault) {
                  for (const existentInternalGroup of existentInternalGroups) {
                    existentInternalGroup.isDefault = false;
                    internalGroups.push(existentInternalGroup);
                  }
                }

                internalGroups.push(
                  InternalGroup.create(
                    this.uuidGenerator.generate(),
                    `${command.prefix ?? ''}${command.prefix ? ' ' : ''}${
                      academicProgram.code
                    } ${subject.code} ${
                      academicPeriod.code
                    } ${this.getInternalGroupNumber(existentInternalGroups)}${
                      command.sufix ? ' ' : ''
                    }${command.sufix ?? ''}`,
                    [],
                    subject.defaultTeacher ? [subject.defaultTeacher] : [],
                    academicPeriod,
                    academicProgram,
                    periodBlock,
                    subject,
                    academicPeriod.businessUnit,
                    existentInternalGroups.length === 0 || command.isDefault,
                    command.adminUser,
                    subject.defaultTeacher,
                  ),
                );
              }),
            );
          }),
        );
      }),
    );

    await this.repository.saveBatch(internalGroups);
  }

  private getInternalGroupNumber(
    existentInternalGroups: InternalGroup[],
  ): number {
    return existentInternalGroups.length;
  }

  private async getPeriodBlock(
    programBlock: ProgramBlock,
    academicPeriodId: string,
  ): Promise<PeriodBlock> {
    const blockRelations =
      await this.blockRelationRepository.getByProgramBlock(programBlock);

    const relation = blockRelations.find(
      (br) => br.periodBlock.academicPeriod.id === academicPeriodId,
    );

    if (!relation) {
      throw new AcademicProgramNotFoundException();
    }

    return relation.periodBlock;
  }
}
