import { EntitySchema } from 'typeorm';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import {
  BaseSchemaColumns,
  BaseSchemaRelations,
} from '#shared/infrastructure/config/schema/base.schema';

export const examinationCenterSchema = new EntitySchema<ExaminationCenter>({
  name: 'ExaminationCenter',
  tableName: 'examination_centers',
  target: ExaminationCenter,
  columns: {
    ...BaseSchemaColumns,
    name: {
      type: String,
      nullable: false,
    },
    code: {
      type: String,
      nullable: false,
      unique: true,
    },
    isActive: {
      name: 'is_active',
      type: Boolean,
      nullable: false,
      default: true,
    },
    address: {
      type: String,
      nullable: false,
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
    businessUnits: {
      type: 'many-to-many',
      target: 'BusinessUnit',
      joinTable: {
        name: 'business_unit_examination_centers',
        joinColumn: {
          name: 'examination_center_id',
        },
        inverseJoinColumn: {
          name: 'business_unit_id',
        },
      },
    },
    classrooms: {
      type: 'one-to-many',
      target: 'Classroom',
      inverseSide: 'examinationCenter',
    },
    mainBusinessUnit: {
      type: 'one-to-one',
      target: 'BusinessUnit',
      joinColumn: {
        name: 'main_business_unit_id',
      },
    },
  },
});
