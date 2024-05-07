import { v4 as uuid } from 'uuid';
import { Injectable } from '@nestjs/common';
import { AcademicPeriodRepository } from '#academic-offering/domain/repository/academic-period.repository';
import { AcademicProgramRepository } from '#academic-offering/domain/repository/academic-program.repository';
import { AcademicPeriodCreatedEvent } from '#academic-offering/domain/event/academic-period/academic-period-created.event';
import { OnEvent } from '@nestjs/event-emitter';
import { GetAcademicProgramsByBusinessUnitCriteria } from '#academic-offering/infrastructure/listener/get-academic-programs-by-business-unit.criteria';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period/academic-period-getter.service';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { BlockRelationRepository } from '#academic-offering/domain/repository/block-relation.repository';
import { BlockRelation } from '#academic-offering/domain/entity/block-relation.entity';

@Injectable()
export class AcademicPeriodCreatedListener {
  constructor(
    private readonly academicPeriodGetter: AcademicPeriodGetter,
    private readonly academicPeriodRepository: AcademicPeriodRepository,
    private readonly academicProgramRepository: AcademicProgramRepository,
    private readonly blockRelationRepository: BlockRelationRepository,
  ) {}

  @OnEvent('academic-period-created')
  async handleAcademicPeriodCreatedEvent(payload: AcademicPeriodCreatedEvent) {
    const criteria = new GetAcademicProgramsByBusinessUnitCriteria(
      payload.academicPeriodBusinessUnit,
    );
    const academicPrograms = await this.academicProgramRepository.matching(
      criteria,
      payload.adminUser.businessUnits,
      payload.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    const academicPeriod = await this.academicPeriodGetter.getByAdminUser(
      payload.academicPeriodId,
      payload.adminUser.businessUnits.map(
        (businessUnit: BusinessUnit) => businessUnit.id,
      ),
      payload.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    academicPeriod.academicPrograms = academicPrograms.filter(
      (academicProgram) =>
        academicProgram.programBlocks.length === academicPeriod.blocksNumber,
    );
    await this.academicPeriodRepository.save(academicPeriod);

    for (const academicProgram of academicPeriod.academicPrograms) {
      const programBlocksSorted = academicProgram.programBlocks.sort(
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
                payload.adminUser,
              ),
            ),
        ),
      ]);
    }
  }
}
