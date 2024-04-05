import { QueryHandler } from '#shared/domain/bus/query.handler';
import { AcademicProgramRepository } from '#academic-offering/domain/repository/academic-program.repository';
import { TitleRepository } from '#academic-offering/domain/repository/title.repository';
import { SearchAcademicProgramsByTitleQuery } from '#academic-offering/applicaton/search-academic-programs-by-title/search-academic-programs-by-title.query';
import { CollectionHandlerResponse } from '#/sga/shared/application/collection.handler.response';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { SearchAcademicProgramsByTitleCriteria } from '#academic-offering/applicaton/search-academic-programs-by-title/search-academic-programs-by-title.criteria';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { TitleNotFoundException } from '#shared/domain/exception/academic-offering/title-not-found.exception';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

export class SearchAcademicProgramsByTitleHandler implements QueryHandler {
  constructor(
    private readonly repository: AcademicProgramRepository,
    private readonly titleRepository: TitleRepository,
  ) {}

  async handle(
    query: SearchAcademicProgramsByTitleQuery,
  ): Promise<CollectionHandlerResponse<AcademicProgram>> {
    if (
      !(await this.titleRepository.existsByAdminUser(
        query.titleId,
        query.adminUser.businessUnits.map(
          (businessUnit: BusinessUnit) => businessUnit.id,
        ),
        query.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
      ))
    ) {
      throw new TitleNotFoundException();
    }
    const criteria = new SearchAcademicProgramsByTitleCriteria(query);
    const [total, academicPrograms] = await Promise.all([
      await this.repository.count(
        criteria,
        query.adminUser.businessUnits,
        query.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
      ),
      await this.repository.matching(
        criteria,
        query.adminUser.businessUnits,
        query.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
      ),
    ]);

    return {
      total: total,
      items: academicPrograms,
    };
  }
}
