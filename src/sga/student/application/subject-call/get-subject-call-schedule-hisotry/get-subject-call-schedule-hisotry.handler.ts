import { QueryHandler } from '#shared/domain/bus/query.handler';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { SubjectCallScheduleHistoryRepository } from '#student/domain/repository/subject-call-schedule-history.repository';
import { SubjectCallScheduleHistory } from '#student/domain/entity/subject-call-schedule-history.entity';
import { GetSubjectCallScheduleHistoryQuery } from '#student/application/subject-call/get-subject-call-schedule-hisotry/get-subject-call-schedule-hisotry.query';
import { SubjectCallScheduleHistoryCriteria } from '#student/application/subject-call/get-subject-call-schedule-hisotry/get-subject-call-schedule-hisotry.criteria';

export class GetSubjectCallScheduleHistoryHandler implements QueryHandler {
  constructor(
    private readonly repository: SubjectCallScheduleHistoryRepository,
  ) {}

  async handle(
    query: GetSubjectCallScheduleHistoryQuery,
  ): Promise<SubjectCallScheduleHistory[]> {
    const criteria = new SubjectCallScheduleHistoryCriteria(query);

    return await this.repository.matching(
      criteria,
      query.adminUser.businessUnits,
      query.adminUser.roles.includes(AdminUserRoles.SUPERADMIN),
    );
  }
}
