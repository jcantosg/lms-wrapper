import { Injectable } from '@nestjs/common';
import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';
import { AdministrativeGroup } from '#student/domain/entity/administrative-group.entity';
import { AdministrativeGroupRepository } from '#student/domain/repository/administrative-group.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { administrativeGroupSchema } from '#student/infrastructure/config/schema/administrative-group.schema';

@Injectable()
export class AdministrativeGroupPostgresRepository
  extends TypeOrmRepository<AdministrativeGroup>
  implements AdministrativeGroupRepository
{
  constructor(
    @InjectRepository(administrativeGroupSchema)
    private readonly repository: Repository<AdministrativeGroup>,
  ) {
    super();
  }

  async save(administrativeGroup: AdministrativeGroup): Promise<void> {
    await this.repository.save({
      id: administrativeGroup.id,
      code: administrativeGroup.code,
      businessUnit: administrativeGroup.businessUnit,
      academicPeriod: administrativeGroup.academicPeriod,
      academicProgram: administrativeGroup.academicProgram,
      programBlock: administrativeGroup.programBlock,
      students: administrativeGroup.students,
      teachers: administrativeGroup.teachers,
      createdAt: administrativeGroup.createdAt,
      createdBy: administrativeGroup.createdBy,
      updatedAt: administrativeGroup.updatedAt,
      updatedBy: administrativeGroup.updatedBy,
    });
  }

  async existsById(id: string): Promise<boolean> {
    const administrativeGroup = await this.repository.findOne({
      where: { id },
    });

    return !!administrativeGroup;
  }

  async existsByCode(id: string, code: string): Promise<boolean> {
    const result = await this.repository.findOne({
      where: { code },
    });

    return result !== null && result.id !== id;
  }

  async saveBatch(administrativeGroups: AdministrativeGroup[]): Promise<void> {
    await this.repository.save(administrativeGroups);
  }
}
