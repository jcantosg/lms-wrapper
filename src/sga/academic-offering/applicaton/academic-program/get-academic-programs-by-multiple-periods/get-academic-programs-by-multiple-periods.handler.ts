import { Injectable } from '@nestjs/common';
import { AcademicProgramRepository } from '#academic-offering/domain/repository/academic-program.repository';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { GetAcademicProgramsByPeriodsQuery } from '#academic-offering/applicaton/academic-program/get-academic-programs-by-multiple-periods/get-academic-programs-by-multiple-periods.query';

@Injectable()
export class GetAcademicProgramsByPeriodsHandler {
  constructor(
    private readonly academicProgramRepository: AcademicProgramRepository,
  ) {}

  async handle(query: GetAcademicProgramsByPeriodsQuery) {
    const { academicPeriodIds, titleIds, adminUser } = query;
    const businessUnitIds = adminUser.businessUnits.map((bu) => bu.id);
    const isSuperAdmin = adminUser.roles.includes(AdminUserRoles.SUPERADMIN);

    return await this.academicProgramRepository.getByAcademicPeriodsAndTitles(
      academicPeriodIds,
      titleIds,
      businessUnitIds,
      isSuperAdmin,
    );
  }
}
