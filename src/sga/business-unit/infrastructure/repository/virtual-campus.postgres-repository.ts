import { VirtualCampusRepository } from '#business-unit/domain/repository/virtual-campus.repository';
import { VirtualCampus } from '#business-unit/domain/entity/virtual-campus.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { virtualCampusSchema } from '#business-unit/infrastructure/config/schema/virtual-campus.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VirtualCampusPostgresRepository
  implements VirtualCampusRepository
{
  constructor(
    @InjectRepository(virtualCampusSchema)
    private repository: Repository<VirtualCampus>,
  ) {}

  async save(virtualCampus: VirtualCampus): Promise<void> {
    await this.repository.save(virtualCampus);
  }
}
