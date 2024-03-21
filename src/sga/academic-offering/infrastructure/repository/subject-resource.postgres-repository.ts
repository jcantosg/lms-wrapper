import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';
import { SubjectResource } from '#academic-offering/domain/entity/subject-resource.entity';
import { SubjectResourceRepository } from '#academic-offering/domain/repository/subject-resource.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { subjectResourceSchema } from '#academic-offering/infrastructure/config/schema/subject-resource.schema';
import { Repository } from 'typeorm';

export class SubjectResourcePostgresRepository
  extends TypeOrmRepository<SubjectResource>
  implements SubjectResourceRepository
{
  constructor(
    @InjectRepository(subjectResourceSchema)
    private repository: Repository<SubjectResource>,
  ) {
    super();
  }

  async save(subjectResource: SubjectResource): Promise<void> {
    await this.repository.save({
      id: subjectResource.id,
      name: subjectResource.name,
      url: subjectResource.url,
      size: subjectResource.size,
      subject: subjectResource.subject,
      createdAt: subjectResource.createdAt,
      updatedAt: subjectResource.updatedAt,
      createdBy: subjectResource.createdBy,
      updatedBy: subjectResource.updatedBy,
    });
  }

  async existsById(id: string): Promise<boolean> {
    const result = await this.repository.findOne({ where: { id } });

    return !!result;
  }

  async get(id: string): Promise<SubjectResource | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
