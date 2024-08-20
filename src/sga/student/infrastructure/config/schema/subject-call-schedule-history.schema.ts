import { EntitySchema } from 'typeorm';
import {
  BaseSchemaColumns,
  BaseSchemaRelations,
} from '#shared/infrastructure/config/schema/base.schema';
import { SubjectCallScheduleHistory } from '#student/domain/entity/subject-call-schedule-history.entity';

export const subjectCallScheduleHistorySchema =
  new EntitySchema<SubjectCallScheduleHistory>({
    name: 'SubjectCallScheduleHistory',
    tableName: 'subject_calls_schedule_history',
    target: SubjectCallScheduleHistory,
    columns: {
      ...BaseSchemaColumns,
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
      academicPeriod: {
        type: 'many-to-one',
        target: 'AcademicPeriod',
        joinColumn: {
          name: 'academic_period_id',
        },
      },
      academicPrograms: {
        type: 'many-to-many',
        target: 'AcademicProgram',
        joinTable: {
          name: 'subject_calls_schedule_history_academic_program',
          joinColumn: {
            name: 'subject_calls_schedule_history_id',
          },
          inverseJoinColumn: {
            name: 'academic_program_id',
          },
        },
      },
    },
  });
