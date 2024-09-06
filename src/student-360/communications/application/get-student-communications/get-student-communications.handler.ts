import { QueryHandler } from '#shared/domain/bus/query.handler';
import { CommunicationStudentRepository } from '#shared/domain/repository/communication-student.repository';
import { GetStudentCommunicationsQuery } from '#student-360/communications/application/get-student-communications/get-student-communications.query';
import { CommunicationStudent } from '#shared/domain/entity/communicarion-student.entity';
import { GetStudentCommunicationsCriteria } from '#student-360/communications/application/get-student-communications/get-student-communications.criteria';

export class GetStudentCommunicationsHandler implements QueryHandler {
  constructor(
    private readonly communicationStudentRepository: CommunicationStudentRepository,
  ) {}

  async handle(
    query: GetStudentCommunicationsQuery,
  ): Promise<CommunicationStudent[]> {
    const criteria = new GetStudentCommunicationsCriteria(query);

    return await this.communicationStudentRepository.matching(criteria);
  }
}
