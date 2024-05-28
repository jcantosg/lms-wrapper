import { CommandHandler } from '#shared/domain/bus/command.handler';
import { AdministrativeGroupRepository } from '#student/domain/repository/administrative-group.repository';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { AcademicProgramGetter } from '#academic-offering/domain/service/academic-program/academic-program-getter.service';
import { CreateAdministrativeGroupCommand } from '#student/application/administrative-group/create-administrative-group/create-administrative-group.command';
import { AcademicPeriodNotFoundException } from '#shared/domain/exception/academic-offering/academic-period.not-found.exception';
import { AcademicProgramNotFoundException } from '#shared/domain/exception/academic-offering/academic-program.not-found.exception';
import { AdministrativeGroup } from '#student/domain/entity/administrative-group.entity';
import { UUIDGeneratorService } from '#shared/domain/service/uuid-service';
import { AdministrativeGroupDuplicatedCodeException } from '#shared/domain/exception/administrative-group/administrative-group.duplicated-code.exception';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BlockRelationRepository } from '#academic-offering/domain/repository/block-relation.repository';
import { BlockRelationNotFoundException } from '#shared/domain/exception/academic-offering/block-relation.not-found.exception';

export class CreateAdministrativeGroupHandler implements CommandHandler {
  constructor(
    private readonly administrativeGroupRepository: AdministrativeGroupRepository,
    private readonly blockRelationRepository: BlockRelationRepository,
    private businessUnitGetter: BusinessUnitGetter,
    private academicPeriodGetter: AcademicPeriodGetter,
    private academicProgramGetter: AcademicProgramGetter,
    private uuidService: UUIDGeneratorService,
  ) {}

  async handle(command: CreateAdministrativeGroupCommand) {
    const businessUnit = await this.businessUnitGetter.getByAdminUser(
      command.businessUnitId,
      command.adminUser.businessUnits.map((bu) => bu.id),
    );

    const academicPeriod = await this.academicPeriodGetter.get(
      command.academicPeriodId,
    );

    if (academicPeriod.businessUnit.id !== businessUnit.id) {
      throw new AcademicPeriodNotFoundException();
    }

    const administrativeGroups: AdministrativeGroup[] = [];

    await Promise.all(
      command.academicProgramIds.map(async (academicProgramId) => {
        const academicProgram =
          await this.academicProgramGetter.get(academicProgramId);

        if (academicProgram.businessUnit.id !== businessUnit.id) {
          throw new AcademicProgramNotFoundException();
        }
        if (
          !academicPeriod.academicPrograms
            .map((program) => program.id)
            .includes(academicProgramId)
        ) {
          throw new AcademicPeriodNotFoundException();
        }

        administrativeGroups.push(
          ...(await this.createAdministrativeGroups(
            academicPeriod,
            academicProgram,
            businessUnit,
            command.adminUser,
          )),
        );
      }),
    );

    await this.validateAdministrativeGroupsUniqueness(administrativeGroups);
    await this.administrativeGroupRepository.saveBatch(administrativeGroups);
  }

  private async validateAdministrativeGroupsUniqueness(
    administrativeGroups: AdministrativeGroup[],
  ) {
    await Promise.all(
      administrativeGroups.map(async (administrativeGroup) => {
        if (
          await this.administrativeGroupRepository.existsByCode(
            administrativeGroup.id,
            administrativeGroup.code,
          )
        ) {
          throw new AdministrativeGroupDuplicatedCodeException();
        }
      }),
    );
  }

  private async createAdministrativeGroups(
    academicPeriod: AcademicPeriod,
    academicProgram: AcademicProgram,
    businessUnit: BusinessUnit,
    adminUser: AdminUser,
  ): Promise<AdministrativeGroup[]> {
    return Promise.all(
      academicProgram.programBlocks
        .slice()
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        .map(async (programBlock, index) => {
          const blockRelation =
            await this.blockRelationRepository.getByProgramBlockAndAcademicPeriod(
              programBlock,
              academicPeriod,
            );

          if (!blockRelation) {
            throw new BlockRelationNotFoundException();
          }

          return AdministrativeGroup.create(
            this.uuidService.generate(),
            this.generateCode(academicPeriod.code, academicProgram.code, index),
            businessUnit,
            academicPeriod,
            academicProgram,
            programBlock,
            blockRelation.periodBlock,
            adminUser,
          );
        }),
    );
  }
  private generateCode(
    academicPeriod: string,
    academicProgram: string,
    index: number,
  ): string {
    return `${academicPeriod}_${academicProgram}_${index + 1}`;
  }
}
