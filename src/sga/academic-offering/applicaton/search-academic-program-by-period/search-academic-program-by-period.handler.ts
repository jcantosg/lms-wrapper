import { CollectionHandlerResponse } from '#/sga/shared/application/collection.handler.response';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { AcademicProgramRepository } from '#academic-offering/domain/repository/academic-program.repository';
import { QueryHandler } from '#shared/domain/bus/query.handler';
import { SearchAcademicProgramsByAcademicPeriodQuery } from '#academic-offering/applicaton/search-academic-program-by-period/search-academic-program-by-period.query';
import { SearchAcademicProgramByAcademicPeriodCriteria } from '#academic-offering/applicaton/search-academic-program-by-period/search-academic-program-by-period.criteria';
import { AcademicPeriodRepository } from '#academic-offering/domain/repository/academic-period.repository';
import { AcademicPeriodNotFoundException } from '#shared/domain/exception/academic-offering/academic-period.not-found.exception';

export class SearchAcademicProgramByAcademicPeriodHandler
  implements QueryHandler
{
  constructor(
    private readonly academicProgramRepository: AcademicProgramRepository,
    private readonly academicPeriodRepository: AcademicPeriodRepository,
  ) {}

  async handle(
    query: SearchAcademicProgramsByAcademicPeriodQuery,
  ): Promise<CollectionHandlerResponse<AcademicProgram>> {
    if (
      !(await this.academicPeriodRepository.existsById(query.academicPeriodId))
    ) {
      throw new AcademicPeriodNotFoundException();
    }

    const criteria = new SearchAcademicProgramByAcademicPeriodCriteria(query);

    const [total, academicPrograms] = await Promise.all([
      this.academicProgramRepository.count(
        criteria,
        query.adminBusinessUnits,
        query.isSuperAdmin,
      ),
      this.academicProgramRepository.matching(
        criteria,
        query.adminBusinessUnits,
        query.isSuperAdmin,
      ),
    ]);

    return {
      total,
      items: academicPrograms,
    };
  }
}
