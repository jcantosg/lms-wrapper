import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';
import { Enrollment } from '#student/domain/entity/enrollment.entity';
import { EnrollmentRepository } from '#student/domain/repository/enrollment.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { enrollmentSchema } from '#student/infrastructure/config/schema/enrollment.schema';
import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';

export class EnrollmentPostgresRepository
  extends TypeOrmRepository<Enrollment>
  implements EnrollmentRepository
{
  constructor(
    @InjectRepository(enrollmentSchema)
    private readonly repository: Repository<Enrollment>,
  ) {
    super();
  }

  async save(enrollment: Enrollment): Promise<void> {
    await this.repository.save({
      id: enrollment.id,
      subject: enrollment.subject,
      academicRecord: enrollment.academicRecord,
      visibility: enrollment.visibility,
      type: enrollment.type,
      programBlock: enrollment.programBlock,
      calls: enrollment.calls,
      maxCalls: enrollment.maxCalls,
    });
  }

  async get(id: string): Promise<Enrollment | null> {
    return await this.repository.findOne({
      where: { id },
      relations: { calls: true },
      order: {
        calls: {
          callNumber: 'DESC',
          callDate: 'DESC',
        },
      },
    });
  }

  async getByAcademicRecord(
    academicRecord: AcademicRecord,
  ): Promise<Enrollment[]> {
    return await this.repository.find({
      where: { academicRecord: { id: academicRecord.id } },
      relations: { calls: true, subject: true },
      order: {
        calls: {
          callNumber: 'DESC',
          callDate: 'DESC',
        },
      },
    });
  }

  async matching(criteria: Criteria): Promise<Enrollment[]> {
    const queryBuilder = this.initializeQueryBuilder('enrollment');
    let criteriaToQueryBuilder = await this.convertCriteriaToQueryBuilder(
      criteria,
      queryBuilder,
      'enrollment',
    );
    if (criteria.page !== null && criteria.limit !== null) {
      criteriaToQueryBuilder = criteriaToQueryBuilder.applyPagination(
        criteria,
        queryBuilder,
      );
    }
    if (criteria.order !== null) {
      criteriaToQueryBuilder.applyOrder(criteria, queryBuilder, 'enrollment');
    }

    return await this.getMany(queryBuilder);
  }

  async delete(enrollment: Enrollment): Promise<void> {
    await this.repository.delete(enrollment.id);
  }

  private initializeQueryBuilder(aliasQuery: string) {
    const queryBuilder = this.repository.createQueryBuilder(aliasQuery);

    queryBuilder.leftJoinAndSelect(`${aliasQuery}.calls`, 'subjectCall');

    queryBuilder.leftJoinAndSelect(
      `${aliasQuery}.academicRecord`,
      'academicRecord',
    );
    queryBuilder.leftJoinAndSelect(
      'academicRecord.businessUnit',
      'businessUnit',
    );
    queryBuilder.leftJoinAndSelect(`${aliasQuery}.subject`, 'subject');
    queryBuilder.leftJoinAndSelect(
      `${aliasQuery}.programBlock`,
      'programBlock',
    );

    return queryBuilder;
  }

  async getByAdminUser(
    enrollmentId: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<Enrollment | null> {
    const queryBuilder = this.initializeQueryBuilder('enrollment');

    if (isSuperAdmin) {
      return await this.get(enrollmentId);
    }

    adminUserBusinessUnits = this.normalizeAdminUserBusinessUnits(
      adminUserBusinessUnits,
    );

    return await queryBuilder
      .where('enrollment.id = :id', { id: enrollmentId })
      .andWhere('academicRecord.businessUnit.id IN(:...ids)', {
        ids: adminUserBusinessUnits,
      })
      .orderBy('subjectCall.callNumber', 'DESC')
      .addOrderBy('subjectCall.callDate', 'DESC')
      .getOne();
  }
}
