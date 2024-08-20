import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';
import { SubjectCall } from '#student/domain/entity/subject-call.entity';
import { SubjectCallRepository } from '#student/domain/repository/subject-call.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { subjectCallSchema } from '#student/infrastructure/config/schema/subject-call.schema';

export class SubjectCallPostgresRepository
  extends TypeOrmRepository<SubjectCall>
  implements SubjectCallRepository
{
  constructor(
    @InjectRepository(subjectCallSchema)
    private readonly repository: Repository<SubjectCall>,
  ) {
    super();
  }

  private initializeQueryBuilder(aliasQuery: string) {
    const queryBuilder = this.repository.createQueryBuilder(aliasQuery);

    queryBuilder.leftJoinAndSelect(`${aliasQuery}.enrollment`, 'enrollment');
    queryBuilder.leftJoinAndSelect(
      'enrollment.academicRecord',
      'academicRecord',
    );
    queryBuilder.leftJoinAndSelect(
      'academicRecord.businessUnit',
      'businessUnit',
    );

    return queryBuilder;
  }

  async save(subjectCall: SubjectCall): Promise<void> {
    await this.repository.save({
      id: subjectCall.id,
      enrollment: subjectCall.enrollment,
      callNumber: subjectCall.callNumber,
      finalGrade: subjectCall.finalGrade,
      status: subjectCall.status,
      callDate: subjectCall.callDate,
      createdBy: subjectCall.createdBy,
      updatedBy: subjectCall.updatedBy,
      createdAt: subjectCall.createdAt,
      updatedAt: subjectCall.updatedAt,
    });
  }

  async saveBatch(subjectCalls: SubjectCall[]): Promise<void> {
    const queryRunner = this.repository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const subjectCall of subjectCalls) {
        await queryRunner.manager.save(SubjectCall, {
          id: subjectCall.id,
          enrollment: subjectCall.enrollment,
          callNumber: subjectCall.callNumber,
          finalGrade: subjectCall.finalGrade,
          status: subjectCall.status,
          callDate: subjectCall.callDate,
          createdBy: subjectCall.createdBy,
          updatedBy: subjectCall.updatedBy,
          createdAt: subjectCall.createdAt,
          updatedAt: subjectCall.updatedAt,
        });
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async delete(subjectCall: SubjectCall): Promise<void> {
    await this.repository.delete(subjectCall.id);
  }

  async get(id: string): Promise<SubjectCall | null> {
    return await this.repository.findOne({
      relations: {
        enrollment: {
          academicRecord: {
            businessUnit: true,
          },
        },
      },
      where: { id },
    });
  }

  async getByAdminUser(
    id: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<SubjectCall | null> {
    if (isSuperAdmin) {
      return await this.get(id);
    }

    adminUserBusinessUnits = this.normalizeAdminUserBusinessUnits(
      adminUserBusinessUnits,
    );

    const queryBuilder = this.initializeQueryBuilder('subjectCall');

    return await queryBuilder
      .where('subjectCall.id = :id', { id })
      .andWhere('businessUnit.id IN (:...businessUnits)', {
        businessUnits: adminUserBusinessUnits,
      })
      .getOne();
  }

  async existsById(id: string): Promise<boolean> {
    const subjectCall = await this.repository.findOne({
      where: { id },
    });

    return !!subjectCall;
  }
}
