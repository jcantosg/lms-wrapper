import { QueryHandler } from '#shared/domain/bus/query.handler';
import { SubjectCallScheduleHistoryRepository } from '#student/domain/repository/subject-call-schedule-history.repository';
import { SubjectCallScheduleHistory } from '#student/domain/entity/subject-call-schedule-history.entity';
import { GetSubjectCallScheduleHistoryDetailQuery } from '#student/application/subject-call/get-subject-call-schedule-hisotry-detail/get-subject-call-schedule-hisotry-detail.query';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { SubjectCallScheduleHistoryNotFoundException } from '#shared/domain/exception/subject-call/subject-call-schedule-history.not-found.exception';

export class GetSubjectCallScheduleHistoryDetailHandler
  implements QueryHandler
{
  constructor(
    private readonly repository: SubjectCallScheduleHistoryRepository,
  ) {}

  async handle(
    query: GetSubjectCallScheduleHistoryDetailQuery,
  ): Promise<SubjectCallScheduleHistory> {
    const subjectCallSchdeulehistory = await this.repository.getByAdminUser(
      query.id,
      query.adminUser.businessUnits.map((bu) => bu.id),
      query.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    if (!subjectCallSchdeulehistory) {
      throw new SubjectCallScheduleHistoryNotFoundException();
    }

    return subjectCallSchdeulehistory;
  }
}
