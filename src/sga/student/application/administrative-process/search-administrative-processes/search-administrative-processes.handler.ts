import { QueryHandler } from '#shared/domain/bus/query.handler';
import { CollectionHandlerResponse } from '#/sga/shared/application/collection.handler.response';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { AdministrativeProcessRepository } from '#student/domain/repository/administrative-process.repository';
import { AdministrativeProcess } from '#student/domain/entity/administrative-process.entity';
import { SearchAdministrativeProcessesQuery } from '#student/application/administrative-process/search-administrative-processes/search-administrative-processes.query';
import { SearchAdministrativeProcessesCriteria } from '#student/application/administrative-process/search-administrative-processes/search-administrative-processes.criteria';

export class SearchAdministrativeProcessesHandler implements QueryHandler {
  constructor(private readonly repository: AdministrativeProcessRepository) {}

  async handle(
    query: SearchAdministrativeProcessesQuery,
  ): Promise<CollectionHandlerResponse<AdministrativeProcess>> {
    const criteria = new SearchAdministrativeProcessesCriteria(query);
    const [total, administrativeProcesses] = await Promise.all([
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
      items: administrativeProcesses,
    };
  }
}
