import { QueryHandler } from '#shared/domain/bus/query.handler';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { GetAcademicPeriodsByBusinessUnitQuery } from '#academic-offering/applicaton/academic-period/get-academic-periods-by-business-unit/get-academic-periods-by-business-unit.query';
import { AcademicPeriodRepository } from '#academic-offering/domain/repository/academic-period.repository';
import { BusinessUnitNotFoundException } from '#shared/domain/exception/business-unit/business-unit/business-unit-not-found.exception';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

export class GetAcademicPeriodsByBusinessUnitHandler implements QueryHandler {
  constructor(
    private readonly academicPeriodRepository: AcademicPeriodRepository,
  ) {}

  async handle(
    query: GetAcademicPeriodsByBusinessUnitQuery,
  ): Promise<AcademicPeriod[]> {
    if (!query.adminUser.roles.includes(AdminUserRoles.SUPERADMIN)) {
      const isBusinessUnitAccessible = query.businessUnitIds.every((id) =>
        query.adminUser.businessUnits.some((bu) => bu.id === id),
      );

      if (!isBusinessUnitAccessible) {
        throw new BusinessUnitNotFoundException();
      }
    }

    return this.academicPeriodRepository.getByMultipleBusinessUnits(
      query.businessUnitIds,
    );
  }
}
