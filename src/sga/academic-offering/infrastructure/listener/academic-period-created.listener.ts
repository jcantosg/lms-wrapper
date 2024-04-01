import { Injectable } from '@nestjs/common';
import { AcademicPeriodRepository } from '#academic-offering/domain/repository/academic-period.repository';
import { AcademicProgramRepository } from '#academic-offering/domain/repository/academic-program.repository';
import { AcademicPeriodCreatedEvent } from '#academic-offering/domain/event/academic-period/academic-period-created.event';
import { OnEvent } from '@nestjs/event-emitter';
import { GetAcademicProgramsByBusinessUnitCriteria } from '#academic-offering/infrastructure/listener/get-academic-programs-by-business-unit.criteria';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { AcademicPeriodGetter } from '#academic-offering/domain/service/academic-period-getter.service';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

@Injectable()
export class AcademicPeriodCreatedListener {
  constructor(
    private readonly academicPeriodGetter: AcademicPeriodGetter,
    private readonly academicPeriodRepository: AcademicPeriodRepository,
    private readonly academicProgramRepository: AcademicProgramRepository,
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
    /*@TODO filter by block number*/
    const academicPeriod = await this.academicPeriodGetter.getByAdminUser(
      payload.academicPeriodId,
      payload.adminUser.businessUnits.map(
        (businessUnit: BusinessUnit) => businessUnit.id,
      ),
      payload.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );
    academicPeriod.academicPrograms = academicPrograms;
    await this.academicPeriodRepository.save(academicPeriod);
  }
}
