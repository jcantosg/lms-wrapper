import { QueryHandler } from '#shared/domain/bus/query.handler';
import { CommunicationRepository } from '#shared/domain/repository/communication.repository';
import { SearchCommunicationsQuery } from '#shared/application/communication/search-communications/search-communications.query';
import { CollectionHandlerResponse } from '#/sga/shared/application/collection.handler.response';
import { Communication } from '#shared/domain/entity/communication.entity';
import { SearchCommunicationsCriteria } from '#shared/application/communication/search-communications/search-communications.criteria';

export class SearchCommunicationsHandler implements QueryHandler {
  constructor(private readonly repository: CommunicationRepository) {}

  async handle(
    query: SearchCommunicationsQuery,
  ): Promise<CollectionHandlerResponse<Communication>> {
    const criteria = new SearchCommunicationsCriteria(query);
    const [communications, total] = await Promise.all([
      await this.repository.matching(
        criteria,
        query.adminUser.businessUnits,
        query.adminUser.isSuperAdmin(),
      ),
      await this.repository.count(
        criteria,
        query.adminUser.businessUnits,
        query.adminUser.isSuperAdmin(),
      ),
    ]);

    return {
      items: communications,
      total,
    };
  }
}
