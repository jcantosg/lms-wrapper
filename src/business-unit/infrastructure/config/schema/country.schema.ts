import { EntitySchema } from 'typeorm';
import { Country } from '../../../domain/entity/country.entity';
import { BaseSchemaColumns } from '../../../../shared/infrastructure/config/schema/base.schema';

export const CountrySchema = new EntitySchema<Country>({
  name: 'Country',
  tableName: 'countries',
  target: Country,
  columns: {
    ...BaseSchemaColumns,
    iso: {
      type: String,
      unique: true,
    },
    iso3: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      unique: true,
    },
    phoneCode: {
      type: String,
    },
    emoji: {
      type: String,
      unique: true,
    },
  },
});
