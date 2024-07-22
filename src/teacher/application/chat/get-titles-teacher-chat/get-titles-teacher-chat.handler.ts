import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';
import { QueryHandler } from '#shared/domain/bus/query.handler';
import { GetTitlesTeacherChatQuery } from '#/teacher/application/chat/get-titles-teacher-chat/get-titles-teacher-chat.query';
import { Title } from '#academic-offering/domain/entity/title.entity';

export class GetTitlesTeacherChatHandler implements QueryHandler {
  constructor(
    private readonly internalGroupRepository: InternalGroupRepository,
  ) {}
  async handle(query: GetTitlesTeacherChatQuery): Promise<Title[]> {
    const internalGroups = await this.internalGroupRepository.getAllByTeacher(
      query.edaeUser.id,
    );

    const titles = internalGroups
      .filter(
        (internalGroup) =>
          internalGroup.academicPeriod.id === query.academicPeriodId,
      )
      .map((internalGroup) => internalGroup.academicProgram.title);

    return this.getUniqueTitles(titles);
  }

  private getUniqueTitles(titles: Title[]): Title[] {
    const seenIds = new Set<string>();

    return titles.filter((period) => {
      if (seenIds.has(period.id)) {
        return false;
      }

      seenIds.add(period.id);

      return true;
    });
  }
}
