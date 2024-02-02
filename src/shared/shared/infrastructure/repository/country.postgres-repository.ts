import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from '#shared/domain/entity/country.entity';
import { CountryRepository } from '#shared/domain/repository/country.repository';
import { CountrySchema } from '#shared/infrastructure/config/schema/country.schema';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { examinationCenterSchema } from '#business-unit/infrastructure/config/schema/examination-center.schema';

type tableOptions = {
  [key: string]: string;
};
const entityFilterTables: tableOptions = {
  businessUnit: businessUnitSchema.options.name,
  examinationCenter: examinationCenterSchema.options.name,
};

@Injectable()
export class CountryPostgresRepository implements CountryRepository {
  constructor(
    @InjectRepository(CountrySchema)
    private readonly repository: Repository<Country>,
  ) {}

  async save(country: Country): Promise<void> {
    await this.repository.save(country);
  }

  async getAll(filter: string | undefined): Promise<Country[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('country')
      .orderBy('country.name', 'ASC');

    if (filter) {
      const relatedEntity = entityFilterTables[filter];
      queryBuilder
        .innerJoin(relatedEntity, filter, `${filter}.country_id = country.id`)
        .select();
    }

    return await queryBuilder.getMany();
  }

  async get(id: string): Promise<Country | null> {
    return await this.repository.findOne({ where: { id } });
  }
}
