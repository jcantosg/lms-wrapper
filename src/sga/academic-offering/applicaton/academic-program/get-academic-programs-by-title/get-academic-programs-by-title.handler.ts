import { QueryHandler } from '#shared/domain/bus/query.handler';
import { AcademicProgramRepository } from '#academic-offering/domain/repository/academic-program.repository';
import { CollectionHandlerResponse } from '#/sga/shared/application/collection.handler.response';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { TitleRepository } from '#academic-offering/domain/repository/title.repository';
import { TitleNotFoundException } from '#shared/domain/exception/academic-offering/title-not-found.exception';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { GetAcademicProgramsByTitleQuery } from '#academic-offering/applicaton/academic-program/get-academic-programs-by-title/get-academic-programs-by-title.query';
import { GetAcademicProgramsByTitleCriteria } from '#academic-offering/applicaton/academic-program/get-academic-programs-by-title/get-academic-programs-by-title.criteria';

export class GetAcademicProgramsByTitleHandler implements QueryHandler {
  constructor(
    private readonly repository: AcademicProgramRepository,
    private readonly titleRepository: TitleRepository,
  ) {}

  async handle(
    query: GetAcademicProgramsByTitleQuery,
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
    const criteria = new GetAcademicProgramsByTitleCriteria(query);
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
