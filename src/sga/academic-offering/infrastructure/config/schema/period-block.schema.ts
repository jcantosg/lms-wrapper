import { EntitySchema } from 'typeorm';
import {
  BaseSchemaColumns,
  BaseSchemaRelations,
} from '#shared/infrastructure/config/schema/base.schema';
import { PeriodBlock } from '#academic-offering/domain/entity/period-block.entity';

export const periodBlockSchema = new EntitySchema<PeriodBlock>({
  name: 'PeriodBlock',
  tableName: 'period_blocks',
  target: PeriodBlock,
  columns: {
    ...BaseSchemaColumns,
    startDate: {
      type: Date,
      nullable: false,
    },
    endDate: {
      type: Date,
      nullable: false,
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
    ...BaseSchemaRelations,
  },
});
