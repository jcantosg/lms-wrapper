import { QueryHandler } from '#shared/domain/bus/query.handler';
import { CommunicationRepository } from '#shared/domain/repository/communication.repository';
import { SearchCommunicationsQuery } from '#shared/application/communication/search-communications/search-communications.query';
import { CollectionHandlerResponse } from '#/sga/shared/application/collection.handler.response';
import { SearchCommunicationsCriteria } from '#shared/application/communication/search-communications/search-communications.criteria';
import { CommunicationWithStudents } from '#shared/application/communication/get-communications/get-communications.handler';
import { CommunicationStudentRepository } from '#shared/domain/repository/communication-student.repository';

export class SearchCommunicationsHandler implements QueryHandler {
  constructor(
    private readonly repository: CommunicationRepository,
    private readonly communicationStudentRepository: CommunicationStudentRepository,
  ) {}

  async handle(
    query: SearchCommunicationsQuery,
  ): Promise<CollectionHandlerResponse<CommunicationWithStudents>> {
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

    const items: CommunicationWithStudents[] = [];
    for (const communication of communications) {
      items.push({
        communication,
        students: await this.communicationStudentRepository.getByCommunication(
          communication.id,
        ),
      });
    }

    return {
      items,
      total,
    };
  }
}
