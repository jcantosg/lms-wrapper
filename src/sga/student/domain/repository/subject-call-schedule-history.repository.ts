import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { SubjectCallScheduleHistory } from '#student/domain/entity/subject-call-schedule-history.entity';

export abstract class SubjectCallScheduleHistoryRepository {
  abstract save(
    subjectCallScheduleHistory: SubjectCallScheduleHistory,
  ): Promise<void>;

  abstract matching(
    criteria: Criteria,
    adminUserBusinessUnits: BusinessUnit[],
    isSuperAdmin: boolean,
  ): Promise<SubjectCallScheduleHistory[]>;
}
