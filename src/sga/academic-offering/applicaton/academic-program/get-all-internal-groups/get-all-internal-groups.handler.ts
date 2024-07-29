import { QueryHandler } from '#shared/domain/bus/query.handler';
import { CollectionHandlerResponse } from '#/sga/shared/application/collection.handler.response';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';
import { InternalGroup } from '#student/domain/entity/internal-group.entity';
import { GetAllInternalGroupsQuery } from '#academic-offering/applicaton/academic-program/get-all-internal-groups/get-all-internal-groups.query';
import { GetAllInternalGroupsCriteria } from '#academic-offering/applicaton/academic-program/get-all-internal-groups/get-all-internal-groups.criteria';

export class GetAllInternalGroupsHandler implements QueryHandler {
  constructor(private readonly repository: InternalGroupRepository) {}

  async handle(
    query: GetAllInternalGroupsQuery,
  ): Promise<CollectionHandlerResponse<InternalGroup>> {
    const criteria = new GetAllInternalGroupsCriteria(query);
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
