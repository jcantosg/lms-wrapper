import { QueryHandler } from '#shared/domain/bus/query.handler';
import { CommunicationRepository } from '#shared/domain/repository/communication.repository';
import { GetCommunicationsQuery } from '#shared/application/communication/get-communications/get-communications.query';
import { GetCommunicationsCriteria } from '#shared/application/communication/get-communications/get-communications.criteria';
import { CollectionHandlerResponse } from '#/sga/shared/application/collection.handler.response';
import { Communication } from '#shared/domain/entity/communication.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { CommunicationStudent } from '#shared/domain/entity/communicarion-student.entity';
import { CommunicationStudentRepository } from '#shared/domain/repository/communication-student.repository';

export interface CommunicationWithStudents {
  communication: Communication;
  students: CommunicationStudent[];
}

export class GetCommunicationsHandler implements QueryHandler {
  constructor(
    private readonly repository: CommunicationRepository,
    private readonly communicationStudentRepository: CommunicationStudentRepository,
  ) {}

  async handle(
    query: GetCommunicationsQuery,
  ): Promise<CollectionHandlerResponse<CommunicationWithStudents>> {
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
      total: count,
    };
  }
}
