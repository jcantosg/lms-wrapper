import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from '#shared/domain/entity/country.entity';
import { CountryRepository } from '#shared/domain/repository/country.repository';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';

@Injectable()
export class CountryPostgresRepository implements CountryRepository {
  constructor(
    @InjectRepository(CountrySchema)
    private readonly repository: Repository<Country>,
  ) {}

  async save(country: Country): Promise<void> {
    await this.repository.save(country);
  }

  async getAll(): Promise<Country[]> {
    return await this.repository.find({
      order: { name: { direction: 'ASC' } },
    });
  }

  async get(id: string): Promise<Country | null> {
    return await this.repository.findOne({ where: { id } });
  }
}
