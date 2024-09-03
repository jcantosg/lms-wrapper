import { QueryHandler } from '#shared/domain/bus/query.handler';
import { CommunicationStudentRepository } from '#shared/domain/repository/communication-student.repository';
import { GetNewCommunicationsCountQuery } from '#student-360/communications/application/get-new-communications-count/get-new-communications-count.query';

export class GetNewCommunicationsCountHandler implements QueryHandler {
  constructor(
    private readonly communicationStudentRepository: CommunicationStudentRepository,
  ) {}

  async handle(query: GetNewCommunicationsCountQuery): Promise<number> {
    return await this.communicationStudentRepository.countUnread(
      query.student.id,
    );
  }
}
