import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Title } from '#academic-offering/domain/entity/title.entity';
import { TitleRepository } from '#academic-offering/domain/repository/title.repository';
import { titleSchema } from '#academic-offering/infrastructure/config/schema/title.schema';

export class TitlePostgresRepository
  extends TypeOrmRepository<Title>
  implements TitleRepository
{
  constructor(
    @InjectRepository(titleSchema)
    private readonly repository: Repository<Title>,
  ) {
    super();
  }

  async exists(id: string): Promise<boolean> {
    const result = await this.repository.findOne({ where: { id } });

    return !!result;
  }

  async save(title: Title): Promise<void> {
    await this.repository.save({
      id: title.id,
      name: title.name,
      officialCode: title.officialCode,
      officialTitle: title.officialTitle,
      officialProgram: title.officialProgram,
      businessUnit: title.businessUnit,
      createdAt: title.createdAt,
      updatedAt: title.updatedAt,
      createdBy: title.createdBy,
      updatedBy: title.updatedBy,
    });
  }
}
