import { QueryHandler } from '#shared/domain/bus/query.handler';
import { AcademicProgramRepository } from '#academic-offering/domain/repository/academic-program.repository';
import { SearchAcademicProgramsQuery } from '#academic-offering/applicaton/academic-program/search-academic-programs/search-academic-programs.query';
import { CollectionHandlerResponse } from '#/sga/shared/application/collection.handler.response';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { SearchAcademicProgramsCriteria } from '#academic-offering/applicaton/academic-program/search-academic-programs/search-academic-programs.criteria';

export class SearchAcademicProgramsHandler implements QueryHandler {
  constructor(private readonly repository: AcademicProgramRepository) {}

  async handle(
    query: SearchAcademicProgramsQuery,
  ): Promise<CollectionHandlerResponse<AcademicProgram>> {
    const criteria = new SearchAcademicProgramsCriteria(query);
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
