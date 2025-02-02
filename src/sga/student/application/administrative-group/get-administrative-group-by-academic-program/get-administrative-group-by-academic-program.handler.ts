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
    const response =
      await this.administrativeGroupRepository.getByAcademicProgram(
        query.academicProgramId,
        query.adminUser.businessUnits.map((bu) => bu.id),
        query.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
      );

    const currentAdministrativeGroup =
      await this.administrativeGroupRepository.getByAdminUser(
        query.currentAdministrativeGroupId,
        query.adminUser.businessUnits.map((bu) => bu.id),
        query.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
      );

    if (currentAdministrativeGroup) {
      return response.filter(
        (ag) =>
          ag.programBlock.id !== currentAdministrativeGroup.programBlock.id ||
          ag.academicPeriod.id !== currentAdministrativeGroup.academicPeriod.id,
      );
    }

    return response;
  }
}
