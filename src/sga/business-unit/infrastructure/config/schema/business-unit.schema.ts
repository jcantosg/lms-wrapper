import { EntitySchema } from 'typeorm';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import {
  BaseSchemaColumns,
  BaseSchemaRelations,
} from '#shared/infrastructure/config/schema/base.schema';

export const businessUnitSchema = new EntitySchema<BusinessUnit>({
  name: 'BusinessUnit',
  tableName: 'business_units',
  target: BusinessUnit,
  columns: {
    ...BaseSchemaColumns,
    name: {
      type: String,
      unique: true,
      nullable: false,
    },
    code: {
      type: String,
      unique: true,
      nullable: false,
    },
    isActive: {
      type: Boolean,
      nullable: false,
      default: true,
      name: 'is_active',
    },
  },
  relations: {
    ...BaseSchemaRelations,
    country: {
      type: 'many-to-one',
      target: 'Country',
      joinColumn: {
        name: 'country_id',
      },
    },
    virtualCampuses: {
      type: 'one-to-many',
      target: 'VirtualCampus',
      inverseSide: 'businessUnit',
    },
  },
});
