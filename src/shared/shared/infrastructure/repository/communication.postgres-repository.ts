import { Communication } from '#shared/domain/entity/communication.entity';
import { CommunicationSchema } from '#shared/infrastructure/config/schema/communication.schema';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CommunicationPostgresRepository {
  constructor(
    @InjectRepository(CommunicationSchema)
    private readonly repository: Repository<Communication>,
  ) {}

  async save(communication: Communication): Promise<void> {
    await this.repository.save(communication);
  }

  async exists(id: string): Promise<boolean> {
    const result = await this.repository.findOne({ where: { id } });

    return !!result;
  }
}
