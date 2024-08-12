import { QueryHandler } from '#shared/domain/bus/query.handler';
import { CommunicationRepository } from '#shared/domain/repository/communication.repository';
import { GetCommunicationsQuery } from '#shared/application/communication/get-communications/get-communications.query';
import { GetCommunicationsCriteria } from '#shared/application/communication/get-communications/get-communications.criteria';
import { CollectionHandlerResponse } from '#/sga/shared/application/collection.handler.response';
import { Communication } from '#shared/domain/entity/communication.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

export class GetCommunicationsHandler implements QueryHandler {
  constructor(private readonly repository: CommunicationRepository) {}

  async handle(
    query: GetCommunicationsQuery,
  ): Promise<CollectionHandlerResponse<Communication>> {
    const criteria = new GetCommunicationsCriteria(query);

    const [communications, count] = await Promise.all([
      await this.repository.matching(
        criteria,
        query.adminUser.businessUnits,
        query.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
      ),
      await this.repository.count(
        criteria,
        query.adminUser.businessUnits,
        query.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
      ),
    ]);

    return {
      items: communications,
      total: count,
    };
  }
}
