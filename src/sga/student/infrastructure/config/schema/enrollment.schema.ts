import { EntitySchema } from 'typeorm';
import { Enrollment } from '#student/domain/entity/enrollment.entity';
import {
  BaseSchemaColumns,
  BaseSchemaRelations,
} from '#shared/infrastructure/config/schema/base.schema';
import { EnrollmentVisibilityEnum } from '#student/domain/enum/enrollment/enrollment-visibility.enum';
import { EnrollmentTypeEnum } from '#student/domain/enum/enrollment/enrollment-type.enum';

export const enrollmentSchema = new EntitySchema<Enrollment>({
  name: 'Enrollment',
  tableName: 'enrollments',
  target: Enrollment,
  columns: {
    ...BaseSchemaColumns,
    visibility: {
      type: String,
      enum: EnrollmentVisibilityEnum,
      nullable: false,
    },
    type: {
      type: String,
      enum: EnrollmentTypeEnum,
      nullable: false,
    },
    maxCalls: {
      name: 'max_calls',
      type: Number,
    },
  },
  relations: {
    ...BaseSchemaRelations,
    subject: {
      type: 'many-to-one',
      target: 'Subject',
      joinColumn: {
        name: 'subject_id',
      },
    },
    academicRecord: {
      type: 'many-to-one',
      target: 'AcademicRecord',
      joinColumn: {
        name: 'academic_record_id',
      },
    },
    programBlock: {
      type: 'many-to-one',
      target: 'ProgramBlock',
      joinColumn: {
        name: 'program_block_id',
      },
    },
    calls: {
      type: 'one-to-many',
      target: 'SubjectCall',
      inverseSide: 'enrollment',
    },
  },
});
