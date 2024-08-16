import { QueryHandler } from '#shared/domain/bus/query.handler';
import { CommunicationRepository } from '#shared/domain/repository/communication.repository';
import { GetCommunicationQuery } from '#shared/application/communication/get-communication/get-communication.query';
import { CommunicationNotFoundException } from '#shared/domain/exception/communication/communication.not-found.exception';
import { CommunicationWithStudents } from '#shared/application/communication/get-communications/get-communications.handler';
import { CommunicationStudentRepository } from '#shared/domain/repository/communication-student.repository';

export class GetCommunicationHandler implements QueryHandler {
  constructor(
    private readonly repository: CommunicationRepository,
    private readonly communicationStudentRepository: CommunicationStudentRepository,
  ) {}

  async handle(
    query: GetCommunicationQuery,
  ): Promise<CommunicationWithStudents> {
    const communication = await this.repository.get(query.id);

    if (!communication) {
      throw new CommunicationNotFoundException();
    }

    return {
      communication,
      students: await this.communicationStudentRepository.getByCommunication(
        communication.id,
      ),
    };
  }
}
