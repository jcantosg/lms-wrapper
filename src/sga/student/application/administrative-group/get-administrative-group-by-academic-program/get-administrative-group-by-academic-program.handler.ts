import { QueryHandler } from '#shared/domain/bus/query.handler';
import { AdministrativeGroupRepository } from '#student/domain/repository/administrative-group.repository';
import { AdministrativeGroup } from '#student/domain/entity/administrative-group.entity';
import { GetAdministrativeGroupByAcademicProgramQuery } from '#student/application/administrative-group/get-administrative-group-by-academic-program/get-administrative-group-by-academic-program.query';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

export class GetAdministrativeGroupByAcademicProgramHandler
  implements QueryHandler
{
  constructor(
    private readonly administrativeGroupRepository: AdministrativeGroupRepository,
  ) {}

  async handle(
    query: GetAdministrativeGroupByAcademicProgramQuery,
  ): Promise<AdministrativeGroup[]> {
    return await this.administrativeGroupRepository.getByAcademicProgram(
      query.academicProgramId,
      query.adminUser.businessUnits.map((bu) => bu.id),
      query.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );
  }
}
