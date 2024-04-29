import { QueryHandler } from '#shared/domain/bus/query.handler';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { GetAcademicPeriodsByBusinessUnitQuery } from '#academic-offering/applicaton/academic-period/get-academic-periods-by-business-unit/get-academic-periods-by-business-unit.query';
import { AcademicPeriodRepository } from '#academic-offering/domain/repository/academic-period.repository';
import { BusinessUnitNotFoundException } from '#shared/domain/exception/business-unit/business-unit/business-unit-not-found.exception';

export class GetAcademicPeriodsByBusinessUnitHandler implements QueryHandler {
  constructor(
    private readonly academicPeriodRepository: AcademicPeriodRepository,
  ) {}

  async handle(
    query: GetAcademicPeriodsByBusinessUnitQuery,
  ): Promise<AcademicPeriod[]> {
    const isBusinessUnitAccessible = query.adminUser.businessUnits.some(
      (bu) => {
        return bu.id === query.businessUnit;
      },
    );

    if (!isBusinessUnitAccessible) {
      throw new BusinessUnitNotFoundException();
    }

    return this.academicPeriodRepository.getByBusinessUnit(query.businessUnit);
  }
}
