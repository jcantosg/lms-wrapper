import { QueryHandler } from '#shared/domain/bus/query.handler';
import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';
import { GetAcademicPeriodsTeacherChatQuery } from '#/teacher/application/chat/get-academic-periods-teacher-chat/get-academic-periods-teacher-chat.query';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';

export class GetAcademicPeriodsTeacherChatHandler implements QueryHandler {
  constructor(
    private readonly internalGroupRepository: InternalGroupRepository,
  ) {}

  async handle(
    query: GetAcademicPeriodsTeacherChatQuery,
  ): Promise<AcademicPeriod[]> {
    const internalGroups = await this.internalGroupRepository.getAllByTeacher(
      query.edaeUser.id,
    );

    const academicPeriods = internalGroups
      .filter(
        (internalGroup) =>
          internalGroup.businessUnit.id === query.businessUnitId,
      )
      .map((internalGroup) => internalGroup.academicPeriod);

    return this.getUniqueAcademicPeriods(academicPeriods);
  }

  private getUniqueAcademicPeriods(
    academicPeriods: AcademicPeriod[],
  ): AcademicPeriod[] {
    const seenIds = new Set<string>();

    return academicPeriods.filter((period) => {
      if (seenIds.has(period.id)) {
        return false;
      }

      seenIds.add(period.id);

      return true;
    });
  }
}
