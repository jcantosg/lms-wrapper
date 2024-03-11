import { EntitySchema } from 'typeorm';
import { EvaluationType } from '#academic-offering/domain/entity/evaluation-type.entity';
import {
  BaseSchemaColumns,
  BaseSchemaRelations,
} from '#shared/infrastructure/config/schema/base.schema';

export const evaluationTypeSchema = new EntitySchema<EvaluationType>({
  name: 'EvaluationType',
  tableName: 'evaluation_types',
  target: EvaluationType,
  columns: {
    ...BaseSchemaColumns,
    name: {
      type: String,
      nullable: false,
    },
    percentageVirtualCampus: {
      name: 'percentage_virtual_campus',
      type: 'float',
    },
    percentageAttendance: {
      name: 'percentage_attendance',
      type: 'float',
    },
    percentageProject: {
      name: 'percentage_project',
      type: 'float',
    },
    isPassed: {
      name: 'is_passed',
      type: Boolean,
      default: true,
      nullable: false,
    },
  },
  relations: {
    ...BaseSchemaRelations,
    businessUnits: {
      type: 'many-to-many',
      target: 'BusinessUnit',
      joinTable: {
        name: 'evaluation_type_business_units',
        joinColumn: {
          name: 'evaluation_type_id',
        },
        inverseJoinColumn: {
          name: 'business_unit_id',
        },
      },
    },
  },
});
