import { QueryHandler } from '#shared/domain/bus/query.handler';
import { CollectionHandlerResponse } from '#/sga/shared/application/collection.handler.response';
import { AcademicPeriodRepository } from '#academic-offering/domain/repository/academic-period.repository';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { SearchAcademicPeriodsQuery } from '#academic-offering/applicaton/academic-period/search-academic-periods/search-academic-periods.query';
import { SearchAcademicPeriodsCriteria } from '#academic-offering/applicaton/academic-period/search-academic-periods/search-academic-periods.criteria';

export class SearchAcademicPeriodsHandler implements QueryHandler {
  constructor(
    private readonly academicPeriodRepository: AcademicPeriodRepository,
  ) {}

  async handle(
    query: SearchAcademicPeriodsQuery,
  ): Promise<CollectionHandlerResponse<AcademicPeriod>> {
    const criteria = new SearchAcademicPeriodsCriteria(query);

    const [total, academicPeriods] = await Promise.all([
      this.academicPeriodRepository.count(
        criteria,
        query.adminUserBusinessUnits,
        query.isSuperAdmin,
      ),
      this.academicPeriodRepository.matching(
        criteria,
        query.adminUserBusinessUnits,
        query.isSuperAdmin,
      ),
    ]);

    return {
      total,
      items: academicPeriods,
    };
  }
}
