import { QueryHandler } from '#shared/domain/bus/query.handler';
import { GetInternalGroupsByBuPeriodsAndProgramsQuery } from '#student/application/get-internal-groups-by-bu-periods-and-programs/get-internal-groups-by-bu-periods-and-programs.query';
import { InternalGroup } from '#student/domain/entity/internal-group.entity';
import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';

export class GetInternalGroupsByBuPeriodsAndProgramsHandler
  implements QueryHandler
{
  constructor(
    private readonly internalGroupRepository: InternalGroupRepository,
  ) {}

  async handle(
    query: GetInternalGroupsByBuPeriodsAndProgramsQuery,
  ): Promise<InternalGroup[]> {
    return await this.internalGroupRepository.getByBusinessUnitsAndPeriodsAndPrograms(
      query.businessUnitIds,
      query.academicPeriodIds,
      query.academicProgramIds,
    );
  }
}
