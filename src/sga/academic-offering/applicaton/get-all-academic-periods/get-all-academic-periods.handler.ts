import { QueryHandler } from '#shared/domain/bus/query.handler';
import { CollectionHandlerResponse } from '#/sga/shared/application/collection.handler.response';
import { AcademicPeriodRepository } from '#academic-offering/domain/repository/academic-period.repository';
import { GetAllAcademicPeriodsQuery } from '#academic-offering/applicaton/get-all-academic-periods/get-all-academic-periods.query';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { GetAllAcademicPeriodsCriteria } from '#academic-offering/applicaton/get-all-academic-periods/get-all-academic-periods.criteria';

export class GetAllAcademicPeriodsHandler implements QueryHandler {
  constructor(
    private readonly academicPeriodRepository: AcademicPeriodRepository,
  ) {}

  async handle(
    query: GetAllAcademicPeriodsQuery,
  ): Promise<CollectionHandlerResponse<AcademicPeriod>> {
    const criteria = new GetAllAcademicPeriodsCriteria(query);

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
