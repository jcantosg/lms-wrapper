import { QueryHandler } from '#shared/domain/bus/query.handler';
import { AdministrativeGroupRepository } from '#student/domain/repository/administrative-group.repository';
import { CollectionHandlerResponse } from '#/sga/shared/application/collection.handler.response';
import { AdministrativeGroup } from '#student/domain/entity/administrative-group.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { SearchAdministrativeGroupsQuery } from '#student/application/administrative-group/search-administrative-groups/search-administrative-groups.query';
import { SearchAdministrativeGroupsCriteria } from '#student/application/administrative-group/search-administrative-groups/search-administrative-groups.criteria';

export class SearchAdministrativeGroupsHandler implements QueryHandler {
  constructor(private readonly repository: AdministrativeGroupRepository) {}

  async handle(
    query: SearchAdministrativeGroupsQuery,
  ): Promise<CollectionHandlerResponse<AdministrativeGroup>> {
    const criteria = new SearchAdministrativeGroupsCriteria(query);
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
