import { EntitySchema } from 'typeorm';
import {
  BaseSchemaColumns,
  BaseSchemaRelations,
} from '#shared/infrastructure/config/schema/base.schema';
import { PeriodBlock } from '#academic-offering/domain/entity/period-block.entity';
import { MonthEnum } from '#/sga/shared/domain/enum/month.enum';

export const periodBlockSchema = new EntitySchema<PeriodBlock>({
  name: 'PeriodBlock',
  tableName: 'period_blocks',
  target: PeriodBlock,
  columns: {
    ...BaseSchemaColumns,
    name: {
      type: String,
      nullable: false,
      default: 'Block',
    },
    startDate: {
      type: Date,
      nullable: false,
    },
    endDate: {
      type: Date,
      nullable: false,
    },
    startMonth: {
      name: 'start_month',
      type: 'enum',
      enum: MonthEnum,
      nullable: true,
    },
    academicYear: {
      name: 'academic_year',
      type: String,
      nullable: true,
    },
  },
  relations: {
    academicPeriod: {
      type: 'many-to-one',
      target: 'AcademicPeriod',
      joinColumn: {
        name: 'academic_period_id',
      },
    },
    blockRelation: {
      type: 'one-to-many',
      target: 'BlockRelation',
      inverseSide: 'periodBlock',
    },
    ...BaseSchemaRelations,
  },
});
