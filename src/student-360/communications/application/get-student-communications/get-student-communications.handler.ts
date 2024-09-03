import { QueryHandler } from '#shared/domain/bus/query.handler';
import { CommunicationStudentRepository } from '#shared/domain/repository/communication-student.repository';
import { GetStudentCommunicationsQuery } from '#student-360/communications/application/get-student-communications/get-student-communications.query';
import { CommunicationStudent } from '#shared/domain/entity/communicarion-student.entity';

export class GetStudentCommunicationsHandler implements QueryHandler {
  constructor(
    private readonly communicationStudentRepository: CommunicationStudentRepository,
  ) {}

  async handle(
    query: GetStudentCommunicationsQuery,
  ): Promise<CommunicationStudent[]> {
    return await this.communicationStudentRepository.getByStudent(
      query.student.id,
    );
  }
}
