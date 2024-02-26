import { EntitySchema } from 'typeorm';
import { ExaminationCall } from '#academic-offering/domain/entity/examination-call.entity';
import { BaseSchemaColumns } from '#shared/infrastructure/config/schema/base.schema';
import { TimeZoneEnum } from '#shared/domain/enum/time-zone.enum';

export const examinationCallSchema = new EntitySchema<ExaminationCall>({
  name: 'ExaminationCall',
  target: ExaminationCall,
  tableName: 'examination_calls',
  columns: {
    ...BaseSchemaColumns,
    name: {
      type: String,
      nullable: false,
    },
    startDate: {
      name: 'start_date',
      type: 'timestamp',
    },
    endDate: {
      name: 'end_date',
      type: 'timestamp',
    },
    timezone: {
      type: 'enum',
      enum: TimeZoneEnum,
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
  },
});
