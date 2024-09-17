import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';
import { QueryHandler } from '#shared/domain/bus/query.handler';
import { GetSubjectsTeacherChatQuery } from '#/teacher/application/chat/get-subjects-teacher-chat/get-subjects-teacher-chat.query';
import { Subject } from '#academic-offering/domain/entity/subject.entity';

export class GetSubjectsTeacherChatHandler implements QueryHandler {
  constructor(
    private readonly internalGroupRepository: InternalGroupRepository,
  ) {}
  async handle(query: GetSubjectsTeacherChatQuery): Promise<Subject[]> {
    const internalGroups = await this.internalGroupRepository.getAllByTeacher(
      query.edaeUser.id,
    );

    const subjects = internalGroups
      .filter(
        (group) =>
          group.academicProgram.title.id === query.titleId &&
          group.academicPeriod.id === query.academicPeriodId,
      )
      .map((group) => group.subject);

    return this.getUniqueSubjects(subjects);
  }

  private getUniqueSubjects(subjects: Subject[]): Subject[] {
    const seenIds = new Set<string>();

    return subjects.filter((subject) => {
      if (seenIds.has(subject.id)) {
        return false;
      }

      seenIds.add(subject.id);

      return true;
    });
  }
}
