import { SubjectCallScheduleHistory } from '#student/domain/entity/subject-call-schedule-history.entity';

export abstract class SubjectCallScheduleHistoryRepository {
  abstract save(
    subjectCallScheduleHistory: SubjectCallScheduleHistory,
  ): Promise<void>;
}
