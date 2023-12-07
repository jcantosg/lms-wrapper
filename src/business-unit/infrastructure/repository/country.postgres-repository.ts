import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CountrySchema } from '../config/schema/country.schema';
import { CountryRepository } from '../../domain/repository/country.repository';
import { Country } from '../../domain/entity/country.entity';

@Injectable()
export class CountryPostgresRepository implements CountryRepository {
  constructor(
    @InjectRepository(CountrySchema)
    private readonly repository: Repository<Country>,
  ) {}

  async save(country: Country): Promise<void> {
    await this.repository.save(country);
  }

  async existsById(id: string): Promise<boolean> {
    const country = await this.repository.findOne({ where: { id } });

    return !!country;
  }
}
