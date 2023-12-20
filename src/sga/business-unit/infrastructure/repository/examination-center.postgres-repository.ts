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
}
