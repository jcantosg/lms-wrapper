import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubjectCallScheduleHistory } from '#student/domain/entity/subject-call-schedule-history.entity';
import { SubjectCallScheduleHistoryRepository } from '#student/domain/repository/subject-call-schedule-history.repository';
import { subjectCallScheduleHistorySchema } from '#student/infrastructure/config/schema/subject-call-schedule-history.schema';

export class SubjectCallScheduleHistoryPostgresRepository
  extends TypeOrmRepository<SubjectCallScheduleHistory>
  implements SubjectCallScheduleHistoryRepository
{
  constructor(
    @InjectRepository(subjectCallScheduleHistorySchema)
    private readonly repository: Repository<SubjectCallScheduleHistory>,
  ) {
    super();
  }

  async save(
    subjectCallScheduleHistory: SubjectCallScheduleHistory,
  ): Promise<void> {
    await this.repository.save({
      id: subjectCallScheduleHistory.id,
      createdBy: subjectCallScheduleHistory.createdBy,
      updatedBy: subjectCallScheduleHistory.updatedBy,
      createdAt: subjectCallScheduleHistory.createdAt,
      updatedAt: subjectCallScheduleHistory.updatedAt,
      academicPeriod: subjectCallScheduleHistory.academicPeriod,
      academicPrograms: subjectCallScheduleHistory.academicPrograms,
      businessUnit: subjectCallScheduleHistory.businessUnit,
    });
  }
}
