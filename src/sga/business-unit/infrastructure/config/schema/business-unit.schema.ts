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
    examinationCenters: {
      type: 'many-to-many',
      target: 'ExaminationCenter',
      joinTable: {
        name: 'business_unit_examination_centers',
        joinColumn: {
          name: 'business_unit_id',
        },
        inverseJoinColumn: {
          name: 'examination_center_id',
        },
      },
    },
    academicPeriods: {
      type: 'one-to-many',
      target: 'AcademicPeriod',
      inverseSide: 'businessUnit',
    },
  },
});
