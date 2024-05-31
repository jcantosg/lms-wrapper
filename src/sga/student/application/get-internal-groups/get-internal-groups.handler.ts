import { QueryHandler } from '#shared/domain/bus/query.handler';
import { CollectionHandlerResponse } from '#/sga/shared/application/collection.handler.response';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';
import { InternalGroup } from '#student/domain/entity/internal-group-entity';
import { GetInternalGroupsQuery } from '#student/application/get-internal-groups/get-internal-groups.query';
import { GetInternalGroupsCriteria } from '#student/application/get-internal-groups/get-internal-groups.criteria';

export class GetInternalGroupsHandler implements QueryHandler {
  constructor(private readonly repository: InternalGroupRepository) {}

  async handle(
    query: GetInternalGroupsQuery,
  ): Promise<CollectionHandlerResponse<InternalGroup>> {
    const criteria = new GetInternalGroupsCriteria(query);
    const [total, internalGroups] = await Promise.all([
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
      items: internalGroups,
    };
  }
}
