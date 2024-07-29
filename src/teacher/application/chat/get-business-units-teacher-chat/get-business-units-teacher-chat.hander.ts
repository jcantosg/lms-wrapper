import { QueryHandler } from '#shared/domain/bus/query.handler';
import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';
import { GetBusinessUnitsTeacherChatQuery } from '#/teacher/application/chat/get-business-units-teacher-chat/get-business-units-teacher-chat.query';

export class GetBusinessUnitsTeacherChatHandler implements QueryHandler {
  constructor(
    private readonly internalGroupRepository: InternalGroupRepository,
  ) {}
  async handle(query: GetBusinessUnitsTeacherChatQuery) {
    return await this.internalGroupRepository.getAllByTeacher(
      query.edaeUser.id,
    );
  }
}
