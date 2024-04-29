import { VirtualCampusRepository } from '#business-unit/domain/repository/virtual-campus.repository';
import { VirtualCampus } from '#business-unit/domain/entity/virtual-campus.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { virtualCampusSchema } from '#business-unit/infrastructure/config/schema/virtual-campus.schema';
import { Injectable } from '@nestjs/common';
import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';

@Injectable()
export class VirtualCampusPostgresRepository
  extends TypeOrmRepository<VirtualCampus>
  implements VirtualCampusRepository
{
  constructor(
    @InjectRepository(virtualCampusSchema)
    private repository: Repository<VirtualCampus>,
  ) {
    super();
  }

  async save(virtualCampus: VirtualCampus): Promise<void> {
    await this.repository.save(virtualCampus);
  }

  async existsById(id: string): Promise<boolean> {
    const result = await this.repository.findOne({ where: { id } });

    return !!result;
  }

  async get(id: string): Promise<VirtualCampus | null> {
    return await this.repository.findOne({
      where: { id },
      relations: { businessUnit: true },
    });
  }

  async update(virtualCampus: VirtualCampus): Promise<void> {
    await this.repository.update(virtualCampus.id, {
      name: virtualCampus.name,
      code: virtualCampus.code,
      updatedAt: virtualCampus.updatedAt,
      updatedBy: virtualCampus.updatedBy,
      isActive: virtualCampus.isActive,
      businessUnit: virtualCampus.businessUnit,
    });
  }

  async existsByCode(id: string, code: string): Promise<boolean> {
    const result = await this.repository.findOne({ where: { code } });

    return result === null ? false : result.id !== id;
  }

  async existsByName(id: string, name: string): Promise<boolean> {
    const result = await this.repository.findOne({ where: { name } });

    return result === null ? false : result.id !== id;
  }

  async getByBusinessUnit(businessUnitId: string): Promise<VirtualCampus[]> {
    return await this.repository.find({
      where: {
        businessUnit: {
          id: businessUnitId,
        },
      },
    });
  }
}
