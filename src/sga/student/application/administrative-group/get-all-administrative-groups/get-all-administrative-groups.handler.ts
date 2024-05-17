import { QueryHandler } from '#shared/domain/bus/query.handler';
import { AdministrativeGroupRepository } from '#student/domain/repository/administrative-group.repository';
import { GetAllAdministrativeGroupsQuery } from '#student/application/administrative-group/get-all-administrative-groups/get-all-administrative-groups.query';
import { CollectionHandlerResponse } from '#/sga/shared/application/collection.handler.response';
import { AdministrativeGroup } from '#student/domain/entity/administrative-group.entity';
import { GetAllAdministrativeGroupsCriteria } from '#student/application/administrative-group/get-all-administrative-groups/get-all-administrative-groups.criteria';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

export class GetAllAdministrativeGroupsHandler implements QueryHandler {
  constructor(private readonly repository: AdministrativeGroupRepository) {}

  async handle(
    query: GetAllAdministrativeGroupsQuery,
  ): Promise<CollectionHandlerResponse<AdministrativeGroup>> {
    const criteria = new GetAllAdministrativeGroupsCriteria(query);
    const [total, administrativeGroups] = await Promise.all([
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
      items: administrativeGroups,
    };
  }
}
