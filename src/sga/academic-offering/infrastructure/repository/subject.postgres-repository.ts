import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { subjectSchema } from '#academic-offering/infrastructure/config/schema/subject.schema';
import { Repository } from 'typeorm';

export class SubjectPostgresRepository
  extends TypeOrmRepository<Subject>
  implements SubjectRepository
{
  constructor(
    @InjectRepository(subjectSchema)
    private readonly repository: Repository<Subject>,
  ) {
    super();
  }

  async exists(id: string): Promise<boolean> {
    const result = await this.repository.findOne({ where: { id } });

    return !!result;
  }

  async existsByCode(id: string, code: string): Promise<boolean> {
    const result = await this.repository.findOne({ where: { code } });

    return !result ? false : result.id !== id;
  }

  async save(subject: Subject): Promise<void> {
    await this.repository.save({
      id: subject.id,
      name: subject.name,
      code: subject.code,
      officialCode: subject.officialCode,
      hours: subject.hours,
      modality: subject.modality,
      evaluationType: subject.evaluationType,
      type: subject.type,
      businessUnit: subject.businessUnit,
      teachers: subject.teachers,
      createdAt: subject.createdAt,
      updatedAt: subject.updatedAt,
      createdBy: subject.createdBy,
      updatedBy: subject.updatedBy,
      isRegulated: subject.isRegulated,
      isCore: subject.isCore,
    });
  }
}
