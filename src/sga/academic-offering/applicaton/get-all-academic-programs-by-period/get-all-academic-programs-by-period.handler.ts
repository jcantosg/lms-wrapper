import { CollectionHandlerResponse } from '#/sga/shared/application/collection.handler.response';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { AcademicProgramRepository } from '#academic-offering/domain/repository/academic-program.repository';
import { QueryHandler } from '#shared/domain/bus/query.handler';
import { ListAcademicProgramByPeriodCriteria } from './get-all-academic-program-by-period.criteria';
import { GetAllAcademicProgramsByPeriodQuery } from '#academic-offering/applicaton/get-all-academic-programs-by-period/get-all-academic-programs-by-period.query';
import { AcademicPeriodRepository } from '#academic-offering/domain/repository/academic-period.repository';
import { AcademicPeriodNotFoundException } from '#shared/domain/exception/academic-offering/academic-period.not-found.exception';

export class GetAllAcademicProgramByAcademicPeriodHandler
  implements QueryHandler
{
  constructor(
    private readonly academicProgramRepository: AcademicProgramRepository,
    private readonly academicPeriodRepository: AcademicPeriodRepository,
  ) {}

  async handle(
    query: GetAllAcademicProgramsByPeriodQuery,
  ): Promise<CollectionHandlerResponse<AcademicProgram>> {
    if (
      !(await this.academicPeriodRepository.existsById(query.academicPeriodId))
    ) {
      throw new AcademicPeriodNotFoundException();
    }

    const criteria = new ListAcademicProgramByPeriodCriteria(query);

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
