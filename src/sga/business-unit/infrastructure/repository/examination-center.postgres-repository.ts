import { ExaminationCenterRepository } from '#business-unit/domain/repository/examination-center.repository';
import { Injectable } from '@nestjs/common';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { examinationCenterSchema } from '#business-unit/infrastructure/config/schema/examination-center.schema';
import { Repository } from 'typeorm';

@Injectable()
export class ExaminationCenterPostgresRepository
  implements ExaminationCenterRepository
{
  constructor(
    @InjectRepository(examinationCenterSchema)
    private repository: Repository<ExaminationCenter>,
  ) {}

  async save(examinationCenter: ExaminationCenter): Promise<void> {
    await this.repository.save(examinationCenter);
  }

  async existsByCode(code: string): Promise<boolean> {
    const result = await this.repository.findOne({ where: { code } });

    return !!result;
  }

  async existsById(id: string): Promise<boolean> {
    const result = await this.repository.findOne({ where: { id } });

    return !!result;
  }

  async existsByName(name: string): Promise<boolean> {
    const result = await this.repository.findOne({ where: { name } });

    return !!result;
  }

  async get(id: string): Promise<ExaminationCenter | null> {
    return await this.repository.findOne({
      where: { id },
      relations: { businessUnits: true },
    });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete({ id });
  }
}
