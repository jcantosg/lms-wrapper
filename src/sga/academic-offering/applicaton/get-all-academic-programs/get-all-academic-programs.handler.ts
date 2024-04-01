import { QueryHandler } from '#shared/domain/bus/query.handler';
import { AcademicProgramRepository } from '#academic-offering/domain/repository/academic-program.repository';
import { GetAllAcademicProgramsQuery } from '#academic-offering/applicaton/get-all-academic-programs/get-all-academic-programs.query';
import { CollectionHandlerResponse } from '#/sga/shared/application/collection.handler.response';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { GetAllAcademicsProgramsCriteria } from '#academic-offering/applicaton/get-all-academic-programs/get-all-academics-programs.criteria';

export class GetAllAcademicProgramsHandler implements QueryHandler {
  constructor(private readonly repository: AcademicProgramRepository) {}

  async handle(
    query: GetAllAcademicProgramsQuery,
  ): Promise<CollectionHandlerResponse<AcademicProgram>> {
    const criteria = new GetAllAcademicsProgramsCriteria(query);
    const [total, academicPrograms] = await Promise.all([
      this.repository.count(
        criteria,
        query.adminUserBusinessUnits,
        query.isSuperAdmin,
      ),
      this.repository.matching(
        criteria,
        query.adminUserBusinessUnits,
        query.isSuperAdmin,
      ),
    ]);

    return {
      total,
      items: academicPrograms,
    };
  }
}
