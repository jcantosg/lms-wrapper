import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessUnitRepository } from '#business-unit/domain/repository/business-unit.repository';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

@Injectable()
export class BusinessUnitPostgresRepository implements BusinessUnitRepository {
  constructor(
    @InjectRepository(businessUnitSchema)
    private readonly repository: Repository<BusinessUnit>,
  ) {}

  async save(businessUnit: BusinessUnit): Promise<void> {
    await this.repository.save(businessUnit);
  }

  async get(id: string): Promise<BusinessUnit | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async existsById(id: string): Promise<boolean> {
    const result = await this.repository.findOne({ where: { id } });

    return !!result;
  }

  async existsByName(name: string): Promise<boolean> {
    const result = await this.repository.findOne({ where: { name } });

    return !!result;
  }

  async existsByCode(code: string): Promise<boolean> {
    const result = await this.repository.findOne({ where: { code } });

    return !!result;
  }

  async update(businessUnit: BusinessUnit): Promise<void> {
    await this.repository.update(businessUnit.id, {
      name: businessUnit.name,
      code: businessUnit.code,
      isActive: businessUnit.isActive,
      updatedAt: businessUnit.updatedAt,
      updatedBy: businessUnit.updatedBy,
    });
  }
}
