import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubjectCallScheduleHistory } from '#student/domain/entity/subject-call-schedule-history.entity';
import { SubjectCallScheduleHistoryRepository } from '#student/domain/repository/subject-call-schedule-history.repository';
import { subjectCallScheduleHistorySchema } from '#student/infrastructure/config/schema/subject-call-schedule-history.schema';
import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

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

  private initializeQueryBuilder(aliasQuery: string) {
    const queryBuilder = this.repository.createQueryBuilder(aliasQuery);

    queryBuilder.leftJoinAndSelect(`${aliasQuery}.createdBy`, 'created_by');
    queryBuilder.leftJoinAndSelect(
      `${aliasQuery}.businessUnit`,
      'business_unit',
    );
    queryBuilder.leftJoinAndSelect(
      `${aliasQuery}.academicPeriod`,
      'academic_period',
    );
    queryBuilder.leftJoinAndSelect(
      `${aliasQuery}.academicPrograms`,
      'academic_programs',
    );

    return queryBuilder;
  }

  async matching(
    criteria: Criteria,
    adminUserBusinessUnits: BusinessUnit[],
    isSuperAdmin: boolean,
  ): Promise<SubjectCallScheduleHistory[]> {
    const aliasQuery = 'subjectCallScheduleHistory';
    const queryBuilder = this.initializeQueryBuilder(aliasQuery);
    const baseRepository = isSuperAdmin
      ? this
      : await this.filterBusinessUnits(
          queryBuilder,
          'oneToMany',
          adminUserBusinessUnits,
        );

    return await (
      await baseRepository.convertCriteriaToQueryBuilder(
        criteria,
        queryBuilder,
        aliasQuery,
      )
    )
      .applyOrder(criteria, queryBuilder, aliasQuery)
      .getMany(queryBuilder);
  }
}
