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
    });
  }

  async delete(subjectCall: SubjectCall): Promise<void> {
    await this.repository.delete(subjectCall.id);
  }

  async get(id: string): Promise<SubjectCall | null> {
    return await this.repository.findOne({
      relations: {
        enrollment: true,
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
      .andWhere('enrollment.businessUnit IN (:...businessUnits)', {
        businessUnits: adminUserBusinessUnits,
      })
      .getOne();
  }
}
