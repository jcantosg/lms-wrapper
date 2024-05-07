import { EntitySchema } from 'typeorm';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import {
  BaseSchemaColumns,
  BaseSchemaRelations,
} from '#shared/infrastructure/config/schema/base.schema';

export const academicPeriodSchema = new EntitySchema<AcademicPeriod>({
  name: 'AcademicPeriod',
  tableName: 'academic_periods',
  target: AcademicPeriod,
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
    startDate: {
      name: 'start_date',
      type: 'timestamp',
      nullable: false,
    },
    endDate: {
      name: 'end_date',
      type: 'timestamp',
      nullable: false,
    },
    blocksNumber: {
      name: 'blocks_number',
      type: Number,
      nullable: false,
    },
  },
  relations: {
    ...BaseSchemaRelations,
    businessUnit: {
      type: 'many-to-one',
      target: 'BusinessUnit',
      joinColumn: {
        name: 'business_unit_id',
      },
    },
    academicPrograms: {
      type: 'many-to-many',
      target: 'AcademicProgram',
      joinTable: {
        name: 'academic_periods_academic_programs',
        joinColumn: {
          name: 'academic_period_id',
        },
        inverseJoinColumn: {
          name: 'academic_program_id',
        },
      },
    },
    periodBlocks: {
      type: 'one-to-many',
      target: 'PeriodBlock',
      inverseSide: 'academicPeriod',
    },
  },
});
